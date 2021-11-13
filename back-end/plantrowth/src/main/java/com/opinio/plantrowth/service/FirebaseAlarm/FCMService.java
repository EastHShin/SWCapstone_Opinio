package com.opinio.plantrowth.service.FirebaseAlarm;

import com.fasterxml.jackson.databind.ObjectMapper;
import com.google.firebase.messaging.FirebaseMessaging;
import com.google.firebase.messaging.FirebaseMessagingException;
import com.google.firebase.messaging.Message;
import lombok.RequiredArgsConstructor;
import lombok.Value;
import org.springframework.stereotype.Service;

@RequiredArgsConstructor
@Service
public class FCMService {

    String fireBaseCreateScoped = "https://www.googleapis.com/auth/firebase.messaging";

    private FirebaseMessaging instance;

    public void sendMessageTo(String targetToken, String title, String body, String path) throws FirebaseMessagingException {
//        String message = Message.builder().setNotification()
    }
//
//    private String makeMessage(String targetToken, String title, String body, String path) {
//
//    }
}
