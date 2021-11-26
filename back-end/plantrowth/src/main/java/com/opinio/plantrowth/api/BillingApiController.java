package com.opinio.plantrowth.api;

import java.util.List;
import java.util.stream.Collectors;

import com.opinio.plantrowth.api.dto.subscription.BillingDTO;
import com.opinio.plantrowth.domain.PaymentRecord;
import com.opinio.plantrowth.domain.PaymentStatus;
import com.opinio.plantrowth.domain.PaymentType;
import com.opinio.plantrowth.domain.User;
import com.opinio.plantrowth.service.BillingService;
import com.opinio.plantrowth.service.UserService;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.RequiredArgsConstructor;
import org.json.simple.JSONObject;
import org.json.simple.parser.ParseException;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RestController;
import org.springframework.web.client.RestTemplate;

@RestController
@RequiredArgsConstructor
public class BillingApiController {

    private final BillingService billingService;
    private final UserService userService;

    @PostMapping("/api/payments/complete/diagnosis")
    public ResponseEntity subscribe(@RequestBody BillingDTO request) throws ParseException, IllegalAccessException {
        String accessToken = billingService.getToken();
        System.out.println(accessToken);
        Integer paymentData = billingService.getPaymentData(accessToken, request.getImp_uid());
        billingService.subscribe(paymentData, request.getUser_id(), request.getImp_uid(), request.getMerchant_uid());
        return new ResponseEntity(HttpStatus.OK);
    }

    @PostMapping("/api/payments/complete/slot")
    public ResponseEntity<slotApiDTO> buySlot(@RequestBody BillingDTO request) throws ParseException, IllegalAccessException {
        String accessToken = billingService.getToken();
        Integer paymentData = billingService.getPaymentData(accessToken, request.getImp_uid());
        User user = billingService.payForSlot(paymentData, request.getUser_id(), request.getImp_uid(),
            request.getMerchant_uid());

        return new ResponseEntity<slotApiDTO>(new slotApiDTO(user), HttpStatus.OK);
    }

    @PostMapping("/api/payments/record/{user-id}")
    public ResponseEntity<paymentRecordDTO> getRecord(@PathVariable("user-id") Long userId) {
        User user = userService.findUser(userId);
        List<PaymentRecord> paymentRecords = user.getPaymentRecords();

        return new ResponseEntity<paymentRecordDTO>(new paymentRecordDTO(user, paymentRecords), HttpStatus.OK);
    }

    @Data
    @AllArgsConstructor
    static class slotApiDTO {
        private Long user_id;
        private Integer max_plant_num;

        public slotApiDTO(User user) {
            user_id = user.getId();
            max_plant_num = user.getMaxPlantNum();
        }
    }

    @Data
    @AllArgsConstructor
    static class paymentRecordDTO{
        private Long user_id;
        private List<paymentInfoDTO> paymentInfoList;

        public paymentRecordDTO(User user, List<PaymentRecord> recordList){
            user_id = user.getId();
            paymentInfoList = recordList.stream()
                .map(record -> new paymentInfoDTO(record))
                .collect(Collectors.toList());
        }
    }

    @Data
    @AllArgsConstructor
    static class paymentInfoDTO{
        private String imp_uid;
        private String merchant_id;
        private Integer amount;
        private PaymentType paymentType;
        private PaymentStatus paymentStatus;

        public paymentInfoDTO(PaymentRecord paymentRecord) {
            imp_uid = paymentRecord.getImpUid();
            merchant_id = paymentRecord.getMerchantUid();
            amount = paymentRecord.getAmount();
            paymentType = paymentRecord.getPaymentType();
            paymentStatus = paymentRecord.getPaymentStatus();
        }
    }
}
