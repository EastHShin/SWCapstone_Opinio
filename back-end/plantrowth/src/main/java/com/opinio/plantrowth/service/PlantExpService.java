package com.opinio.plantrowth.service;

import com.opinio.plantrowth.domain.Plant;
import com.opinio.plantrowth.repository.PlantRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

@Transactional(readOnly = true)
@RequiredArgsConstructor
@Service
public class PlantExpService {

    private final PlantRepository plantRepository;
    private final static Integer increasingExp = 10;
    @Transactional
    public Long increaseExp(Long plant_id) {
        Plant plant = plantRepository.findById(plant_id).orElseThrow(IllegalAccessError::new);
        Integer curExp = plant.getPlantExp();
        plant.setPlantExp(curExp + increasingExp);
        return plant.getId();
    }

}
