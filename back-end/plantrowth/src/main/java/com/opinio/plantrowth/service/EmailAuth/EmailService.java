package com.opinio.plantrowth.service.EmailAuth;

import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.mail.MailException;
import org.springframework.mail.javamail.JavaMailSender;
import org.springframework.stereotype.Service;

import javax.mail.Message;
import javax.mail.internet.InternetAddress;
import javax.mail.internet.MimeMessage;
import java.util.Random;

@RequiredArgsConstructor
@Service
public class EmailService {

    private final JavaMailSender emailSender;
    private final Logger logger = LoggerFactory.getLogger(this.getClass());
    public static final String ePw = createKey();

    private MimeMessage createMessage(String to) throws Exception {
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

    public void sendSimpleMessage(String to) throws Exception {
        MimeMessage message = createMessage(to);
        try {
            emailSender.send(message);
        } catch (MailException es) {
            es.printStackTrace();
            throw new IllegalArgumentException("이메일 인증 오류");
        }
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
