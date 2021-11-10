package com.opinio.plantrowth.api;

import com.opinio.plantrowth.api.dto.CreatePlantRequestDto;
import com.opinio.plantrowth.api.dto.CreatePlantResponseDto;
import com.opinio.plantrowth.api.dto.PlantUpdateDto;
import com.opinio.plantrowth.domain.Plant;
import com.opinio.plantrowth.domain.User;
import com.opinio.plantrowth.service.fileUpload.FileUploadService;
import com.opinio.plantrowth.service.PlantService;
import com.opinio.plantrowth.service.UserService;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.http.MediaType;
import org.springframework.http.ResponseEntity;
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



    @PostMapping(value = "/api/plants/profiles/{user-id}", consumes = {MediaType.APPLICATION_JSON_VALUE}, produces = MediaType.APPLICATION_JSON_VALUE)
    public CreatePlantResponseDto savePlant(
            @PathVariable("user-id") Long userId,
            @ModelAttribute CreatePlantRequestDto request,
            @RequestPart(name = "file_name",required = false) Optional<MultipartFile> file) {
        System.out.println(request);
        System.out.println(request.getPlant_name());
        Plant plant = Plant.builder()
                .plantSpecies(request.getPlant_species())
                .plantName(request.getPlant_name())
                .plantBirth(request.getPlant_birth())
                .plantExp(0)
                .waterSupply(request.getWater_supply())
                .alarmCycle(request.getAlarm_cycle())
                .recentWatering(request.getRecent_watering())
                .build();


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
//        Plant plant = plantService.findOnePlant(id);
//        plantService.update(id, request);
        Long updatedId = plantService.update(id, request);
        Plant plant = plantService.findOnePlant(updatedId);
        return new ResponseEntity<PlantUpdateDto>(new PlantUpdateDto(plant), HttpStatus.OK);
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
