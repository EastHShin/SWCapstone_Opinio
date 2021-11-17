package com.opinio.plantrowth.api;

import com.opinio.plantrowth.domain.Plant;
import com.opinio.plantrowth.service.FirebaseAlarm.FCMService;
import com.opinio.plantrowth.service.PlantService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.RestController;

import java.io.IOException;

@RequiredArgsConstructor
@RestController
public class FCMTestController {

    private final FCMService fcmService;
    private final PlantService plantService;
    private static final String yebinToken = "eDxZkcEsRZ6EOIJs_lvtye:APA91bHr0TriGKbCSYIqbJVl4qwmv0ndeiQoqY21YrSQ05fXzpQq4JNjdZlUWqyCJ4vIpg2MV_m9OpzVwr5EPwv7F9ni4We-clSMgVwFVz_whzKqFha6fKEovzRQCXSZQQmdlZ4mYoq1";
    private static final String emulToken = "fc-k885DR5uHk2v13MC3lf:APA91bHkIU9GjxwCQFt8JlBFvUa_Hpckh8Wj8A-og-S6E0eOeXRa_vgoVeMYc5L58uGA-L2XPY-ICVSeuvzY_K-m9av65VcHFtOhMV_tO0pWsBTVRrdq7FBdD05IntGmmw-hI9rCOmMJ";

    @GetMapping("/api/fcmtest")
    public ResponseEntity fcmTest() throws IOException {
//        fcmService.sendMessageTo(yebinToken, "테스트푸쉬", "안녕하세요", "22", "7", "https://plantrowth-imageupload2.s3.ap-northeast-2.amazonaws.com/profiles/0580423c-679a-4494-afe1-3f5cf0532379.jpg");
        fcmService.sendMessageTo(yebinToken, "테스트푸쉬", "안녕하세요", "22", "7", "https://plantrowth-imageupload2.s3.ap-northeast-2.amazonaws.com/profiles/1eb84772-b77a-425d-9033-d608e9783459.jpg");

        return new ResponseEntity(HttpStatus.OK);
    }

    @GetMapping("/api/getAccessFcmTest/{plant-id}")
    public ResponseEntity tokenFcmTest(@PathVariable("plant-id") Long plant_id) throws IOException {
        Plant plant = plantService.findOnePlant(plant_id);
        String fcmAccessToken = plant.getUser().getFCMAccessToken();
        String plant_name = plant.getPlantName();
        String imageUrl = plant.getFileName();
        fcmService.sendMessageTo(fcmAccessToken, "물을 줄 시간이에요", plant_name + "에게 물을 주세요!",
                plant.getId().toString(), plant.getUser().getId().toString(), imageUrl);
        return new ResponseEntity(HttpStatus.OK);
    }
}
