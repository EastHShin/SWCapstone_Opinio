package com.opinio.plantrowth.api.controller.community;

import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;

import com.opinio.plantrowth.domain.community.Report;
import com.opinio.plantrowth.service.community.ReportService;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.RequiredArgsConstructor;

@RequiredArgsConstructor
@RestController
public class ReportApiController {

	private final ReportService reportService;

	@PostMapping("/api/community/board/report")//게시글 신고
	public ResponseEntity reportBoard(@RequestParam("board-id")Long boardId,
		@RequestParam("user-id")Long userId, @RequestBody ReportDTO reportDTO){
		Report report = reportService.boardReport(boardId, userId, reportDTO.getReason());
		if (report == null) {
			return ResponseEntity.notFound().build();
		}
		reportService.autoBlockBoardReport(report);

		return new ResponseEntity(HttpStatus.OK);
	}

	@PostMapping("/api/community/comment/report")//댓글 신고
	public ResponseEntity reportComment(@RequestParam("comment-id")Long commentId,
		@RequestParam("user-id")Long userId, @RequestBody ReportDTO reportDTO){
		Report report = reportService.commentReport(commentId, userId, reportDTO.getReason());
		if (report == null) {
			return ResponseEntity.notFound().build();
		}
		reportService.autoBlockCommentReport(report);
		return new ResponseEntity(HttpStatus.OK);
	}

	@Data
	static class ReportDTO{
		private String reason;
	}
}
