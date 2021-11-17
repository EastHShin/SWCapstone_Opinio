package com.opinio.plantrowth.service;

import com.opinio.plantrowth.domain.Plant;
import com.opinio.plantrowth.repository.PlantRepository;
import com.opinio.plantrowth.service.FirebaseAlarm.FCMService;
import lombok.RequiredArgsConstructor;
import org.springframework.scheduling.annotation.Scheduled;
import org.springframework.stereotype.Component;
import org.springframework.stereotype.Service;

import java.io.IOException;
import java.util.List;

@RequiredArgsConstructor
@Component
public class WaterCycleScheduler {

    private final PlantService plantService;
    private final FCMService fcmService;

    @Scheduled(cron = "0 0 10 * * *")
    public void wateringSchedule() {
        /*
        질병진단 경험치 획득 중복 방지와 식물일기 작성 경험치,포인트 획득 중복 방지 로직 추가할 것
         */
        List<Plant> allPlant = plantService.findAllPlant();
        for (Plant plant : allPlant) {
            Integer remainCycle = plant.getRemainCycle();
            remainCycle -= 1;
            if (remainCycle <= 0) {
                remainCycle = 0;
                String fcmToken = plant.getUser().getFCMAccessToken();
                String plantName = plant.getPlantName();
                String plantId = plant.getId().toString();
                String userId = plant.getUser().getId().toString();
                String imageUrl = plant.getFileName();
                try {
                    fcmService.sendMessageTo(fcmToken, "물을 줄 시간이에요", plantName + "에게 물을 주세요!",
                            plantId, userId, imageUrl);
                } catch (IOException e) {
                    e.printStackTrace();
                }

            }
            plantService.updateRemainCycle(plant.getId(), remainCycle);
        }
    }

}
