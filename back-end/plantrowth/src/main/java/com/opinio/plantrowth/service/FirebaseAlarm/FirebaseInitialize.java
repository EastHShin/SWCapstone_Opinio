package com.opinio.plantrowth.service.FirebaseAlarm;

import com.google.auth.oauth2.GoogleCredentials;
import com.google.firebase.FirebaseApp;
import com.google.firebase.FirebaseOptions;

import javax.annotation.PostConstruct;
import java.io.FileInputStream;

public class FirebaseInitialize {

    @PostConstruct
    public void initialize() {
        try{
            FileInputStream serviceAccount = new FileInputStream("src/main/resources/firebaseServiceAccountKey.json");
            FirebaseOptions options = FirebaseOptions.builder()
                    .setCredentials(GoogleCredentials.fromStream(serviceAccount))
                    .build();
            FirebaseApp.initializeApp(options);
        }
        catch (Exception e){
            e.printStackTrace();
        }

    }
}
