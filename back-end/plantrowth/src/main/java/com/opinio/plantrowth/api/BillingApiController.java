package com.opinio.plantrowth.api;

import com.opinio.plantrowth.api.dto.subscription.BillingDTO;
import com.opinio.plantrowth.service.BillingService;
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

    @PostMapping("/api/payments/complete")
    public ResponseEntity subscribe(@RequestBody BillingDTO request) throws ParseException, IllegalAccessException {
        String accessToken = billingService.getToken();
//        JSONObject access_token = (JSONObject)token.get("response");
        System.out.println(accessToken);
        billingService.getPaymentData(accessToken, request.getImp_uid(), request.getUser_id());
        return new ResponseEntity(HttpStatus.OK);
    }
}
