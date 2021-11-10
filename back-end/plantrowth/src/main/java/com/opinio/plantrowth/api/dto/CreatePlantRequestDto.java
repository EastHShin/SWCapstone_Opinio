package com.opinio.plantrowth.api.dto;

import com.opinio.plantrowth.domain.Plant;
import lombok.Getter;
import lombok.Setter;

import java.io.Serializable;
import java.time.LocalDate;

@Getter
@Setter
public class CreatePlantRequestDto implements Serializable {
    private String plant_species;
    private String plant_name;
    private LocalDate plant_birth;
//    private Integer plant_exp;
//    private String file_name;
    private Integer water_supply;
    private Integer alarm_cycle;
    private LocalDate recent_watering;

    public CreatePlantRequestDto() {
    }

    public CreatePlantRequestDto(String plant_species, String plant_name, LocalDate plant_birth, Integer water_supply, Integer alarm_cycle, LocalDate recent_watering) {
        this.plant_species = plant_species;
        this.plant_name = plant_name;
        this.plant_birth = plant_birth;
//        this.plant_exp = plant_exp;
//        this.file_name = fileName;
        this.water_supply = water_supply;
        this.alarm_cycle = alarm_cycle;
        this.recent_watering = recent_watering;
    }

    public Plant toEntity() {
        return Plant.builder()
                .plantSpecies(plant_species)
                .plantName(plant_name)
                .plantBirth(plant_birth)
//                .plantExp(plant_exp)
//                .fileName(file_name)
                .waterSupply(water_supply)
                .alarmCycle(alarm_cycle)
                .recentWatering(recent_watering)
                .build();
    }

}
