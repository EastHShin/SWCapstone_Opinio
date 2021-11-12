package com.opinio.plantrowth.repository;

import com.opinio.plantrowth.domain.PlantDiary;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;
import java.util.Optional;

public interface PlantDiaryRepository extends JpaRepository<PlantDiary, Long>{

   Optional<PlantDiary> findById(Long id);
   List<PlantDiary> findAllByPlantId(Long id);
}


//JPA repo 문서 보기
