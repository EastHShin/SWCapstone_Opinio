package com.opinio.plantrowth.api;

import com.opinio.plantrowth.api.dto.CreatePlantRequestDto;
import com.opinio.plantrowth.api.dto.CreatePlantResponseDto;
import com.opinio.plantrowth.domain.Plant;
import com.opinio.plantrowth.service.PlantService;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.Getter;
import lombok.RequiredArgsConstructor;
import org.springframework.web.bind.annotation.*;

import java.time.LocalDate;
import java.util.List;
import java.util.stream.Collectors;

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

    @GetMapping("/api/plants/profiles/{user-id}")
    public PlantResult plants(@PathVariable("user-id") Long id){
        List<Plant> findPlants = plantService.findPlants(id);
//        List<Plant> findPlants = plantService.findPlants();
        List<PlantDto> collect = findPlants.stream()
                .map(m -> new PlantDto(m.getPlantName()))
                .collect(Collectors.toList());

        return new PlantResult(collect);
    }

    @Data
    @AllArgsConstructor
    static class PlantResult<T>{
        private T data;
    }

    @Data
    @AllArgsConstructor
    static class PlantDto{
        private String plantName;
    }


}
