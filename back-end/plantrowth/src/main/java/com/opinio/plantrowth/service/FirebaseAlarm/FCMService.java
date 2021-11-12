package com.opinio.plantrowth.service.FirebaseAlarm;

import com.amazonaws.services.s3.model.JSONOutput;
import com.fasterxml.jackson.core.JsonProcessingException;
import com.fasterxml.jackson.databind.ObjectMapper;
import com.google.auth.oauth2.GoogleCredentials;
import com.google.firebase.FirebaseApp;
import com.google.firebase.FirebaseOptions;
import lombok.RequiredArgsConstructor;
import okhttp3.*;
import org.springframework.core.io.ClassPathResource;
import org.springframework.http.HttpHeaders;
import org.springframework.stereotype.Service;

import javax.annotation.PostConstruct;
import java.io.FileInputStream;
import java.io.IOException;
import java.util.List;

@RequiredArgsConstructor
@Service
public class FCMService {
    private final String API_URL = "https://fcm.googleapis.com/v1/projects/plantrowth/messages:send";
    private final ObjectMapper objectMapper;

    private static String firebaseConfigPath = "firebaseServiceAccountKey.json";

    @PostConstruct
    public void initialize() {
        try{
            FileInputStream serviceAccount = new FileInputStream("src/main/resources/firebaseServiceAccountKey.json");
            FirebaseOptions options = FirebaseOptions.builder()
                    .setCredentials(GoogleCredentials.fromStream(serviceAccount))
//                    .setCredentials(GoogleCredentials.getApplicationDefault())
                    .setDatabaseUrl("https://plantrowth.firebaseio.com/")
                    .build();
            FirebaseApp.initializeApp(options);
        }
        catch (Exception e){
            e.printStackTrace();
        }

    }

    public void sendMessageTo(String targetToken, String title, String body, Long plant_id) throws IOException {
        String message = makeMessage(targetToken, title, body, plant_id);
        System.out.println(message);

        OkHttpClient client = new OkHttpClient();
        RequestBody requestBody = RequestBody.create(message, MediaType.get("application/json; charset=utf-8"));
        Request request = new Request.Builder()
                .url(API_URL)
                .post(requestBody)
                .addHeader(HttpHeaders.AUTHORIZATION, "Bearer " + getAccessToken())
                .build();
        System.out.println(request.header(HttpHeaders.AUTHORIZATION));
        Response response = client.newCall(request)
                .execute();

        System.out.println(response.body().string());
    }

    private String makeMessage(String targetToken, String title, String body, Long plant_id) throws JsonProcessingException {
        FcmMessage fcmMessage = FcmMessage.builder()
                .message(FcmMessage.Message.builder()
                    .token(targetToken)
                    .notification(FcmMessage.Notification.builder()
                        .title(title)
                        .body(body)
                        .build())
                    .data(FcmMessage.Data.builder()
                        .plant_id(plant_id)
                        .build())
                    .build())
                .validate_only(false)
                .build();

        return objectMapper.writeValueAsString(fcmMessage);

    }

    private String getAccessToken() throws IOException {
        GoogleCredentials googleCredentials = GoogleCredentials.fromStream(
                new ClassPathResource(firebaseConfigPath).getInputStream())
                .createScoped(List.of("https://www.googleapis.com/auth/cloud-platform"));

        googleCredentials.refreshIfExpired();
        return googleCredentials.getAccessToken().getTokenValue();
    }
}
