package com.opinio.plantrowth.api;

import com.fasterxml.jackson.databind.ObjectMapper;
import com.fasterxml.jackson.datatype.jsr310.JavaTimeModule;
import com.opinio.plantrowth.api.dto.auth.JoinDTO;
import com.opinio.plantrowth.api.dto.community.board.BoardCreateRequest;
import com.opinio.plantrowth.api.dto.plant.CreatePlantRequestDto;
import com.opinio.plantrowth.config.security.JwtTokenProvider;
import com.opinio.plantrowth.domain.community.Board;
import com.opinio.plantrowth.domain.plant.Plant;
import com.opinio.plantrowth.domain.user.User;
import com.opinio.plantrowth.repository.user.UserRepository;
import com.opinio.plantrowth.service.EmailAuth.EmailService;
import com.opinio.plantrowth.service.FirebaseAlarm.FCMService;
import com.opinio.plantrowth.service.community.BoardService;
import com.opinio.plantrowth.service.community.CommentService;
import com.opinio.plantrowth.service.community.ReportService;
import com.opinio.plantrowth.service.fileUpload.FileUploadService;
import com.opinio.plantrowth.service.payment.BillingService;
import com.opinio.plantrowth.service.payment.PointRecordService;
import com.opinio.plantrowth.service.plant.DiagnosisRecordService;
import com.opinio.plantrowth.service.plant.DiaryService;
import com.opinio.plantrowth.service.plant.PlantExpService;
import com.opinio.plantrowth.service.plant.PlantService;
import com.opinio.plantrowth.service.plant.WateringService;
import com.opinio.plantrowth.service.user.AuthService;
import com.opinio.plantrowth.service.user.FindPasswordService;
import com.opinio.plantrowth.service.user.UserPointService;
import com.opinio.plantrowth.service.user.UserService;

import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.DisplayName;
import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.autoconfigure.web.servlet.WebMvcTest;
import org.springframework.boot.test.mock.mockito.MockBean;
import org.springframework.http.MediaType;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.security.test.context.support.WithMockUser;
import org.springframework.test.web.servlet.MockMvc;

import java.time.LocalDate;
import java.time.LocalDateTime;
import java.util.ArrayList;
import java.util.List;

import static org.assertj.core.api.AssertionsForClassTypes.assertThat;
import static org.mockito.ArgumentMatchers.any;
import static org.mockito.ArgumentMatchers.eq;
import static org.mockito.BDDMockito.given;
import static org.mockito.Mockito.doReturn;
import static org.mockito.Mockito.when;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.*;
import static org.springframework.test.web.servlet.result.MockMvcResultHandlers.print;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.*;

@WebMvcTest
class BoardApiControllerTest {

    @Autowired
    private MockMvc mockMvc;
    @MockBean
    private PlantService plantService;
    @MockBean
    private UserService userService;
    @MockBean
    private UserRepository userRepository;
    @MockBean
    private FileUploadService fileUploadService;
    @MockBean
    private PasswordEncoder passwordEncoder;
    @MockBean
    private JwtTokenProvider jwtTokenProvider;
    @MockBean
    private FCMService fcmService;
    @MockBean
    private DiaryService diaryService;
    @MockBean
    private UserPointService userPointService;
    @MockBean
    private WateringService wateringService;
    @MockBean
    private PlantExpService plantExpService;
    @MockBean
    private EmailService emailService;
    @MockBean
    private BillingService billingService;
    @MockBean
    private BoardService boardService;
    @MockBean
    private AuthService authService;
    @MockBean
    private CommentService commentService;
    @MockBean
    private ReportService reportService;
    @MockBean
    private FindPasswordService findPasswordService;
    @MockBean
    private DiagnosisRecordService diagnosisRecordService;
    @MockBean
    private PointRecordService pointRecordService;

    private User user1;
    private User user2;
    private Plant plant;
    private Plant plant2;
    private Board board1;
    private Board board2;
    private Board board3;

    @BeforeEach
    public void setUpTest() {
        user1 = User.builder()
                .email("fff")
                .name("east")
                .password("orort")
                .build();
        user2 = User.builder()
                .email("noPlant")
                .name("test2")
                .password("test2pw")
                .build();

        plant = Plant.builder()
                .plantSpecies("장미")
                .plantName("토리이")
                .plantBirth(LocalDate.now())
                .alarmCycle(2)
                .waterSupply(3)
                .plantExp(0)
                .plantLevel(3)
                .fileName("ffff")
                .recentWatering(LocalDate.now().minusDays(1))
                .user(user1)
                .build();

        plant2 = Plant.builder()
                .plantSpecies("가시")
                .plantName("토이이이")
                .plantBirth(LocalDate.now())
                .alarmCycle(5)
                .waterSupply(1)
                .plantExp(0)
                .plantLevel(5)
                .user(user1)
                .build();
        board1 = Board.builder()
                .title("title")
                .content("content")
                .createDate(LocalDateTime.now())
                .user(user1)
                .build();
        board2 = Board.builder()
                .title("title")
                .content("content")
                .createDate(LocalDateTime.now())
                .user(user2)
                .build();
    }
    @Test
    @WithMockUser
    public void authenticatedUser() {
        JoinDTO dto = new JoinDTO(user1);
        assertThat(authService.join(dto)).isNotNull();
    }

    @Test
    @DisplayName("게시글 생성")
    void createBoard() throws Exception {
        //given
        BoardCreateRequest requestDto = new BoardCreateRequest("test", "test", false);
        board3 = Board.builder()
                .title(requestDto.getTitle())
                .content(requestDto.getContent())
                .createDate(LocalDateTime.now())
                .build();
        when(boardService.createBoard(board3)).thenReturn(board3.getId());
        //when
        when(boardService.createBoard(any())).thenReturn(1L);
        ObjectMapper objectMapper = new ObjectMapper();
        String json = objectMapper.registerModule(new JavaTimeModule()).writeValueAsString(requestDto);
//        MockMultipartFile dataFile = new MockMultipartFile("data", "", "application/json", json.getBytes(StandardCharsets.UTF_8));
        //then

        mockMvc.perform(multipart("/api/community/{user-id}", 1L)
//                .file(dataFile))
//                .content(new ObjectMapper().registerModule(new JavaTimeModule()).writeValueAsString(requestDto)))
                        .param("content", requestDto.getContent())
                        .param("title", requestDto.getTitle())
                        .param("file_delete", requestDto.getFile_delete().toString()))
                .andExpect(status().isOk());
    }

    @Test
    @DisplayName("게시판 조회 테스트")
    public void boardList() throws Exception{
        //given
        List<Board> boards = new ArrayList<>();
        boards.add(board1);
        boards.add(board2);
        //when
        when(boardService.findBoard(1L)).thenReturn(board1);
        //then
        mockMvc.perform(get("/api/plants/profiles/{user-id}", 1L))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.data.length()").value(2))
                .andExpect(jsonPath("$.data[0].title").value(board1.getTitle()))
                .andExpect(jsonPath("$.data[1].title").value(board2.getTitle()))
                .andDo(print());
    }

    @Test
    public void lookUpBoard() throws Exception{
        //given
        board1.setId(1L);
        //when
        when(boardService.findBoard(any())).thenReturn(board1);
        //then

        mockMvc.perform(get("/api/community/{board-id}", 1L))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.title").value(board1.getTitle()))
                .andExpect(jsonPath("$.content").value(board1.getContent()))
                .andExpect(jsonPath("$.writer").value(board1.getUser().getName()))
                .andExpect(jsonPath("$.userId").value(board1.getUser().getId()))
                .andExpect(jsonPath("$.file_name").value(plant.getFileName()))
                .andDo(print());

    }

    @Test
    public void updatePlant() throws Exception{
        //given
        board1.setId(1L);
//        //when
        BoardCreateRequest requestDto = new BoardCreateRequest("가시", "토로리", false);

        board1.setContent(requestDto.getContent());
        board1.setTitle(requestDto.getTitle());

        when(plantService.findOnePlant(any())).thenReturn(plant);

        //then
        mockMvc.perform(put("/api/community/{plant-id}", plant.getId())
                        .contentType(MediaType.APPLICATION_JSON)
                        .accept(MediaType.APPLICATION_JSON)
                        .content(new ObjectMapper().registerModule(new JavaTimeModule()).writeValueAsString(requestDto)))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.plant_name").value(requestDto.getContent()))
                .andExpect(jsonPath("$.plant_species").value(requestDto.getTitle()))
                .andDo(print());
    }

    @Test
    public void deletePlant() throws Exception{
        //given

        //when
//        Mockito.when(plantService.delete(1L)).thenReturn(1L);
        //then
        mockMvc.perform(delete("/api/plants/profiles/{plant-id}", 1L))
                .andExpect(status().isOk());
    }


}