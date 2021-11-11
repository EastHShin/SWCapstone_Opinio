package com.opinio.plantrowth.repository;

import com.opinio.plantrowth.domain.Plant;
import com.opinio.plantrowth.domain.User;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;
import java.util.Optional;

public interface PlantRepository extends JpaRepository<Plant, Long> {

    List<Plant> findAllByUserId(Long id);
    Optional<Plant> findById(Long id);
    Optional<User> findUserById(Long id);
}
