package com.opinio.plantrowth.api;

import com.opinio.plantrowth.domain.Plant;
import com.opinio.plantrowth.domain.User;
import com.opinio.plantrowth.service.PlantService;
import com.opinio.plantrowth.service.UserPointService;
import com.opinio.plantrowth.service.UserService;
import com.opinio.plantrowth.service.WateringService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RestController;

@RequiredArgsConstructor
@RestController
public class WateringApiController {

    private final PlantService plantService;
    private final UserPointService userPointService;
    private final WateringService wateringService;

    @PostMapping("api/plants/watering/{plant-id}")
    public ResponseEntity<WateringDto> watering(@PathVariable("plant-id") Long id) {
        Long plant_id = wateringService.watering(id);
        Plant plant = plantService.findOnePlant(plant_id);
        User user = userPointService.updatePoint(plant.getUser().getId());
        return new ResponseEntity<WateringDto>(new WateringDto(user, plant), HttpStatus.OK);
    }


    static class WateringDto{
        private Long user_id;
        private Integer point;
        private Long plant_id;
        private String plant_name;

        public WateringDto(User user, Plant plant) {
            user_id = user.getId();
            point = user.getPoint();
            plant_id = plant.getId();
            plant_name = plant.getPlantName();
        }
    }

}
