package com.opinio.plantrowth.repository.community;

import com.opinio.plantrowth.domain.community.BoardLike;
import com.opinio.plantrowth.domain.community.Report;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;
import java.util.Optional;

public interface ReportRepository extends JpaRepository<Report, Long> {
    Optional<BoardLike> findByBoardIdAndCommentId(Long userId, Long boardId);
}
