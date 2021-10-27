package com.opinio.plantrowth.api.dto;

import com.opinio.plantrowth.domain.Plant;
import lombok.Getter;

import java.time.LocalDate;

@Getter
public class CreatePlantResponseDto {
    private Long id;

    public CreatePlantResponseDto(Long id) {
        this.id = id;
    }
}
