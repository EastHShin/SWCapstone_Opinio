package com.opinio.plantrowth.repository;

import com.opinio.plantrowth.domain.Board;
import com.opinio.plantrowth.domain.PlantDiary;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;
import java.util.Optional;

public interface BoardRepository extends JpaRepository<Board, String> {
    Optional<Board> findById(Long id);
    List<Board> findAllByUserId(Long id);
}
