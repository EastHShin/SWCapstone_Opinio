package com.opinio.plantrowth.api;

import com.opinio.plantrowth.config.security.JwtTokenProvider;
import com.opinio.plantrowth.domain.plant.Plant;
import com.opinio.plantrowth.domain.user.User;
import com.opinio.plantrowth.repository.user.UserRepository;
import com.opinio.plantrowth.service.EmailAuth.EmailService;
import com.opinio.plantrowth.service.FirebaseAlarm.FCMService;
import com.opinio.plantrowth.service.fileUpload.FileUploadService;
import com.opinio.plantrowth.service.plant.DiaryService;
import com.opinio.plantrowth.service.plant.PlantExpService;
import com.opinio.plantrowth.service.plant.PlantService;
import com.opinio.plantrowth.service.plant.WateringService;
import com.opinio.plantrowth.service.user.UserPointService;
import com.opinio.plantrowth.service.user.UserService;

import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.mockito.Mockito;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.autoconfigure.web.servlet.WebMvcTest;
import org.springframework.boot.test.mock.mockito.MockBean;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.test.web.servlet.MockMvc;
import org.springframework.test.web.servlet.request.MockMvcRequestBuilders;
import org.springframework.test.web.servlet.result.MockMvcResultMatchers;

import java.time.LocalDate;

import static org.mockito.ArgumentMatchers.any;
import static org.springframework.test.web.servlet.result.MockMvcResultHandlers.print;

@WebMvcTest
class StoreApiControllerTest {

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

    private User user;
    private Plant plant;
    private Plant plant2;

    @BeforeEach
    public void setUpTest() {
        user = User.builder()
                .email("fff")
                .name("east")
                .password("orort")
                .point(40)
                .build();

        plant = Plant.builder()
                .plantSpecies("장미")
                .plantName("토리이")
                .plantBirth(LocalDate.now())
                .alarmCycle(2)
                .waterSupply(3)
                .plantExp(0)
                .fileName("ffff")
                .recentWatering(LocalDate.now().minusDays(1))
                .user(user)
                .build();
    }

    @Test
    public void getStoreTest() throws Exception{
        //given
        user.setId(1L);
        //when
        Mockito.when(userService.findUser(any())).thenReturn(user);
        //then
        mockMvc.perform(MockMvcRequestBuilders.get("/api/store/{user-id}", 1L))
                .andExpect(MockMvcResultMatchers.status().isOk())
                .andExpect(MockMvcResultMatchers.jsonPath("$.user_id").value(user.getId()))
                .andExpect(MockMvcResultMatchers.jsonPath("$.user_name").value(user.getName()))
                .andExpect(MockMvcResultMatchers.jsonPath("$.point").value(user.getPoint()))
                .andDo(print());
    }


}