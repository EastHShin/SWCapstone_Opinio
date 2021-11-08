package com.opinio.plantrowth.api.dto;

import com.opinio.plantrowth.domain.Plant;
import com.opinio.plantrowth.domain.User;
import lombok.Getter;

import java.time.LocalDate;

@Getter
public class PlantUpdateDto {
    private Long id;
    private String plantSpecies;
    private String plantName;
    private LocalDate plantBirth;
    private int plantExp;
    private String fileName;
    private int waterSupply;
    private int alarmCycle;

    public PlantUpdateDto(Long id, String plantSpecies, String plantName, LocalDate plantBirth, int plantExp, String fileName, int waterSupply, int alarmCycle) {
        this.id = id;
        this.plantSpecies = plantSpecies;
        this.plantName = plantName;
        this.plantBirth = plantBirth;
        this.plantExp = plantExp;
        this.fileName = fileName;
        this.waterSupply = waterSupply;
        this.alarmCycle = alarmCycle;
    }

//    public PlantUpdateDto(Long id, String plantSpecies,) {
//        this.id = plant.getId();
//        this.plantSpecies = plant.getPlantSpecies();
//        this.plantName = plant.getPlantName();
//        this.plantBirth = plant.getPlantBirth();
//        this.plantExp = plant.getPlantExp();
//        this.fileName = plant.getFileName();
//        this.waterSupply = plant.getWaterSupply();
//        this.alarmCycle = plant.getAlarmCycle();
//    }
}
