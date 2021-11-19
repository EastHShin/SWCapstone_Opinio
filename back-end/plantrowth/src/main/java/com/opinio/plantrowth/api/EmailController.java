package com.opinio.plantrowth.api;

import com.opinio.plantrowth.domain.ConfirmationToken;
import com.opinio.plantrowth.service.EmailAuth.EmailService;
import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.RequiredArgsConstructor;
import lombok.Setter;
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
    public ResponseEntity emailAuth(@RequestBody emailDTO email) throws Exception {
        emailService.sendSimpleMessage(email.getEmail());

        return new ResponseEntity(HttpStatus.OK);
    }

    @PostMapping("/verify")
    public ResponseEntity verifyEmail(@RequestBody VerifyDTO verifyRequest) {
        String code = verifyRequest.getCode();
        ConfirmationToken validToken = emailService.findValidToken(code);

        return new ResponseEntity(HttpStatus.OK);
    }

    @Getter
    @Setter
    static class VerifyDTO{
        private String code;
    }

    @Getter
    @Setter
    static class emailDTO{
        private String email;
    }
}
