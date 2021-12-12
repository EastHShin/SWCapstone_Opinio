package com.opinio.plantrowth.api;

import com.opinio.plantrowth.api.controller.MainPageApiController;
import com.opinio.plantrowth.config.WebSecurityConfig;
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
import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.autoconfigure.web.servlet.WebMvcTest;
import org.springframework.boot.test.mock.mockito.MockBean;
import org.springframework.context.annotation.Import;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.test.web.servlet.MockMvc;

import java.time.LocalDate;
import java.util.ArrayList;
import java.util.List;

import static org.mockito.ArgumentMatchers.any;
import static org.mockito.Mockito.*;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.*;
import static org.springframework.test.web.servlet.result.MockMvcResultHandlers.print;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.*;

@WebMvcTest
@Import(WebSecurityConfig.class)
class MainPageApiControllerTest {

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

	private User user;
	private Plant plant;
	private Plant plant2;

	@BeforeEach
	public void setUpTest() {
		user = User.builder()
			.email("fff")
			.name("east")
			.password("orort")
			.build();

		plant = Plant.builder()
			.plantSpecies("장미")
			.plantName("토리이")
			.plantBirth(LocalDate.now())
			.plantLevel(1)
			.alarmCycle(2)
			.waterSupply(3)
			.plantExp(0)
			.user(user)
			.build();

		plant2 = Plant.builder()
			.plantSpecies("가시")
			.plantName("토이이이")
			.plantBirth(LocalDate.now())
			.plantLevel(1)
			.alarmCycle(5)
			.waterSupply(1)
			.plantExp(0)
			.user(user)
			.build();

	}

	@Test
	public void getMainPage() throws Exception {
		//given
		List<Plant> plants = new ArrayList<>();
		plants.add(plant);
		plants.add(plant2);
		//when
		when(userService.findUser(any())).thenReturn(user);
		when(plantService.findPlants(any())).thenReturn(plants);

		//then
		mockMvc.perform(get("/api/main/{user-id}", 1L))
			.andExpect(status().isOk())
			.andExpect(
				jsonPath("$.data.length()").value(MainPageApiController.MainPageDto.class.getDeclaredFields().length))
			.andExpect(jsonPath("$.data.plants.length()").value(2))
			.andExpect(jsonPath("$.data.plants[0].plant_name").value(plant.getPlantName()))
			.andExpect(jsonPath("$.data.plants[1].plant_name").value(plant2.getPlantName()))
			.andDo(print());
	}
}