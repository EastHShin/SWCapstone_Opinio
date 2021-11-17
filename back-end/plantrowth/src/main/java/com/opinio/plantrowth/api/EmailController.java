package com.opinio.plantrowth.api;

import com.opinio.plantrowth.service.EmailAuth.EmailService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RestController;

import java.util.Map;

@RequiredArgsConstructor
@RestController
public class EmailController {

    private final EmailService emailService;

    @PostMapping("/email")
    public ResponseEntity emailAuth(@RequestBody Map<String, String> email) throws Exception{
        emailService.sendSimpleMessage(email.get("email"));

        return new ResponseEntity(HttpStatus.OK);
    }
}
