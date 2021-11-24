package com.opinio.plantrowth.service;


import com.google.gson.Gson;
import com.opinio.plantrowth.domain.Subscription;
import com.opinio.plantrowth.domain.User;
import com.opinio.plantrowth.repository.SubscriptionRepository;
import com.opinio.plantrowth.repository.UserRepository;
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

@Transactional(readOnly = true)
@RequiredArgsConstructor
@Service
public class BillingService {

    private final SubscriptionRepository subscriptionRepository;
    private final UserRepository userRepository;

    private final String IMP_KEY = "2028448220218951";
    private final String IMP_SECRET = "64c6c5c167fffb894c40fe19650ea7b19a6ae2fa05dd33ead0b1e168fb33285d9014e7da5ccfcbb8";
    private final Integer amountToBePaidForDiagnosis = 100;
    private final Integer amountToBePaidForSlot = 50;
    private final Long SUBSCRIPTION_MONTH = 1L;
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
        JSONObject jsonObject = (JSONObject) obj;
        JSONObject responseJson = (JSONObject) jsonObject.get("response");
        String access_token = responseJson.get("access_token").toString();
        return access_token;
    }

    public Integer getPaymentData(String accessToken, String imp_uid, Long userId) throws ParseException, IllegalAccessException {
        RestTemplate restTemplate = new RestTemplate();
        HttpHeaders headers = new HttpHeaders();
        headers.setContentType(MediaType.APPLICATION_JSON);
        headers.set("Authorization", accessToken);

        HttpEntity entity = new HttpEntity<>(headers);
        ResponseEntity<String> response = restTemplate.exchange("https://api.iamport.kr/payments/{imp_uid}", HttpMethod.GET,
                entity, String.class, imp_uid);

        String res = response.getBody();
        JSONParser jsonParser = new JSONParser();
        Object obj = jsonParser.parse(res);
        JSONObject jsonObject = (JSONObject) obj;
        JSONObject responseObj = (JSONObject) jsonObject.get("response");
        Integer amount = Integer.parseInt(responseObj.get("amount").toString());
        return amount;
    }

    @Transactional
    public void subscribe(Integer amount, Long userId) throws IllegalAccessException {
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
        } else {
            throw new IllegalAccessException("forgery Billing");
        }
    }

    @Transactional
    public User payForSlot(Integer amount, Long userId) throws IllegalAccessException {
        if (amount == amountToBePaidForSlot) {
            User user = userRepository.findById(userId)
                    .orElseThrow(() -> new IllegalArgumentException("no User found"));
            Integer maxPlantNum = user.getMaxPlantNum();
            user.setMaxPlantNum(maxPlantNum + 1);
            return user;
        } else {
            throw new IllegalAccessException("forgery Billing");
        }
    }


}
