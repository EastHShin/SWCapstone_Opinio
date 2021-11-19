package com.opinio.plantrowth.repository;
import com.opinio.plantrowth.domain.Board;
import com.opinio.plantrowth.domain.Comment;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;
import java.util.Optional;

public interface CommentRepository extends JpaRepository<Comment, Long> {
    Optional<Comment> findById(Long id);
    List<Comment> findAllByUserId(Long id);
}
