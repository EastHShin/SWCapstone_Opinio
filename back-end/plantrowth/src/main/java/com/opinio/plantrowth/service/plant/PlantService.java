package com.opinio.plantrowth.service.plant;

import com.opinio.plantrowth.api.dto.plant.CreatePlantRequestDto;
import com.opinio.plantrowth.domain.plant.Plant;
import com.opinio.plantrowth.domain.user.User;
import com.opinio.plantrowth.repository.plant.PlantRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.LocalDate;
import java.time.temporal.ChronoUnit;
import java.util.List;

@Service
@Transactional(readOnly = true)
@RequiredArgsConstructor
public class PlantService {

    private final PlantRepository plantRepository;

    @Transactional
    public Long join(Plant plant) {
        Plant savedPlant = plantRepository.save(plant);
        return savedPlant.getId();
    }

    public Plant findOnePlant(Long id) {
        return plantRepository.findById(id).orElseThrow(IllegalAccessError::new);
    }

    public List<Plant> findPlants(Long userId) {
        return plantRepository.findAllByUserId(userId);
    }

    @Transactional
    public Long update(Long id, CreatePlantRequestDto requestDto) {
        Plant plant = plantRepository.findById(id).orElseThrow(IllegalAccessError::new);
        if(!(requestDto.getPlant_species() == null))
            plant.setPlantSpecies(requestDto.getPlant_species());
        if(!(requestDto.getPlant_name() == null))
            plant.setPlantName(requestDto.getPlant_name());
        if(!(requestDto.getPlant_birth() == null))
            plant.setPlantBirth(requestDto.getPlant_birth());
        if(!(requestDto.getWater_supply() == null))
            plant.setWaterSupply(requestDto.getWater_supply());
        if(!(requestDto.getAlarm_cycle() == null))
            plant.setAlarmCycle(requestDto.getAlarm_cycle());
        if(!(requestDto.getRecent_watering() == null)) {
            plant.setRecentWatering(requestDto.getRecent_watering());
            long until = requestDto.getRecent_watering().until(LocalDate.now(), ChronoUnit.DAYS);
            Integer remainCycle;
            if(until > plant.getAlarmCycle()){
                remainCycle = 0;
            }
            else{
                remainCycle = plant.getAlarmCycle() - (int)until;
            }
            plant.setRemainCycle(remainCycle);
        }


        return id;
    }

    @Transactional
    public void updateImage(Long id, String imageName) {
        Plant plant = plantRepository.findById(id).orElseThrow(IllegalAccessError::new);
        plant.setFileName(imageName);
    }

    @Transactional
    public Long delete(Long id) {
        Plant plant = plantRepository.findById(id).orElseThrow(IllegalAccessError::new);
        User user = plant.getUser();
        Integer curPlantNum = user.getPlantNum();
        user.setPlantNum(curPlantNum-1);
        plantRepository.delete(plant);
        return id;
    }

    public List<Plant> findAllPlant() {
        return plantRepository.findAll();
    }

    @Transactional
    public void updateRemainCycle(Long plantId, Integer remainCycle) {
        Plant plant = plantRepository.findById(plantId).orElseThrow(IllegalAccessError::new);
        plant.setRemainCycle(remainCycle);
    }


}
