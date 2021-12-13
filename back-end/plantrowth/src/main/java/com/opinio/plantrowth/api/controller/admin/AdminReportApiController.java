package com.opinio.plantrowth.api.controller.admin;

import java.time.LocalDate;
import java.util.List;
import java.util.stream.Collectors;

import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RestController;

import com.opinio.plantrowth.domain.community.Report;
import com.opinio.plantrowth.service.community.ReportService;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;
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

	@GetMapping("/api/admin/community/report/all")
	public ResponseEntity<ReportResult> getReports(){
		List<Report> reports = reportService.viewReports();
		List<ReportViewDTO> collect = reports.stream()
			.map(report -> new ReportViewDTO(report))
			.collect(Collectors.toList());
		return new ResponseEntity<ReportResult>(new ReportResult(collect), HttpStatus.OK);
	}

	@Data
	@NoArgsConstructor
	@AllArgsConstructor
	static class ReportResult<T>{
		private T data;
	}

	@Data
	@NoArgsConstructor
	static class ReportViewDTO{
		private Long report_id;
		private String reason;
		private LocalDate date;
		private Report.StateEnum state;
		private Report.tagEnum tag;
		private Long user_id;
		private String username;
		private Long board_id;
		private Long comment_id;

		public ReportViewDTO(Report report){
			report_id = report.getId();
			reason = report.getReason();
			date = report.getDate();
			state = report.getState();
			tag = report.getTag();
			user_id = report.getUser().getId();
			username = report.getUser().getName();
			if (report.getTag().equals(Report.tagEnum.BOARD)) {
				board_id = report.getBoard().getId();
			} else if (report.getTag().equals(Report.tagEnum.COMMENT)) {
				comment_id = report.getComment().getId();
				board_id= report.getComment().getBoard().getId();
			}
		}
	}
}
