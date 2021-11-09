package com.opinio.plantrowth.api.dto;

import lombok.Getter;

import java.time.LocalDate;

@Getter
public class CreatePlantDiaryDTO {
    private String title;
    private String content;
    private LocalDate date;
    private Long userId;
    private Long plantId;
}
