package com.opinio.plantrowth.repository.plant;

import com.opinio.plantrowth.domain.plant.Plant;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;

public interface PlantRepository extends JpaRepository<Plant, Long> {

    List<Plant> findAllByUserId(Long id);
}
