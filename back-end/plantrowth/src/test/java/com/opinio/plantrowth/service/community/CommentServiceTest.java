package com.opinio.plantrowth.service.community;


import com.opinio.plantrowth.api.dto.community.comment.CommentCUDto;
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

import java.util.ArrayList;
import java.util.List;
import java.util.Optional;

import static org.junit.jupiter.api.Assertions.*;
import static org.mockito.ArgumentMatchers.any;
import static org.mockito.BDDMockito.given;
import static org.mockito.Mockito.when;

@ExtendWith(MockitoExtension.class)
public class CommentServiceTest {
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
    private CommentService commentService;
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
        comment1 = Comment.builder()
                .content("content")
                .build();
        comment2 = Comment.builder()
                .content("content")
                .build();
    }

    @Test
    @DisplayName("댓글 생성")
    public void createComment() throws Exception{
        when(commentRepository.save(any())).thenReturn(comment1);
        Long id = commentService.createComment(comment1);
        Assertions.assertThat(board.getId()).isEqualTo(id);
    }
    @Test
    @DisplayName("댓글 목록 조회")
    public void LookUpComment() throws Exception{
        List<Comment> comments = new ArrayList<>();
        comments.add(comment1);
        comments.add(comment2);
        given(commentRepository.findAll()).willReturn(comments);
    }
    @Test
    @DisplayName("댓글 조회")
    public void findComment() throws Exception{
        when(commentRepository.findById(1L)).thenReturn(Optional.of(comment1));
    }
    @Test
    @DisplayName("댓글 수정")
    public void updateComment() throws  Exception{
        CommentCUDto dto = new CommentCUDto("changeContent");
        when(commentRepository.findById(1L)).thenReturn(Optional.of(comment1));
        commentService.updateComment(comment1.getId(), dto);
        Assertions.assertThat(comment1.getContent()).isEqualTo("changeContent");
        Assertions.assertThat(comment1.getIsUpdate()).isEqualTo(true);
    }
    @Test
    @DisplayName("댓글 삭제")
    public void deleteComment() throws Exception{
        when(commentRepository.findById(1L)).thenReturn(Optional.of(comment1));
        commentService.deleteComment(1L);
        Mockito.verify(commentRepository).delete(comment1);
    }
    @Test
    @DisplayName("최대 레벨 찾기")
    public void getUserLevel() throws  Exception{
        Integer maxLevel = commentService.getUserLevel(1L);
        Assertions.assertThat(maxLevel).isEqualTo(5);
        Integer nonLevel = commentService.getUserLevel(2L);
        Assertions.assertThat(nonLevel).isEqualTo(0);
    }
}
