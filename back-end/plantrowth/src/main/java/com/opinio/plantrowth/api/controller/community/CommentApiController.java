package com.opinio.plantrowth.api.controller.community;


import com.opinio.plantrowth.api.dto.community.comment.CommentCUDto;
import com.opinio.plantrowth.domain.community.Comment;
import com.opinio.plantrowth.service.community.BoardService;
import com.opinio.plantrowth.service.community.CommentService;
import com.opinio.plantrowth.service.community.ReportService;
import com.opinio.plantrowth.service.user.UserService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.web.bind.annotation.*;

@RestController
@RequiredArgsConstructor
public class CommentApiController {
    private final CommentService commentService;
    private final ReportService reportService;
    private final BoardService boardService;
    private final UserService userService;
    @Transactional
    @PostMapping("/api/community/comments")//댓글 작성
    public ResponseEntity<?> createComment(@RequestParam("board-id")Long boardId,
        @RequestParam("user-id")Long userId,
        @RequestBody CommentCUDto req){
        Comment comment = Comment.builder()
            .content(req.getContent())
            .date(req.getDate()).build();
        Long id = commentService.createComment(comment);
        comment.setUser(userService.findUser(userId));
        comment.setBoard(boardService.findBoard(boardId));
        return id!=null?
            ResponseEntity.ok().body("댓글 생성 완료"):
            ResponseEntity.badRequest().body("댓글 생성 실패");
    }
    @PutMapping("/api/community/comments") // 댓글 수정
    public ResponseEntity<?> updateComment(@RequestParam("comment-id")Long commentId,
        @RequestParam("user-id")Long userId,
        @RequestBody CommentCUDto dto){
        if(commentService.checkOwner(commentId, userId)){
            return ResponseEntity.badRequest().body("잘못된 접근");
        }
        Long id = commentService.updateComment(commentId, dto);
        return id!=null?
            ResponseEntity.ok().body("댓글 수정 완료"):
            ResponseEntity.badRequest().body("댓글 수정 실패");
    }
    @DeleteMapping("/api/community/comments")//댓글 삭제
    public ResponseEntity<?> deleteComment(@RequestParam("comment-id")Long commentId,
        @RequestParam("user-id")Long userId){
        if(commentService.checkOwner(commentId, userId)){
            return ResponseEntity.badRequest().body("잘못된 접근");
        }
        Long id = commentService.deleteComment(commentId);
        return ResponseEntity.ok().body("댓글 삭제 완료");
    }
    @PostMapping("/api/community/report")//댓글 신고
    public ResponseEntity<?> reportComment(@RequestParam("comment-id")Long commentId,
        @RequestParam("user-id")Long userId){
        Long result = reportService.CommentReport(commentId, userId);
        return result!=null?
            ResponseEntity.ok().body("신고성공"):
            ResponseEntity.badRequest().body("신고실패");
    }


}
