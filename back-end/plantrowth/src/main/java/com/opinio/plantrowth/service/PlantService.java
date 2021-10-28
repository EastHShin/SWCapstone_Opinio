package com.opinio.plantrowth.service;

import com.opinio.plantrowth.domain.Plant;
import com.opinio.plantrowth.repository.PlantRepository;
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
        plantRepository.save(plant);
        return plant.getId();
    }

    public List<Plant> findPlants(){
        /* userId 정해지면 풀기
        Long id = plantRepository.findById(id);
        return plantRepository.findAllById(id);
         */
        return plantRepository.findAll();
    }
}
