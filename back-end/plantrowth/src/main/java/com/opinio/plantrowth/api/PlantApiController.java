package com.opinio.plantrowth.api;

import com.opinio.plantrowth.api.dto.CreatePlantRequestDto;
import com.opinio.plantrowth.api.dto.CreatePlantResponseDto;
import com.opinio.plantrowth.domain.Plant;
import com.opinio.plantrowth.service.PlantService;
import lombok.Data;
import lombok.Getter;
import lombok.RequiredArgsConstructor;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RestController;

import java.time.LocalDate;

@RestController
@RequiredArgsConstructor
public class PlantApiController {

    private final PlantService plantService;

    @PostMapping("/api/plants/profiles")
    public CreatePlantResponseDto savePlant(@RequestBody CreatePlantRequestDto request) {
        Plant plant = new Plant();
        plant.setPlantSpecies(request.getPlantSpecies());
        plant.setPlantName(request.getPlantName());
        plant.setPlantBirth(request.getPlantBirth());
        plant.setPlantExp(request.getPlantExp());
        plant.setFileName(request.getFileName());
        plant.setWaterSupply(request.getWaterSupply());
        plant.setAlarmCycle(request.getAlarmCycle());

        Long id = plantService.join(plant);
        return new CreatePlantResponseDto(id);
    }



}
