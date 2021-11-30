package com.opinio.plantrowth.api;

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
import org.mockito.Mock;
import org.mockito.Mockito;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.autoconfigure.web.servlet.WebMvcTest;
import org.springframework.boot.test.mock.mockito.MockBean;
import org.springframework.http.MediaType;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.test.web.servlet.MockMvc;

import java.time.LocalDate;

import static org.mockito.ArgumentMatchers.any;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.*;
import static org.springframework.test.web.servlet.result.MockMvcResultHandlers.print;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.*;

@WebMvcTest
class WateringApiControllerTest {

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

    private User user;
    private Plant plant;

    @BeforeEach
    public void setUpTest() {
        user = User.builder()
                .email("fff")
                .name("east")
                .password("orort")
                .point(0)
                .build();

        plant = Plant.builder()
                .plantSpecies("장미")
                .plantName("토리이")
                .plantBirth(LocalDate.now())
                .alarmCycle(2)
                .waterSupply(3)
                .plantExp(0)
                .plantLevel(1)
                .remainCycle(2)
                .fileName("ffff")
                .user(user)
                .build();
    }

    @Test
    @DisplayName("워터링 컨트롤러 정상 동작 테스트")
    public void wateringTest() throws Exception {
        //given
        plant.setId(1L);
        User updatedUser = User.builder()
                .id(1L)
                .email("fff")
                .name("east")
                .password("orort")
                .point(10)
                .build();
        //when
//            User user = userPointService.updatePoint(plant.getUser().getId());
        Mockito.when(plantService.findOnePlant(any())).thenReturn(plant);
        Mockito.when(userPointService.increasePoint(any())).thenReturn(updatedUser);
        //then
        mockMvc.perform(post("/api/plants/watering/{plant-id}", 1L)
                .accept(MediaType.APPLICATION_JSON))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.user_id").value(updatedUser.getId()))
                .andExpect(jsonPath("$.point").value(updatedUser.getPoint()))
                .andExpect(jsonPath("$.plant_id").value(plant.getId()))
                .andExpect(jsonPath("$.plant_name").value(plant.getPlantName()))
                .andDo(print());

    }
}