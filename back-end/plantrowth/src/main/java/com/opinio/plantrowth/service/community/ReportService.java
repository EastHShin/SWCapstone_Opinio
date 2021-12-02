package com.opinio.plantrowth.service.community;

import java.time.LocalDate;
import java.util.List;
import java.util.Optional;

import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import com.google.firebase.database.core.Repo;
import com.opinio.plantrowth.domain.community.Board;
import com.opinio.plantrowth.domain.community.Comment;
import com.opinio.plantrowth.domain.community.Report;
import com.opinio.plantrowth.domain.user.User;
import com.opinio.plantrowth.repository.community.BoardRepository;
import com.opinio.plantrowth.repository.community.CommentRepository;
import com.opinio.plantrowth.repository.community.ReportRepository;
import com.opinio.plantrowth.repository.user.UserRepository;

import lombok.RequiredArgsConstructor;

@Service
@Transactional(readOnly = true)
@RequiredArgsConstructor
public class ReportService {
	private final ReportRepository reportRepository;
	private final BoardRepository boardRepository;
	private final CommentRepository commentRepository;
	private final UserRepository userRepository;

	private static final int BLOCK_COUNT = 3;

	@Transactional
	public Report boardReport(Long boardId, Long userId, String reportReason) {
		User reportingUser = userRepository.findById(userId).orElseThrow(
			() -> new IllegalArgumentException("No Found User in Board Report")
		);
		Board board = boardRepository.findById(boardId).orElseThrow(
			() -> new IllegalArgumentException("No Found board")
		);
		Report report = Report.builder()
			.user(reportingUser)
			.board(board)
			.date(LocalDate.now())
			.reason(reportReason)
			.state(Report.StateEnum.NOTPROCESSED)
			.tag(Report.tagEnum.BOARD)
			.build();

		return reportRepository.save(report);
	}

	@Transactional
	public Report commentReport(Long commentId, Long userId, String reportReason) {
		User reportingUser = userRepository.findById(userId).orElseThrow(
			() -> new IllegalArgumentException("No Found User in Comment Report")
		);
		Comment comment = commentRepository.findById(commentId).orElseThrow(
			() -> new IllegalArgumentException("No Found Comment")
		);
		Report report = Report.builder()
			.user(reportingUser)
			.comment(comment)
			.date(LocalDate.now())
			.reason(reportReason)
			.state(Report.StateEnum.NOTPROCESSED)
			.tag(Report.tagEnum.COMMENT)
			.build();
		return reportRepository.save(report);
	}

	public List<Report> viewReports() {
		return reportRepository.findAll();
	}

	@Transactional
	public Report viewReport(Long reportId) {
		Report report = reportRepository.findById(reportId)
			.orElseThrow(() -> new IllegalArgumentException("존재하지 않는 신고입니다."));
		return report;
	}

	@Transactional
	public Report completeBoardReport(Long reportId) {
		Report report = reportRepository.findById(reportId)
			.orElseThrow(() -> new IllegalArgumentException("존재하지 않는 신고입니다."));
		report.setState(Report.StateEnum.COMPLETE);
		report.getBoard().setIsBlocked(true);
		report.getBoard().getReports().stream()
			.forEach(r -> r.setState(Report.StateEnum.COMPLETE));
		return report;
	}

	@Transactional
	public Report completeCommentReport(Long reportId) {
		Report report = reportRepository.findById(reportId)
			.orElseThrow(() -> new IllegalArgumentException("No Found Report in Comment"));
		report.setState(Report.StateEnum.COMPLETE);
		report.getComment().setIsBlocked(true);
		report.getComment().getReports().stream()
			.forEach(r -> r.setState(Report.StateEnum.COMPLETE));
		return report;
	}

	@Transactional
	public void autoBlockBoardReport(Report report) {
		int numOfReports = report.getBoard().getReports().size();
		if (numOfReports > BLOCK_COUNT) {
			report.getBoard().setIsBlocked(true);
			report.getBoard().getReports().stream()
				.forEach(r -> r.setState(Report.StateEnum.AUTOCOMPLETE));
		}
	}

	@Transactional
	public void autoBlockCommentReport(Report report) {
		int numOfReports = report.getComment().getReports().size();
		if (numOfReports > BLOCK_COUNT) {
			report.getComment().setIsBlocked(true);
			report.getComment().getReports().stream()
				.forEach(c -> c.setState(Report.StateEnum.AUTOCOMPLETE));
		}
	}
}
