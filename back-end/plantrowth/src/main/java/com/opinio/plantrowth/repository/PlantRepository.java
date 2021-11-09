package com.opinio.plantrowth.repository;

import com.opinio.plantrowth.domain.Plant;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;

public interface PlantRepository extends JpaRepository<Plant, Long> {

    List<Plant> findAllByUserId(Long id);

}
