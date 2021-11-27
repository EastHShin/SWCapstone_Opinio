package com.opinio.plantrowth.api.dto.plant;

import lombok.Getter;

@Getter
public class CreatePlantResponseDto {
    private Long id;


    public CreatePlantResponseDto(Long id) {
        this.id = id;
    }
}
