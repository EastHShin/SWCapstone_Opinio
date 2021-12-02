package com.opinio.plantrowth.repository.plant;

import com.opinio.plantrowth.domain.plant.Plant;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;

import java.util.Arrays;
import java.util.List;

public interface PlantRepository extends JpaRepository<Plant, Long> {

	List<Plant> findAllByUserId(Long id);

	@Query("select p.plantLevel from Plant p where p.user.id = ?1")
	List<Integer> findPlantLevelByUserId(Long userId);

	Boolean existsByUserId(Long userId);
}
