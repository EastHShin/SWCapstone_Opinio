package com.opinio.plantrowth.api;

import com.opinio.plantrowth.service.FirebaseAlarm.FCMService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RestController;

import java.io.IOException;

@RequiredArgsConstructor
@RestController
public class FCMTestController {

    private final FCMService fcmService;
    private static final String yebinToken = "eDxZkcEsRZ6EOIJs_lvtye:APA91bHr0TriGKbCSYIqbJVl4qwmv0ndeiQoqY21YrSQ05fXzpQq4JNjdZlUWqyCJ4vIpg2MV_m9OpzVwr5EPwv7F9ni4We-clSMgVwFVz_whzKqFha6fKEovzRQCXSZQQmdlZ4mYoq1";

    @GetMapping("/api/fcmtest")
    public ResponseEntity fcmTest() throws IOException {
        fcmService.sendMessageTo(yebinToken, "테스트푸쉬", "안녕하세요", "1", "1");

        return new ResponseEntity(HttpStatus.OK);
    }

}
