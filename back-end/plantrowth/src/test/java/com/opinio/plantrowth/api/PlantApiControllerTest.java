package com.opinio.plantrowth.api;

import com.fasterxml.jackson.databind.ObjectMapper;
import com.fasterxml.jackson.datatype.jsr310.JavaTimeModule;
import com.opinio.plantrowth.api.dto.plant.CreatePlantRequestDto;
import com.opinio.plantrowth.config.security.JwtTokenProvider;
import com.opinio.plantrowth.domain.Plant;
import com.opinio.plantrowth.domain.User;
import com.opinio.plantrowth.repository.PlantRepository;
import com.opinio.plantrowth.repository.UserRepository;
import com.opinio.plantrowth.service.DiaryService;
import com.opinio.plantrowth.service.FirebaseAlarm.FCMService;
import com.opinio.plantrowth.service.PlantService;
import com.opinio.plantrowth.service.UserService;
import com.opinio.plantrowth.service.fileUpload.FileUploadService;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.DisplayName;
import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.autoconfigure.web.servlet.WebMvcTest;
import org.springframework.boot.test.mock.mockito.MockBean;
import org.springframework.http.MediaType;
import org.springframework.mock.web.MockMultipartFile;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.test.web.servlet.MockMvc;

import java.nio.charset.StandardCharsets;
import java.time.LocalDate;
import java.util.ArrayList;
import java.util.List;

import static org.mockito.ArgumentMatchers.any;
import static org.mockito.ArgumentMatchers.eq;
import static org.mockito.BDDMockito.given;
import static org.mockito.Mockito.doReturn;
import static org.mockito.Mockito.when;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.*;
import static org.springframework.test.web.servlet.result.MockMvcResultHandlers.print;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.*;

@WebMvcTest
class PlantApiControllerTest {

    @Autowired
    private MockMvc mockMvc;

    @MockBean
    private PlantService plantService;
    @MockBean
    private UserService userService;
    @MockBean
    private FileUploadService fileUploadService;
    @MockBean
    private PasswordEncoder passwordEncoder;
    @MockBean
    private JwtTokenProvider jwtTokenProvider;

    @MockBean
    private PlantRepository plantRepository;
    @MockBean
    private UserRepository userRepository;

    @MockBean
    private FCMService fcmService;
    @MockBean
    private DiaryService diaryService;

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
                .alarmCycle(2)
                .waterSupply(3)
                .plantExp(0)
                .user(user)
                .build();

        plant2 = Plant.builder()
                .plantSpecies("가시")
                .plantName("토이이이")
                .plantBirth(LocalDate.now())
                .alarmCycle(5)
                .waterSupply(1)
                .plantExp(0)
                .user(user)
                .build();

    }


    @Test
    @DisplayName("식물 등록 확인")
    void createPlant() throws Exception {
        //given
        CreatePlantRequestDto requestDto = new CreatePlantRequestDto("장미", "토로리",
                LocalDate.now(), 10, 2, LocalDate.now());
        given(userService.findUser(1L)).willReturn(user);
        String json = "{\"plant_species\":\"가시\",\"plant_name\":\"토로리\",\"plant_birth\":[2021,11,9],\"plant_exp\":5,\"water_supply\":5,\"alarm_cycle\":3}";
        //when
        when(plantService.join(any())).thenReturn(1L);
        MockMultipartFile dataFile = new MockMultipartFile("data", "", "application/json", json.getBytes(StandardCharsets.UTF_8));
        //then
//        mockMvc.perform(post("/api/plants/profiles/{user-id}", 1L)
//                .contentType(MediaType.MULTIPART_FORM_DATA)
//                .content(new ObjectMapper().registerModule(new JavaTimeModule()).writeValueAsString(requestDto)))
//                .andExpect(status().isOk())
//                .andExpect(content().string("{\"id\":1}"))
//                .andDo(print());
//
        mockMvc.perform(multipart("/api/plants/profiles/{user-id}", 1L)
                .file(dataFile))
                .andExpect(status().isOk())
                .andExpect(content().string("{\"id\":1}"));
    }

    @Test
    @DisplayName("식물 목록 조회 테스트")
    public void findPlants() throws Exception{
        //given
        List<Plant> plants = new ArrayList<>();
        plants.add(plant);
        plants.add(plant2);
        //when
        when(plantService.findPlants(1L)).thenReturn(plants);
        //then
        mockMvc.perform(get("/api/plants/profiles/{user-id}", 1L))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.data.length()").value(2))
                .andExpect(jsonPath("$.data[0].plantName").value(plant.getPlantName()))
                .andExpect(jsonPath("$.data[1].plantName").value(plant2.getPlantName()))
                .andDo(print());
    }

    @Test
    public void updatePlant() throws Exception{
        //given
        plant.setId(1L);
//        //when
        CreatePlantRequestDto requestDto = new CreatePlantRequestDto("가시", "토로리",
                LocalDate.now(),  5, 3, LocalDate.now());
        plant.setPlantSpecies(requestDto.getPlant_species());
        plant.setPlantName(requestDto.getPlant_name());
        plant.setPlantBirth(requestDto.getPlant_birth());
        plant.setWaterSupply(requestDto.getWater_supply());
        plant.setAlarmCycle(requestDto.getAlarm_cycle());

        when(plantService.update(any(), eq(requestDto))).thenReturn(1L);
        when(plantService.findOnePlant(any())).thenReturn(plant);

        //then
        mockMvc.perform(put("/api/plants/profiles/{plant-id}", plant.getId())
                .contentType(MediaType.APPLICATION_JSON)
                .accept(MediaType.APPLICATION_JSON)
                .content(new ObjectMapper().registerModule(new JavaTimeModule()).writeValueAsString(requestDto)))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.plant_name").value(requestDto.getPlant_name()))
                .andExpect(jsonPath("$.plant_species").value(requestDto.getPlant_species()))
                .andExpect(jsonPath("$.water_supply").value(requestDto.getWater_supply()))
                .andExpect(jsonPath("$.alarm_cycle").value(requestDto.getAlarm_cycle()))
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