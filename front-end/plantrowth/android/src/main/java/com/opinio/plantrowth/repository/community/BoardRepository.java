package com.opinio.plantrowth.repository.community;

import com.opinio.plantrowth.domain.community.Board;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;
import java.util.Optional;

public interface BoardRepository extends JpaRepository<Board, Long> {
    Optional<Board> findById(Long id);
    List<Board> findAllByUserId(Long id);
    List<Board> findAll();
}
