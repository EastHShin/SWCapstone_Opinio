package com.opinio.plantrowth.api.controller.community;

import java.time.LocalDateTime;

import org.springframework.http.ResponseEntity;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.web.bind.annotation.DeleteMapping;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.PutMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;

import com.opinio.plantrowth.api.dto.community.comment.CommentCUDto;
import com.opinio.plantrowth.domain.community.Comment;
import com.opinio.plantrowth.domain.user.User;
import com.opinio.plantrowth.service.community.BoardService;
import com.opinio.plantrowth.service.community.CommentService;
import com.opinio.plantrowth.service.community.ReportService;
import com.opinio.plantrowth.service.user.UserService;

import lombok.RequiredArgsConstructor;

@RestController
@RequiredArgsConstructor
public class CommentApiController {
	private final CommentService commentService;
	private final ReportService reportService;
	private final BoardService boardService;
	private final UserService userService;

	@Transactional
	@PostMapping("/api/community/comments")//댓글 작성
	public ResponseEntity<?> createComment(@RequestParam("board-id") Long boardId,
		@RequestParam("user-id") Long userId,
		@RequestBody CommentCUDto req) {
		User user = userService.findUser(userId);
		Comment comment = Comment.builder()
			.content(req.getContent())
			.date(LocalDateTime.now())
			.writer(user.getName())
			.user(user)
			.isBlocked(false)
			.build();
		Long id = commentService.createComment(comment);
		comment.setBoard(boardService.findBoard(boardId));
		return id != null ?
			ResponseEntity.ok().body("댓글 생성 완료") :
			ResponseEntity.badRequest().body("댓글 생성 실패");
	}

	@PutMapping("/api/community/comments") // 댓글 수정
	public ResponseEntity<?> updateComment(@RequestParam("comment-id") Long commentId,
		@RequestParam("user-id") Long userId,
		@RequestBody CommentCUDto dto) {
		if (commentService.checkOwner(commentId, userId)) {
			return ResponseEntity.badRequest().body("잘못된 접근");
		}
		Long id = commentService.updateComment(commentId, dto);
		return id != null ?
			ResponseEntity.ok().body("댓글 수정 완료") :
			ResponseEntity.badRequest().body("댓글 수정 실패");
	}

	@DeleteMapping("/api/community/comments")//댓글 삭제
	public ResponseEntity<?> deleteComment(@RequestParam("comment-id") Long commentId,
		@RequestParam("user-id") Long userId) {
		if (commentService.checkOwner(commentId, userId)) {
			return ResponseEntity.badRequest().body("잘못된 접근");
		}
		Long id = commentService.deleteComment(commentId);
		return ResponseEntity.ok().body("댓글 삭제 완료");
	}

}
