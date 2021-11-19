package com.opinio.plantrowth.service.EmailAuth;

import com.opinio.plantrowth.domain.ConfirmationToken;
import com.opinio.plantrowth.repository.ConfirmationTokenRepository;
import lombok.RequiredArgsConstructor;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.mail.MailException;
import org.springframework.mail.javamail.JavaMailSender;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import javax.mail.Message;
import javax.mail.internet.InternetAddress;
import javax.mail.internet.MimeMessage;
import java.time.LocalDateTime;
import java.util.Optional;
import java.util.Random;

@Transactional(readOnly = true)
@RequiredArgsConstructor
@Service
public class EmailService {

    private final JavaMailSender emailSender;
    private final ConfirmationTokenRepository confirmationTokenRepository;
    private final Logger logger = LoggerFactory.getLogger(this.getClass());
//    public static final String ePw = createKey();

    private MimeMessage createMessage(String to) throws Exception {
        String ePw = createKey();
        saveToken(to, ePw);

        logger.info("보내는 대상 : " + to);
        logger.info("인증 번호 : " + ePw);
        MimeMessage message = emailSender.createMimeMessage();
        String code = createCode(ePw);
        message.addRecipients(Message.RecipientType.TO, to);
        message.setSubject("Plantrowth 확인 코드: " + code);

        String msg = "";
        msg += code;

        message.setText(msg, "utf-8");
        message.setFrom(new InternetAddress("plantrowth@gmail.com", "plantrowth"));

        return message;
    }

    @Transactional
    public void saveToken(String to, String ePw) {
        ConfirmationToken confirmationToken = ConfirmationToken.createEmailConfirmationToken(to, ePw);
        confirmationTokenRepository.save(confirmationToken);
    }

    public void sendSimpleMessage(String to) throws Exception {
        MimeMessage message = createMessage(to);
        try {
            emailSender.send(message);
        } catch (MailException es) {
            es.printStackTrace();
            throw new IllegalArgumentException("이메일 인증 오류");
        }
    }

    @Transactional
    public ConfirmationToken findValidToken(String code) {
        ConfirmationToken confirmationToken = confirmationTokenRepository.findByCodeAndExpirationDateAfterAndExpired(code, LocalDateTime.now(), false)
                .orElseThrow(() -> new IllegalArgumentException("Token을 찾을 수 없습니다."));
        confirmationToken.useToken();
        return confirmationToken;
    }



    private String createCode(String ePw) {
        return ePw.substring(0,3) + "-" + ePw.substring(3, 6);
    }

    private static String createKey() {
        StringBuffer key = new StringBuffer();
        Random random = new Random();

        for (int i = 0; i < 6; i++) {
            key.append((random.nextInt(10)));
        }
        return key.toString();
    }
}
