package com.opinio.plantrowth.repository.community;

import com.opinio.plantrowth.domain.community.BoardLike;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.Optional;

public interface BoardLikeRepository extends JpaRepository<BoardLike, Long> {
    //구문 에러 발생시, userId, boardId를 user,board로
    boolean existsByUserIdAndBoardId(Long userId, Long boardId);
    Optional<BoardLike> deleteByUserIdAndBoardId(Long userId, Long boardId);
    Integer countByBoardId(Long boardId);
    Optional<BoardLike> findByUserIdAndBoardId(Long userId, Long boardId);
}
