package com.opinio.plantrowth.repository;

import com.opinio.plantrowth.domain.Plant;
import com.opinio.plantrowth.domain.User;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.repository.query.Param;

import java.util.List;

public interface PlantRepository extends JpaRepository<Plant, Long> {

    List<Plant> findAllByUserId(Long id);
}
