package com.opinio.plantrowth.api;

import com.fasterxml.jackson.databind.ObjectMapper;
import com.fasterxml.jackson.datatype.jsr310.JavaTimeModule;
import com.opinio.plantrowth.api.dto.auth.JoinDTO;
import com.opinio.plantrowth.api.dto.auth.checkPasswordDTO;
import com.opinio.plantrowth.api.dto.plant.CreatePlantRequestDto;
import com.opinio.plantrowth.api.dto.user.UserLookUpDTO;
import com.opinio.plantrowth.api.dto.user.UserUpdateDTO;
import com.opinio.plantrowth.api.dto.user.addPlantDTO;
import com.opinio.plantrowth.config.security.JwtTokenProvider;
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
public class UserApiControllerTest {
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
    @BeforeEach
    public void setUpTest() {
        user1 = User.builder()
                .email("test@ajou.ac.kr")
                .name("test")
                .password("testPw")
                .plantNum(1)
                .maxPlantNum(3)
                .point(30)
                .build();
        user2 = User.builder()
                .email("testEmail@ajou.ac.kr")
                .name("test2")
                .password("testPw")
                .plantNum(3)
                .maxPlantNum(3)
                .point(50)
                .build();
    }

    @Test
    @DisplayName("유저 정보 확인")
    void userLookUp() throws Exception{
        given(userService.findUser(any())).willReturn(user1);
        UserLookUpDTO userLookUpDTO = userService.lookup(user1.getId());
        when(userService.lookup(any())).thenReturn(userLookUpDTO);
    }
    @Test
    @DisplayName("유저 정보 변경")
    public void updateUser() throws Exception{
        user1.setId(1L);
        UserUpdateDTO userUpdateDTO = new UserUpdateDTO("change", "changedPw", LocalDate.now());
        user1.setBirth(userUpdateDTO.getUser_birth());
        user1.setName(userUpdateDTO.getUser_name());
        userService.setNewPassword(user1.getId(), userUpdateDTO.getPassword());
        when(userService.updateUser(any(), eq(userUpdateDTO))).thenReturn(userUpdateDTO);
        when(userService.findUser(any())).thenReturn(user1);
    }

    @Test
    @DisplayName("유저 정보 삭제")
    @WithMockUser
    public void deleteUser() throws Exception{
        user1.setId(1L);
        Long id = authService.join(new JoinDTO(user1));
        checkPasswordDTO dto = new checkPasswordDTO("testPw");

        when(authService.checkPassword(user1.getId(),dto)).thenReturn(true);
        mockMvc.perform(delete("/api/user/{user-id}", id)
                        .contentType(MediaType.APPLICATION_JSON)
                        .accept(MediaType.APPLICATION_JSON)
                        .content(new ObjectMapper().registerModule(new JavaTimeModule()).writeValueAsString(dto)))
                .andExpect(status().isOk())
                .andDo(print());
    }

    @Test
    @DisplayName("식물 프로필 추가")
    public void addPlant() throws Exception{
        addPlantDTO plantDTO = new addPlantDTO(user1.getMaxPlantNum(), user1.getPoint());
        when(userService.addPlant(any())).thenReturn(plantDTO);
    }
}
