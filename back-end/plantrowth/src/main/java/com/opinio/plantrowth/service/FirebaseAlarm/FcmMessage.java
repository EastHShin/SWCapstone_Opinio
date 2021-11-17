package com.opinio.plantrowth.service.FirebaseAlarm;

import com.google.firebase.messaging.AndroidNotification;
import com.google.firebase.messaging.Message;
import com.google.firebase.messaging.Notification;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Getter;

@Builder
@AllArgsConstructor
@Getter
public class FcmMessage {
    private boolean validate_only;
    private Message message;

    @Builder
    @AllArgsConstructor
    @Getter
    public static class Message {
        private Notification notification;
        private Data data;
        private String token;
    }

    @Builder
    @AllArgsConstructor
    @Getter
    public static class Notification{
        private String title;
        private String body;
        private String image;
    }

    @Builder
    @AllArgsConstructor
    @Getter
    public static class Data{
        private String plant_id;
        private String user_id;
    }



}
