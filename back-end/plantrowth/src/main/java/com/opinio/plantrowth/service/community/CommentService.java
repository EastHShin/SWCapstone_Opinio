package com.opinio.plantrowth.service.community;

import java.time.LocalDateTime;
import java.util.List;

import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import com.opinio.plantrowth.api.dto.community.comment.CommentCUDto;
import com.opinio.plantrowth.api.dto.community.comment.CommentLookUpDTO;
import com.opinio.plantrowth.domain.community.Comment;
import com.opinio.plantrowth.repository.community.CommentRepository;

import lombok.RequiredArgsConstructor;

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
    public List<Comment> findCommentsByBoardID(Long boardId) {return commentRepository.findAllByBoardId(boardId);}
    @Transactional
    public Long updateComment(Long id, CommentCUDto dto){
        Comment comment = commentRepository.findById(id)
                .orElseThrow(()->new IllegalArgumentException("존재하지 않는 댓글 입니다."));
        if(!(dto.getContent()==null))
            comment.setContent(dto.getContent());
            comment.setDate(LocalDateTime.now());

        return comment.getId();
    }

    @Transactional
    public Long deleteComment(Long id){
        Comment comment = commentRepository.findById(id).
                orElseThrow(()->new IllegalArgumentException("존재하지 않는 댓글 입니다."));
        commentRepository.delete(comment);
        return id;
    }

    public Integer countedComments(Long boardId){
        Integer countedComments = commentRepository.countByBoardId(boardId);
        return countedComments;
    }

    public Boolean checkOwner(Long commentId, Long userId){
        Comment comment = commentRepository.findById(commentId).orElseThrow(()->new IllegalArgumentException("잘못된 보드 아이디"));
        return comment.getUser().getId()==userId;
    }

}
