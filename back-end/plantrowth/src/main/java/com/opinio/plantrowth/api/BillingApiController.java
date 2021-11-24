package com.opinio.plantrowth.api;

import com.opinio.plantrowth.api.dto.subscription.BillingDTO;
import com.opinio.plantrowth.domain.User;
import com.opinio.plantrowth.service.BillingService;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.RequiredArgsConstructor;
import org.json.simple.JSONObject;
import org.json.simple.parser.ParseException;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RestController;
import org.springframework.web.client.RestTemplate;

@RestController
@RequiredArgsConstructor
public class BillingApiController {

    private final BillingService billingService;

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

    @Data
    @AllArgsConstructor
    static class slotApiDTO{
        private Long user_id;
        private Integer max_plant_num;

        public slotApiDTO(User user) {
            user_id = user.getId();
            max_plant_num = user.getMaxPlantNum();
        }
    }
}
