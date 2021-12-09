package com.opinio.plantrowth.repository.community;
import com.opinio.plantrowth.domain.community.Comment;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;
import java.util.Optional;

public interface CommentRepository extends JpaRepository<Comment, Long> {
    Optional<Comment> findById(Long id);
    List<Comment> findAllByUserId(Long id);
    List<Comment> findAllByBoardId(Long id);
    Integer countByBoardId(Long id);
}
