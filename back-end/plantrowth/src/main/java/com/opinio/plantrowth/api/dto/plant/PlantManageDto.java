package com.opinio.plantrowth.api.dto.plant;


import com.fasterxml.jackson.annotation.JsonFormat;
import com.opinio.plantrowth.domain.plant.Plant;
import com.opinio.plantrowth.domain.user.User;

import lombok.Getter;

import java.time.LocalDate;

@Getter
public class PlantManageDto {
    private Long plant_id;
    private String plant_species;
    private String plant_name;
    @JsonFormat(shape = JsonFormat.Shape.STRING, pattern = "yyyy-MM-dd", timezone = "Asia/Seoul")
    private LocalDate plant_birth;

    private Integer plant_exp;
    private Integer plant_level;
    private String file_name;
    private Integer water_supply;
    private Integer alarm_cycle;
    private Integer remain_cycle;
    @JsonFormat(shape = JsonFormat.Shape.STRING, pattern = "yyyy-MM-dd", timezone = "Asia/Seoul")
    private LocalDate recent_watering;
    private Boolean is_subscription;

    public PlantManageDto(Plant plant) {
        plant_id = plant.getId();
        plant_species = plant.getPlantSpecies();
        plant_name = plant.getPlantName();
        plant_birth = plant.getPlantBirth();
        plant_exp = plant.getPlantExp();
        plant_level = plant.getPlantLevel();
        file_name = plant.getFileName();
        water_supply = plant.getWaterSupply();
        alarm_cycle = plant.getAlarmCycle();
        remain_cycle = plant.getRemainCycle();
        recent_watering = plant.getRecentWatering();
        is_subscription = plant.getUser().getSubscription();
    }

}
