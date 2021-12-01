package com.opinio.plantrowth.api.controller.community;

import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;

import com.opinio.plantrowth.domain.community.Report;
import com.opinio.plantrowth.service.community.ReportService;

import lombok.RequiredArgsConstructor;

@RequiredArgsConstructor
@RestController
public class ReportApiController {

	private final ReportService reportService;

	@PostMapping("/api/community/board/report")//게시글 신고
	public ResponseEntity<?> reportBoard(@RequestParam("board-id")Long boardId,
		@RequestParam("user-id")Long userId){
		Report report = reportService.boardReport(boardId, userId);
		return report!=null?
			ResponseEntity.ok().body("신고성공"):
			ResponseEntity.badRequest().body("신고실패");
	}

	@PostMapping("/api/community/comment/report")//댓글 신고
	public ResponseEntity<?> reportComment(@RequestParam("comment-id")Long commentId,
		@RequestParam("user-id")Long userId){
		Long result = reportService.commentReport(commentId, userId);
		return result!=null?
			ResponseEntity.ok().body("신고성공"):
			ResponseEntity.badRequest().body("신고실패");
	}
}
