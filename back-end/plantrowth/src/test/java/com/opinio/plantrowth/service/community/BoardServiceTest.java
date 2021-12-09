package com.opinio.plantrowth.service.community;

import com.opinio.plantrowth.api.dto.community.board.BoardCreateRequest;
import com.opinio.plantrowth.domain.community.Board;
import com.opinio.plantrowth.domain.community.BoardLike;
import com.opinio.plantrowth.domain.community.Comment;
import com.opinio.plantrowth.domain.plant.Plant;
import com.opinio.plantrowth.domain.user.User;
import com.opinio.plantrowth.repository.community.BoardLikeRepository;
import com.opinio.plantrowth.repository.community.BoardRepository;
import com.opinio.plantrowth.repository.community.CommentRepository;
import com.opinio.plantrowth.repository.plant.PlantRepository;
import com.opinio.plantrowth.repository.user.UserRepository;
import org.assertj.core.api.Assertions;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.DisplayName;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.Mockito;
import org.mockito.junit.jupiter.MockitoExtension;

import java.time.LocalDate;
import java.util.ArrayList;
import java.util.List;
import java.util.Optional;

import static org.mockito.ArgumentMatchers.any;
import static org.mockito.BDDMockito.given;
import static org.mockito.Mockito.when;

@ExtendWith(MockitoExtension.class)
public class BoardServiceTest {
    @Mock
    private PlantRepository plantRepository;
    @Mock
    private BoardRepository boardRepository;
    @Mock
    private BoardLikeRepository boardLikeRepository;
    @Mock
    private CommentRepository commentRepository;
    @Mock
    private UserRepository userRepository;
    @InjectMocks
    private BoardService boardService;

    User user1;
    User user2;
    User user3;
    Plant plant1;
    Plant plant2;
    Plant plant3;
    Board board;
    Board board1;
    Board board2;
    Comment comment1;
    Comment comment2;
    BoardLike boardLike;
    @BeforeEach
    public void setUpTest() {
        user1 = User.builder()
                .name("board writer")
                .build();
        user2 = User.builder()
                .name("comment writer")
                .build();
        user3 = User.builder()
                .name("not plant owner")
                .build();

        plant1 = Plant.builder()
                .plantLevel(3)
                .user(user1)
                .build();
        plant2 = Plant.builder()
                .plantLevel(5)
                .user(user1)
                .build();
        plant3 = Plant.builder()
                .plantLevel(4)
                .build();
        board = Board.builder()
                .title("title")
                .content("content")
                .build();
        board1 = Board.builder()
                .title("title")
                .content("content")
                .build();
        board2 = Board.builder()
                .title("title")
                .content("content")
                .build();

    }

    @Test
    @DisplayName("게시글 생성")
    void createBoard() throws Exception{
        when(boardRepository.save(any())).thenReturn(board);
        Long id = boardService.createBoard(board);
        Assertions.assertThat(board.getId()).isEqualTo(id);
    }

    @Test
    @DisplayName("게시판 조회")
    public void BoardList() throws Exception{
        List<Board> boards = new ArrayList<>();
        boards.add(board);
        boards.add(board1);
        boards.add(board2);
        given(boardRepository.findAll()).willReturn(boards);
        List<Board> findBoards = boardService.BoardList();
        Assertions.assertThat(findBoards.size()).isEqualTo(3);
        Assertions.assertThat(findBoards.get(0)).isSameAs(board);
        Assertions.assertThat(findBoards.get(1)).isSameAs(board1);
        Assertions.assertThat(findBoards.get(2)).isSameAs(board2);
    }

    @Test
    @DisplayName("게시글 업데이트")
    public void updateBoard() throws Exception{
        BoardCreateRequest dto = new BoardCreateRequest("changeTitle", "changeContent", false);
        when(boardRepository.findById(any())).thenReturn(Optional.of(board));
        boardService.updateBoard(board.getId(), dto);
        Assertions.assertThat(board.getTitle()).isEqualTo("changeTitle");
        Assertions.assertThat(board.getComments()).isEqualTo("changeContent");

    }

    @Test
    @DisplayName("게시글 삭제")
    public void deleteBoard() throws Exception{
        when(boardRepository.findById(any())).thenReturn(Optional.of(board));
        boardService.deleteBoard(1L);
        Mockito.verify(boardRepository).delete(board);
    }

    @Test
    @DisplayName("좋아요")
    public void boardLike() throws Exception{
        when(boardRepository.findById(any())).thenReturn(Optional.of(board));
        boardService.boardLike(1L, 1L);
        Mockito.verify(boardLikeRepository).save(boardLike);
        boardService.boardLike(1L,1L);
        Mockito.verify(boardLikeRepository).delete(boardLike);
    }

    @Test
    @DisplayName("좋아요 세기")
    public void countedLike() throws Exception{
        boardService.boardLike(1L, 1L);
        when(boardLikeRepository.countByBoardId(1L)).thenReturn(1);
    }
}
