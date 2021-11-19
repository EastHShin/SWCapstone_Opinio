package com.opinio.plantrowth.api.dto.plant;

import com.opinio.plantrowth.domain.Plant;
import lombok.Getter;

import java.time.LocalDate;

@Getter
public class PlantUpdateDto {
    private Long id;
    private String plant_species;
    private String plant_name;
    private LocalDate plant_birth;
    private Integer plant_exp;
    private String file_name;
    private Integer water_supply;
    private Integer alarm_cycle;

//    public PlantUpdateDto(Long id, String plant_species, String plant_name, LocalDate plant_birth, int plant_exp, String file_name, int water_supply, int alarm_cycle) {
//        this.id = id;
//        this.plant_species = plant_species;
//        this.plant_name = plant_name;
//        this.plant_birth = plant_birth;
//        this.plant_exp = plant_exp;
//        this.file_name = file_name;
//        this.water_supply = water_supply;
//        this.alarm_cycle = alarm_cycle;
//    }


    public PlantUpdateDto(Plant plant) {
        this.id = plant.getId();
        this.plant_species = plant.getPlantSpecies();
        this.plant_name = plant.getPlantName();
        this.plant_birth = plant.getPlantBirth();
        this.plant_exp = plant.getPlantExp();
        this.file_name = plant.getFileName();
        this.water_supply = plant.getWaterSupply();
        this.alarm_cycle = plant.getAlarmCycle();
    }
}
