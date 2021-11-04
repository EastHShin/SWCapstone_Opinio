package com.opinio.plantrowth.service;

import com.opinio.plantrowth.api.dto.CreatePlantRequestDto;
import com.opinio.plantrowth.domain.Plant;
import com.opinio.plantrowth.domain.User;
import com.opinio.plantrowth.repository.PlantRepository;
import com.opinio.plantrowth.repository.UserRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.web.bind.annotation.GetMapping;

import java.util.List;
import java.util.Optional;

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
        return plantRepository.getById(id);
    }

    public List<Plant> findPlants(Long userId) {
        return plantRepository.findAllByUserId(userId);
    }

    @Transactional
    public Plant update(Long id, CreatePlantRequestDto requestDto) {
        Plant plant = plantRepository.findById(id).orElseThrow(IllegalAccessError::new);
        plant.setPlantSpecies(requestDto.getPlantSpecies());
        plant.setPlantName(requestDto.getPlantName());
        plant.setPlantBirth(requestDto.getPlantBirth());
        plant.setPlantExp(requestDto.getPlantExp());
        plant.setFileName(requestDto.getFileName());
        plant.setWaterSupply(requestDto.getWaterSupply());
        plant.setAlarmCycle(requestDto.getAlarmCycle());
        return plant;
    }

    @Transactional
    public Long delete(Long id) {
        Plant plant = plantRepository.findById(id).orElseThrow(IllegalAccessError::new);
        plantRepository.delete(plant);
        return id;
    }


}
