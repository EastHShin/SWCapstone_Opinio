package com.opinio.plantrowth.api.controller.community;


import com.opinio.plantrowth.api.dto.community.comment.CommentCUDto;
import com.opinio.plantrowth.domain.community.Comment;
import com.opinio.plantrowth.service.community.CommentService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

@RestController
@RequiredArgsConstructor
public class CommentApiController {
    private final CommentService commentService;

    @PostMapping("/api/community/comments/{board-id}&{user-id}")//댓글 작성
    public ResponseEntity<?> createComment(@PathVariable("board-id")Long boardId,
                                           @PathVariable("user-id")Long userId,
                                           @RequestBody CommentCUDto req){
        Comment comment = Comment.builder()
                .content(req.getContent())
                .date(req.getDate()).build();
        Long id = commentService.createComment(comment);
        return id!=null?
                ResponseEntity.ok().body("댓글 생성 완료"):
                ResponseEntity.badRequest().body("댓글 생성 실패");
    }
    @PutMapping("/api/community/comments/{board-id}&{user-id}") // 댓글 수정
    public ResponseEntity<?> updateComment(@PathVariable("board-id") Long commentId,
                                           @PathVariable("user-id") Long userId,
                                           @RequestBody CommentCUDto dto){
        Long id = commentService.updateComment(commentId, dto);
        return id!=null?
                ResponseEntity.ok().body("댓글 수정 완료"):
                ResponseEntity.badRequest().body("댓글 수정 실패");
    }
    @DeleteMapping("/api/community/comments/{board-id}&{user-id}")//댓글 삭제
    public ResponseEntity<?> deleteComment(@PathVariable("board-id")Long commentId,
                                           @PathVariable("user-id") Long userId){
        Long id = commentService.deleteComment(commentId);
        return ResponseEntity.ok().body("댓글 삭제 완료");
    }
//    @PostMapping("/api/community/report/{comment-id}")//댓글 신고

}
