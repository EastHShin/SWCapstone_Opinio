package com.opinio.plantrowth.api;

import com.opinio.plantrowth.domain.Plant;
import com.opinio.plantrowth.domain.User;
import com.opinio.plantrowth.service.PlantExpService;
import com.opinio.plantrowth.service.PlantService;
import com.opinio.plantrowth.service.UserPointService;
import com.opinio.plantrowth.service.WateringService;
import lombok.Getter;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RestController;

@RequiredArgsConstructor
@RestController
public class WateringApiController {

    private final PlantService plantService;
    private final UserPointService userPointService;
    private final WateringService wateringService;
    private final PlantExpService plantExpService;

    @PostMapping("/api/plants/watering/{plant-id}")
    public ResponseEntity<WateringDto> watering(@PathVariable("plant-id") Long id) {
        Long plant_id = wateringService.watering(id);
        Plant plant = plantService.findOnePlant(plant_id);
        Integer curLevel = plant.getPlantLevel();
        plantExpService.increaseExp(id);
        Integer updatedLevel = plant.getPlantLevel();
        Boolean isLevelUp = false;
        if (curLevel < updatedLevel) {
            isLevelUp = true;
        }
        Plant updatedPlant = plantService.findOnePlant(plant_id);
        User user = userPointService.increasePoint(plant.getUser().getId());
        return new ResponseEntity<WateringDto>(new WateringDto(user, updatedPlant, isLevelUp), HttpStatus.OK);
    }


    @Getter
    static class WateringDto{
        private Long user_id;
        private Integer point;
        private Long plant_id;
        private String plant_name;
        private Integer plant_exp;
        private Integer plant_level;
        private Boolean isLevelUp;

        public WateringDto(User user, Plant plant, Boolean isLevelUp) {
            user_id = user.getId();
            point = user.getPoint();
            plant_id = plant.getId();
            plant_name = plant.getPlantName();
            plant_exp = plant.getPlantExp();
            plant_level = plant.getPlantLevel();
            this.isLevelUp = isLevelUp;
        }
    }

}
