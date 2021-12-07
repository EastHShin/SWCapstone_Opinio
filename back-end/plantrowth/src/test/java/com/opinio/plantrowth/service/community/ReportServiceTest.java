package com.opinio.plantrowth.service.community;

import static org.junit.jupiter.api.Assertions.*;
import static org.mockito.ArgumentMatchers.*;

import java.time.LocalDate;
import java.time.LocalDateTime;
import java.util.Optional;

import org.assertj.core.api.Assertions;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.DisplayName;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.Mockito;
import org.mockito.junit.jupiter.MockitoExtension;

import com.opinio.plantrowth.domain.community.Board;
import com.opinio.plantrowth.domain.community.Comment;
import com.opinio.plantrowth.domain.community.Report;
import com.opinio.plantrowth.domain.user.User;
import com.opinio.plantrowth.repository.community.BoardRepository;
import com.opinio.plantrowth.repository.community.CommentRepository;
import com.opinio.plantrowth.repository.community.ReportRepository;
import com.opinio.plantrowth.repository.user.UserRepository;

@ExtendWith(MockitoExtension.class)
class ReportServiceTest {

	@Mock
	private ReportRepository reportRepository;
	@Mock
	private BoardRepository boardRepository;
	@Mock
	private CommentRepository commentRepository;
	@Mock
	private UserRepository userRepository;

	@InjectMocks
	private ReportService reportService;

	int BLOCK_COUNT;
	String reportReason;
	User user;
	Board board;
	Comment comment;
	Report givenBoardReport;
	Report givenCommentReport;

	@BeforeEach
	void setup() {
		BLOCK_COUNT = 3;
		reportReason = "맘에 안들어요";
		user = User.builder()
			.id(1L)
			.email("xldk78@gmail.com")
			.birth(LocalDate.now().minusYears(6))
			.name("동훈")
			.maxPlantNum(3)
			.password("7845")
			.plantNum(0)
			.build();
		board = Board.builder()
			.id(1L)
			.content("test")
			.title("testTitle")
			.isBlocked(false)
			.build();
		comment = Comment.builder()
			.id(1L)
			.content("test Content")
			.isBlocked(false)
			.date(LocalDateTime.now())
			.user(user)
			.build();
		givenBoardReport = Report.builder()
			.id(1L)
			.board(board)
			.user(user)
			.date(LocalDate.now())
			.reason(reportReason)
			.tag(Report.tagEnum.BOARD)
			.state(Report.StateEnum.NOTPROCESSED)
			.build();
		givenCommentReport = Report.builder()
			.id(1L)
			.comment(comment)
			.user(user)
			.date(LocalDate.now())
			.reason(reportReason)
			.tag(Report.tagEnum.COMMENT)
			.state(Report.StateEnum.NOTPROCESSED)
			.build();
	}

	@Test
	public void boardReport() throws Exception {
		//given

		//when
		Mockito.when(userRepository.findById(any())).thenReturn(Optional.of(user));
		Mockito.when(boardRepository.findById(any())).thenReturn(Optional.of(board));
		Mockito.when(reportRepository.existsByBoardIdAndUserId(any(), any())).thenReturn(false);
		Mockito.when(reportRepository.save(any())).thenReturn(givenBoardReport);
		Report report = reportService.boardReport(board.getId(), user.getId(), reportReason);

		//then
		Assertions.assertThat(report.getBoard().getId()).isEqualTo(board.getId());
		Assertions.assertThat(report.getReason()).isEqualTo(reportReason);
		Assertions.assertThat(report.getUser().getEmail()).isEqualTo(user.getEmail());
	}

	@Test
	@DisplayName("댓글 신고 정상 작동")
	public void commentReport() throws Exception {
		//given

		//when
		Mockito.when(userRepository.findById(any())).thenReturn(Optional.of(user));
		Mockito.when(commentRepository.findById(any())).thenReturn(Optional.of(comment));
		Mockito.when(reportRepository.existsByCommentIdAndUserId(any(), any())).thenReturn(false);
		Mockito.when(reportRepository.save(any())).thenReturn(givenCommentReport);

		Report report = reportService.commentReport(1L, 1L, reportReason);
		//then
		Assertions.assertThat(report.getUser().getEmail()).isEqualTo(user.getEmail());
		Assertions.assertThat(report.getComment().getContent()).isEqualTo(comment.getContent());
		Assertions.assertThat(report.getTag()).isEqualTo(Report.tagEnum.COMMENT);
		Assertions.assertThat(report.getState()).isEqualTo(Report.StateEnum.NOTPROCESSED);
	}


}