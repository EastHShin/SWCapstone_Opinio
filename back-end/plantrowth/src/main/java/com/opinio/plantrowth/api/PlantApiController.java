package com.opinio.plantrowth.api;

import com.opinio.plantrowth.api.dto.plant.CreatePlantRequestDto;
import com.opinio.plantrowth.api.dto.plant.CreatePlantResponseDto;
import com.opinio.plantrowth.api.dto.plant.PlantManageDto;
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
import org.springframework.http.MediaType;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;

import java.time.LocalDate;
import java.time.temporal.ChronoUnit;
import java.util.List;
import java.util.Optional;
import java.util.stream.Collectors;

@RestController
@RequiredArgsConstructor
public class PlantApiController {

    private final PlantService plantService;
    private final UserService userService;
    private final FileUploadService fileUploadService;
    private final String filePath = "profiles";
    //    Postman Test
    @PostMapping("/api/upload")
    public String uploadImage(@RequestPart MultipartFile file) {
        return fileUploadService.uploadImage(file, filePath);
    }



    @PostMapping(value = "/api/plants/profiles/{user-id}", consumes = {MediaType.MULTIPART_FORM_DATA_VALUE,MediaType.APPLICATION_JSON_VALUE}, produces = MediaType.APPLICATION_JSON_VALUE)
    public CreatePlantResponseDto savePlant(
            @PathVariable("user-id") Long userId,
            @ModelAttribute CreatePlantRequestDto request,
            @RequestPart(name = "file_name",required = false) Optional<MultipartFile> file) {

        long until = request.getRecent_watering().until(LocalDate.now(), ChronoUnit.DAYS);
        Integer remainCycle;
        if(until > request.getAlarm_cycle()){
            remainCycle = 0;
        }
        else{
            remainCycle = request.getAlarm_cycle() - (int)until;
        }
        Plant plant = Plant.builder()
                .plantSpecies(request.getPlant_species())
                .plantName(request.getPlant_name())
                .plantBirth(request.getPlant_birth())
                .plantExp(0)
                .plantLevel(1)
                .waterSupply(request.getWater_supply())
                .alarmCycle(request.getAlarm_cycle())
                .recentWatering(request.getRecent_watering())
                .remainCycle(remainCycle)
                .build();


        if(file.isPresent()) {
            String uploadImageName = fileUploadService.uploadImage(file.get(), filePath);
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

    @GetMapping(value = "/api/plants/profiles/manage/{plant-id}")
    public ResponseEntity<PlantManageDto> getOnePlant(@PathVariable("plant-id") Long id) {
        Plant plant = plantService.findOnePlant(id);

        return new ResponseEntity<PlantManageDto>(new PlantManageDto(plant), HttpStatus.OK);
    }

    @PutMapping(value = "/api/plants/profiles/{plant-id}", consumes = {MediaType.MULTIPART_FORM_DATA_VALUE,MediaType.APPLICATION_JSON_VALUE}, produces = MediaType.APPLICATION_JSON_VALUE)
    public ResponseEntity<PlantUpdateDto> updatePlant(@PathVariable("plant-id") Long id,
                                                      @ModelAttribute CreatePlantRequestDto request,
                                                      @RequestPart(value = "file_name", required = false) Optional<MultipartFile> file) {
//        Plant plant = plantService.findOnePlant(id);
//        plantService.update(id, request);
        Long updatedId = plantService.update(id, request);
        Plant plant = plantService.findOnePlant(updatedId);
        System.out.println(file.toString());
        if(file.isPresent()) {
            String uploadImageName = fileUploadService.uploadImage(file.get(), filePath);
            plantService.updateImage(id, uploadImageName);
        }
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