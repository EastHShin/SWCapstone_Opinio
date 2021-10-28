package com.opinio.plantrowth.repository;

import com.opinio.plantrowth.domain.Plant;
import org.springframework.data.jpa.repository.JpaRepository;

public interface PlantRepository extends JpaRepository<Plant, Long> {
}
