package com.opinio.plantrowth.service.community;

import static org.junit.jupiter.api.Assertions.*;
import static org.mockito.ArgumentMatchers.*;

import java.time.LocalDate;
import java.util.Optional;

import org.assertj.core.api.Assertions;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.Mockito;
import org.mockito.junit.jupiter.MockitoExtension;

import com.opinio.plantrowth.domain.community.Board;
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
	User user;
	Board board;
	@BeforeEach
	void setup() {
		BLOCK_COUNT = 3;
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
	}

	@Test
	public void boardReport() throws Exception {
		//given
		String reportReason = "맘에 안들어요";
		Report givenReport = Report.builder()
			.id(1L)
			.board(board)
			.user(user)
			.date(LocalDate.now())
			.reason(reportReason)
			.tag(Report.tagEnum.BOARD)
			.state(Report.StateEnum.NOTPROCESSED)
			.build();
		//when
		Mockito.when(userRepository.findById(any())).thenReturn(Optional.of(user));
		Mockito.when(boardRepository.findById(any())).thenReturn(Optional.of(board));
		Mockito.when(reportRepository.existsByBoardIdAndUserId(any(),any())).thenReturn(false);
		Mockito.when(reportRepository.save(any())).thenReturn(givenReport);
		Report report = reportService.boardReport(board.getId(), user.getId(), reportReason);

		//then
		Assertions.assertThat(report.getBoard().getId()).isEqualTo(board.getId());
		Assertions.assertThat(report.getReason()).isEqualTo(reportReason);
		Assertions.assertThat(report.getUser().getEmail()).isEqualTo(user.getEmail());
	}

}