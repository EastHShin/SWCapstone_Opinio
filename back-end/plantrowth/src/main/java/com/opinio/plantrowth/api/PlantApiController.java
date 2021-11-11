package com.opinio.plantrowth.api;

import com.opinio.plantrowth.api.dto.plant.CreatePlantRequestDto;
import com.opinio.plantrowth.api.dto.plant.CreatePlantResponseDto;
import com.opinio.plantrowth.api.dto.plant.PlantUpdateDto;
import com.opinio.plantrowth.domain.Plant;
import com.opinio.plantrowth.domain.User;
import com.opinio.plantrowth.service.fileUpload.FileUploadService;
import com.opinio.plantrowth.service.PlantService;
import com.opinio.plantrowth.service.UserService;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;

import java.util.List;
import java.util.Optional;
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
    @Transactional
    public CreatePlantResponseDto savePlant(
            @PathVariable("user-id") Long userId,
            @RequestBody CreatePlantRequestDto request,
            @RequestPart(required = false) Optional<MultipartFile> file) {
        Plant plant = Plant.builder()
                .plantSpecies(request.getPlantSpecies())
                .plantName(request.getPlantName())
                .plantBirth(request.getPlantBirth())
                .plantExp(request.getPlantExp())
                .fileName(request.getFileName())
                .waterSupply(request.getWaterSupply())
                .alarmCycle(request.getAlarmCycle())
                .build();
//                new Plant();
//        plant.setPlantSpecies(request.getPlantSpecies());
//        plant.setPlantName(request.getPlantName());
//        plant.setPlantBirth(request.getPlantBirth());
//        plant.setPlantExp(request.getPlantExp());
//        plant.setFileName(request.getFileName());
//        plant.setWaterSupply(request.getWaterSupply());
//        plant.setAlarmCycle(request.getAlarmCycle());

        if(file.isPresent()) {
            String uploadImageName = fileUploadService.uploadImage(file.get());
            plant.setFileName(uploadImageName);
        }

        User user = userService.findUser(userId);
        plant.setUser(user);

        Long id = plantService.join(plant);

        return new CreatePlantResponseDto(id);
    }

    @GetMapping(value = "/api/plants/profiles/{user-id}")
    public ResponseEntity<PlantResult> plants(@PathVariable("user-id") Long id){
        List<Plant> findPlants = plantService.findPlants(id);
        List<PlantDto> collect = findPlants.stream()
                .map(m -> new PlantDto(m.getPlantName(), m.getFileName()))
                .collect(Collectors.toList());

        return new ResponseEntity<PlantResult>(new PlantResult(collect), HttpStatus.OK);
    }

    @PutMapping("/api/plants/profiles/{plant-id}")
    public ResponseEntity<PlantUpdateDto> updatePlant(@PathVariable("plant-id") Long id,
                                                      @RequestBody CreatePlantRequestDto request) {
        Plant updatedPlant = plantService.update(id, request);
        return new ResponseEntity<PlantUpdateDto>(new PlantUpdateDto(updatedPlant.getId(), updatedPlant.getPlantSpecies(),
                updatedPlant.getPlantName(),updatedPlant.getPlantBirth(), updatedPlant.getPlantExp()
        ,updatedPlant.getFileName(),updatedPlant.getWaterSupply(),updatedPlant.getAlarmCycle()), HttpStatus.OK);
    }

    @DeleteMapping("/api/plants/profiles/{plant-id}")
    public CreatePlantResponseDto deletePlant(@PathVariable("plant-id") Long id) {
        plantService.delete(id);
        return new CreatePlantResponseDto(id);
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
