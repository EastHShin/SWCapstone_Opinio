package com.opinio.plantrowth.service.plant;

import com.opinio.plantrowth.domain.plant.Plant;
import com.opinio.plantrowth.repository.plant.PlantRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.LocalDate;

@Transactional(readOnly = true)
@RequiredArgsConstructor
@Service
public class WateringService {
    private final PlantRepository plantRepository;

    @Transactional
    public Long watering(Long plant_id) {
        Plant plant = plantRepository.findById(plant_id).orElseThrow(IllegalAccessError::new);
        plant.setRemainCycle(plant.getAlarmCycle());
        plant.setRecentWatering(LocalDate.now());
        return plant_id;
    }

}
