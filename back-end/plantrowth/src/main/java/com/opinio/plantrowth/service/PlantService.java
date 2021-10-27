package com.opinio.plantrowth.service;

import com.opinio.plantrowth.domain.Plant;
import com.opinio.plantrowth.repository.PlantRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

@Service
@Transactional(readOnly = true)
@RequiredArgsConstructor
public class PlantService {

    private final PlantRepository plantRepository;

    @Transactional
    public Long join(Plant plant) {
        plantRepository.save(plant);
        return plant.getId();
    }

}
