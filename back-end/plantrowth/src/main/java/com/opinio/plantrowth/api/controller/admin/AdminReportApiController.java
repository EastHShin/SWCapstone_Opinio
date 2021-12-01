package com.opinio.plantrowth.api.controller.admin;

import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RestController;

import com.opinio.plantrowth.service.community.ReportService;

import lombok.RequiredArgsConstructor;

@RequiredArgsConstructor
@RestController
public class AdminReportApiController {

	private final ReportService reportService;

	@PostMapping("/api/admin/community/board/report/{report-id}")
	public ResponseEntity processBoardReport(@PathVariable("report-id") Long reportId) {
		reportService.completeBoardReport(reportId);
		return new ResponseEntity(HttpStatus.OK);
	}

	@PostMapping("/api/admin/community/comment/report/{report-id}")
	public ResponseEntity processCommentReport(@PathVariable("report-id") Long reportId) {
		reportService.completeCommentReport(reportId);
		return new ResponseEntity(HttpStatus.OK);
	}
}
