package com.opinio.plantrowth.api;

import com.opinio.plantrowth.config.security.JwtTokenProvider;
import com.opinio.plantrowth.repository.UserRepository;
import com.opinio.plantrowth.service.*;
import com.opinio.plantrowth.service.FirebaseAlarm.FCMService;
import com.opinio.plantrowth.service.fileUpload.FileUploadService;
import org.junit.jupiter.api.DisplayName;
import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.autoconfigure.web.servlet.WebMvcTest;
import org.springframework.boot.test.mock.mockito.MockBean;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.test.web.servlet.MockMvc;

import static org.junit.jupiter.api.Assertions.*;

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

    @Test
    @DisplayName("워터링 컨트롤러 정상 동작 테스트")
    public void wateringTest() throws Exception{
        //given

        //when

        //then
    }
}