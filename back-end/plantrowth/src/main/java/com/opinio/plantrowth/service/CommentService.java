package com.opinio.plantrowth.service;

import com.opinio.plantrowth.api.dto.community.comment.CommentCreateRequest;
import com.opinio.plantrowth.api.dto.community.comment.CommentLookUpDTO;
import com.opinio.plantrowth.domain.Comment;
import com.opinio.plantrowth.repository.CommentRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;

@Service
@Transactional(readOnly = true)
@RequiredArgsConstructor
public class CommentService {
    private final CommentRepository commentRepository;

    @Transactional
    public Long createComment(Comment comment){

        Long commentId = commentRepository.save(comment).getId();
        return commentId;
    }

    public CommentLookUpDTO LookUpComment(Long id){
        Comment comment = findComment(id);
        CommentLookUpDTO page = new CommentLookUpDTO();
        page.setContent(comment.getContent());
        page.setDate(comment.getDate());

        return page;
    }
    public Comment findComment(Long commentId) {
        return commentRepository.findById(commentId).
                orElseThrow(()->new IllegalArgumentException("해당 댓글을 찾을 수 없습니다."));
    }

    public List<Comment> findCommentsByUserId(Long userId){
        return commentRepository.findAllByUserId(userId);
    }
    @Transactional
    public Long updateComment(Long id, CommentCreateRequest dto){
        Comment comment = commentRepository.findById(id)
                .orElseThrow(()->new IllegalArgumentException("존재하지 않는 댓글 입니다."));
        if(!(dto.getContent()==null))
            comment.setContent(dto.getContent());
        if(!(dto.getDate()==null))
            comment.setDate(dto.getDate());

        return comment.getId();
    }

    @Transactional
    public Long deleteComment(Long id){
        Comment comment = commentRepository.findById(id).
                orElseThrow(()->new IllegalArgumentException("존재하지 않는 댓글 입니다."));
        commentRepository.delete(comment);
        return id;
    }
}
