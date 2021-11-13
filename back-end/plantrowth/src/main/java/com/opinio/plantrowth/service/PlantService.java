package com.opinio.plantrowth.service;

import com.opinio.plantrowth.api.dto.CreatePlantRequestDto;
import com.opinio.plantrowth.domain.Plant;
import com.opinio.plantrowth.repository.PlantRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

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
        plant.setPlantSpecies(requestDto.getPlant_species());
        plant.setPlantName(requestDto.getPlant_name());
        plant.setPlantBirth(requestDto.getPlant_birth());
        plant.setWaterSupply(requestDto.getWater_supply());
        plant.setAlarmCycle(requestDto.getAlarm_cycle());
//        return plantRepository.save(plant);
        return id;
    }

    @Transactional
    public Long delete(Long id) {
        Plant plant = plantRepository.findById(id).orElseThrow(IllegalAccessError::new);
        plantRepository.delete(plant);
        return id;
    }


}
