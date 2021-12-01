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

	@Transactional
	public Report boardReport(Long boardId, Long userId) {
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
			.state(Report.StateEnum.NOTPROCESSED)
			.tag(Report.tagEnum.BOARD)
			.build();

		return reportRepository.save(report);
	}

	@Transactional
	public Long commentReport(Long commentId, Long userId) {
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
			.state(Report.StateEnum.NOTPROCESSED)
			.tag(Report.tagEnum.COMMENT)
			.build();
		Long reportId = reportRepository.save(report).getId();
		return reportId;
	}

	public List<Report> viewReports() {
		return reportRepository.findAll();
	}

	@Transactional
	public Report viewReport(Long reportId) {
		Report report = reportRepository.findById(reportId)
			.orElseThrow(() -> new IllegalArgumentException("존재하지 않는 신고입니다."));
		report.setState(Report.StateEnum.PROCESSED);
		return report;
	}

	@Transactional
	public Report completeBoardReport(Long reportId) {
		Report report = reportRepository.findById(reportId)
			.orElseThrow(() -> new IllegalArgumentException("존재하지 않는 신고입니다."));
		report.setState(Report.StateEnum.COMPLETE);
		report.getBoard().setIsBlocked(true);
		return report;
	}

	@Transactional
	public Report completeCommentReport(Long reportId) {
		Report report = reportRepository.findById(reportId)
			.orElseThrow(() -> new IllegalArgumentException("No Found Report in Comment"));
		report.setState(Report.StateEnum.COMPLETE);
		report.getComment().setIsBlocked(true);
		return report;
	}
}
