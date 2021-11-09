package com.opinio.plantrowth.repository;

import com.opinio.plantrowth.domain.PlantDiary;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.Optional;

public interface DiaryRepository extends JpaRepository<PlantDiary, Long>{

   Optional<PlantDiary> findByPlantId(Long id);
   Optional<PlantDiary> findByPlant(Long id);
   Optional<PlantDiary> findByDiaryId(Long id);
}

//JPA repo 문서 보기
