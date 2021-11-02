package com.opinio.plantrowth.api;

import com.opinio.plantrowth.api.dto.CreatePlantRequestDto;
import com.opinio.plantrowth.api.dto.CreatePlantResponseDto;
import com.opinio.plantrowth.domain.Plant;
import com.opinio.plantrowth.domain.User;
import com.opinio.plantrowth.service.fileUpload.FileUploadService;
import com.opinio.plantrowth.service.PlantService;
import com.opinio.plantrowth.service.UserService;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.RequiredArgsConstructor;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;

import java.util.List;
import java.util.stream.Collectors;

@RestController
@RequiredArgsConstructor
public class PlantApiController {

    private final PlantService plantService;
    private final UserService userService;
    private final FileUploadService fileUploadService;

//    Postman Test
    @PostMapping("/api/upload")
    public String uploadImage(@RequestPart MultipartFile file) {
        return fileUploadService.uploadImage(file);
    }



    @PostMapping("/api/plants/profiles/{user-id}")
    public CreatePlantResponseDto savePlant(
            @PathVariable("user-id") Long userId,
            @RequestBody CreatePlantRequestDto request,
            @RequestPart(required = false) MultipartFile file) {
        Plant plant = new Plant();
        plant.setPlantSpecies(request.getPlantSpecies());
        plant.setPlantName(request.getPlantName());
        plant.setPlantBirth(request.getPlantBirth());
        plant.setPlantExp(request.getPlantExp());
        plant.setFileName(request.getFileName());
        plant.setWaterSupply(request.getWaterSupply());
        plant.setAlarmCycle(request.getAlarmCycle());

        String uploadImageName = fileUploadService.uploadImage(file);
        plant.setFileName(uploadImageName);
        User user = userService.findUser(userId);
        plant.setUser(user);

        Long id = plantService.join(plant);

        return new CreatePlantResponseDto(id);
    }

    @GetMapping(value = "/api/plants/profiles/{user-id}")
    public PlantResult plants(@PathVariable("user-id") Long id){
        List<Plant> findPlants = plantService.findPlants(id);
        List<PlantDto> collect = findPlants.stream()
                .map(m -> new PlantDto(m.getPlantName(), m.getFileName()))
                .collect(Collectors.toList());

        return new PlantResult(collect);
    }

    @PutMapping("/api/plants/profiles/{plant-id}")
    public CreatePlantResponseDto updatePlant(@PathVariable("plant-id") Long id,
                                              @RequestBody CreatePlantRequestDto request) {
        plantService.update(id, request);
        Plant plant = plantService.findOnePlant(id);
        return new CreatePlantResponseDto(plant.getId());
    }


    @Data
    @AllArgsConstructor
    static class PlantResult<T> {
        private T data;
    }

    @Data
    @AllArgsConstructor
    static class PlantDto{
        private String plantName;
        private String fileName;
    }


}
