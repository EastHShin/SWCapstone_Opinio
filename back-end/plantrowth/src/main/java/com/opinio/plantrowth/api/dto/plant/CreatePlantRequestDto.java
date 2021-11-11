package com.opinio.plantrowth.api.dto.plant;

import com.opinio.plantrowth.domain.Plant;
import lombok.Getter;

import java.time.LocalDate;

@Getter
public class CreatePlantRequestDto {
    private String plantSpecies;
    private String plantName;
    private LocalDate plantBirth;
    private Integer plantExp;
    private String fileName;
    private Integer waterSupply;
    private Integer alarmCycle;

    public CreatePlantRequestDto(String plantSpecies, String plantName, LocalDate plantBirth, int plantExp, String fileName, int waterSupply, int alarmCycle) {
        this.plantSpecies = plantSpecies;
        this.plantName = plantName;
        this.plantBirth = plantBirth;
        this.plantExp = plantExp;
        this.fileName = fileName;
        this.waterSupply = waterSupply;
        this.alarmCycle = alarmCycle;
    }

    public Plant toEntity() {
        return Plant.builder()
                .plantSpecies(plantSpecies)
                .plantName(plantName)
                .plantBirth(plantBirth)
                .plantExp(plantExp)
                .fileName(fileName)
                .waterSupply(waterSupply)
                .alarmCycle(alarmCycle)
                .build();
    }

}
