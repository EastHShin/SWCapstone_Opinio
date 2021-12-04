package com.opinio.plantrowth.service.payment;

import com.google.gson.Gson;
import com.opinio.plantrowth.api.dto.payment.RefundRequestDTO;
import com.opinio.plantrowth.domain.payment.PaymentRecord;
import com.opinio.plantrowth.domain.payment.PaymentStatus;
import com.opinio.plantrowth.domain.payment.PaymentType;
import com.opinio.plantrowth.domain.payment.Subscription;
import com.opinio.plantrowth.domain.user.User;
import com.opinio.plantrowth.repository.payment.PaymentRecordRepository;
import com.opinio.plantrowth.repository.payment.SubscriptionRepository;
import com.opinio.plantrowth.repository.user.UserRepository;

import lombok.RequiredArgsConstructor;

import org.json.simple.JSONObject;
import org.json.simple.parser.JSONParser;
import org.json.simple.parser.ParseException;
import org.springframework.http.*;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.web.client.RestTemplate;

import java.time.LocalDate;
import java.util.HashMap;
import java.util.Map;
import java.util.Optional;

@Transactional(readOnly = true)
@RequiredArgsConstructor
@Service
public class BillingService {

	private final SubscriptionRepository subscriptionRepository;
	private final UserRepository userRepository;
	private final PaymentRecordRepository paymentRecordRepository;

	private static final String IMP_KEY = "2028448220218951";
	private static final String IMP_SECRET = "64c6c5c167fffb894c40fe19650ea7b19a6ae2fa05dd33ead0b1e168fb33285d9014e7da5ccfcbb8";
	private static final Integer amountToBePaidForDiagnosis = 5900;
	private static final Integer amountToBePaidForSlot = 1000;
	private static final Long SUBSCRIPTION_MONTH = 1L;

	public String getToken() throws ParseException {
		RestTemplate restTemplate = new RestTemplate();

		HttpHeaders headers = new HttpHeaders();

		headers.setContentType(MediaType.APPLICATION_JSON);

		Map<String, Object> map = new HashMap<>();
		map.put("imp_key", IMP_KEY);
		map.put("imp_secret", IMP_SECRET);

		Gson gson = new Gson();
		String json = gson.toJson(map);

		HttpEntity<String> entity = new HttpEntity<>(json, headers);

		String data = restTemplate.postForObject("https://api.iamport.kr/users/getToken", entity, String.class);
		JSONParser jsonParser = new JSONParser();
		Object obj = jsonParser.parse(data);
		JSONObject jsonObject = (JSONObject)obj;
		JSONObject responseJson = (JSONObject)jsonObject.get("response");
		String access_token = responseJson.get("access_token").toString();
		return access_token;
	}

	public Integer getPaymentData(String accessToken, String imp_uid) throws ParseException, IllegalAccessException {
		RestTemplate restTemplate = new RestTemplate();
		HttpHeaders headers = new HttpHeaders();
		headers.setContentType(MediaType.APPLICATION_JSON);
		headers.set("Authorization", accessToken);

		HttpEntity entity = new HttpEntity<>(headers);
		ResponseEntity<String> response = restTemplate.exchange("https://api.iamport.kr/payments/{imp_uid}",
			HttpMethod.GET,
			entity, String.class, imp_uid);

		String res = response.getBody();
		JSONParser jsonParser = new JSONParser();
		Object obj = jsonParser.parse(res);
		JSONObject jsonObject = (JSONObject)obj;
		JSONObject responseObj = (JSONObject)jsonObject.get("response");
		Integer amount = Integer.parseInt(responseObj.get("amount").toString());
		return amount;
	}

	@Transactional
	public void subscribe(Integer amount, Long userId, String impUid, String merchantUid) throws IllegalAccessException {
		if (amount == amountToBePaidForDiagnosis) {
			User user = userRepository.findById(userId)
				.orElseThrow(() -> new IllegalArgumentException("no User found"));
			user.setSubscription(true);
			Subscription subscription = Subscription.builder()
				.user(user)
				.start(LocalDate.now())
				.end(LocalDate.now().plusMonths(SUBSCRIPTION_MONTH))
				.build();
			subscriptionRepository.save(subscription);
			PaymentRecord paymentRecord = PaymentRecord.builder()
				.user(user)
				.impUid(impUid)
				.merchantUid(merchantUid)
				.amount(amount)
				.cancelAmount(0)
				.paymentType(PaymentType.SUBSCRIPTION)
				.paymentStatus(PaymentStatus.PAYMENT)
				.date(LocalDate.now())
				.build();
			paymentRecordRepository.save(paymentRecord);

		} else {
			throw new IllegalAccessException("forgery Billing");
		}
	}

	@Transactional
	public User payForSlot(Integer amount, Long userId, String impUid, String merchantUid) throws IllegalAccessException {
		if (amount == amountToBePaidForSlot) {
			User user = userRepository.findById(userId)
				.orElseThrow(() -> new IllegalArgumentException("no User found"));
			Integer maxPlantNum = user.getMaxPlantNum();
			user.setMaxPlantNum(maxPlantNum + 1);
			PaymentRecord paymentRecord = PaymentRecord.builder()
				.user(user)
				.impUid(impUid)
				.merchantUid(merchantUid)
				.amount(amount)
				.cancelAmount(0)
				.paymentType(PaymentType.SLOT)
				.paymentStatus(PaymentStatus.PAYMENT)
				.date(LocalDate.now())
				.build();
			paymentRecordRepository.save(paymentRecord);
			return user;
		} else {
			throw new IllegalAccessException("forgery Billing");
		}
	}

	public PaymentRecord findPaymentInfo(String merchant_uid) {
		PaymentRecord paymentRecord = paymentRecordRepository.findByMerchantUid(merchant_uid)
			.orElseThrow(() -> new IllegalArgumentException("No Record Found"));
		return paymentRecord;
	}

	@Transactional
	public void refund(PaymentRecord paymentInfo, RefundRequestDTO refundRequestDTO, String accessToken) throws
		ParseException {
		String impUid = paymentInfo.getImpUid();
		Integer amount = paymentInfo.getAmount();
		Integer cancelAmount = paymentInfo.getCancelAmount();
		Integer cancelableAmount = amount - cancelAmount;
		if (cancelableAmount <= 0) {
			throw new IllegalArgumentException("Already Refunded Payment");
		}

		RestTemplate restTemplate = new RestTemplate();
		HttpHeaders headers = new HttpHeaders();
		headers.setContentType(MediaType.APPLICATION_JSON);
		headers.set("Authorization", accessToken);

		Map<String, Object> map = new HashMap<>();
		map.put("reason", refundRequestDTO.getReason());
		map.put("imp_uid", impUid);
		map.put("amount", refundRequestDTO.getCancel_request_amount());
		map.put("checksum", cancelableAmount);

		HttpEntity entity = new HttpEntity<>(headers);
		ResponseEntity<String> response = restTemplate.exchange("https://api.iamport.kr/payments/cancel",
			HttpMethod.POST,
			entity, String.class);

		PaymentRecord paymentRecord = paymentRecordRepository.findByMerchantUid(paymentInfo.getMerchantUid())
			.orElseThrow(() -> new IllegalArgumentException("No Record found"));
		paymentRecord.setPaymentStatus(PaymentStatus.REFUND);
		paymentRecord.setCancelAmount(refundRequestDTO.getCancel_request_amount());

	}
}
