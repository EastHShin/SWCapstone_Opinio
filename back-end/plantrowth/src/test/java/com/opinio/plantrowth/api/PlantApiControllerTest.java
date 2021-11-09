package com.opinio.plantrowth.api;

import com.fasterxml.jackson.databind.ObjectMapper;
import com.fasterxml.jackson.datatype.jsr310.JavaTimeModule;
import com.opinio.plantrowth.api.dto.CreatePlantRequestDto;
import com.opinio.plantrowth.api.dto.CreatePlantResponseDto;
import com.opinio.plantrowth.config.security.JwtTokenProvider;
import com.opinio.plantrowth.domain.Plant;
import com.opinio.plantrowth.domain.User;
import com.opinio.plantrowth.repository.PlantRepository;
import com.opinio.plantrowth.repository.UserRepository;
import com.opinio.plantrowth.service.PlantService;
import com.opinio.plantrowth.service.UserService;
import com.opinio.plantrowth.service.fileUpload.FileUploadService;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.DisplayName;
import org.junit.jupiter.api.Test;
import org.mockito.Mock;
import org.mockito.Mockito;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.autoconfigure.web.servlet.WebMvcTest;
import org.springframework.boot.test.json.GsonTester;
import org.springframework.boot.test.mock.mockito.MockBean;
import org.springframework.http.MediaType;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.test.web.servlet.MockMvc;
import org.springframework.test.web.servlet.result.MockMvcResultMatchers;

import java.nio.charset.StandardCharsets;
import java.time.LocalDate;
import java.util.ArrayList;
import java.util.List;
import java.util.Optional;

import static org.junit.jupiter.api.Assertions.*;
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
                LocalDate.now(), 0,
                null, 10, 2);
        given(userService.findUser(1L)).willReturn(user);

        //when
        when(plantService.join(any())).thenReturn(1L);
        //then
        mockMvc.perform(post("/api/plants/profiles/{user-id}", 1L)
                .contentType(MediaType.APPLICATION_JSON)
                .content(new ObjectMapper().registerModule(new JavaTimeModule()).writeValueAsString(requestDto)))
                .andExpect(status().isOk())
                .andExpect(content().string("{\"id\":1}"))
                .andDo(print());
//
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
                LocalDate.now(), 5,null, 5, 3);
//        Plant updatedPlant = getPlant(user, "가시", "토로리", LocalDate.now(),5, 5, 3);
//        updatedPlant.setId(1L);
//        plantRepository.findById(id).orElseThrow(IllegalAccessError::new);
//        when(plantRepository.save(any())).thenReturn(plant);
//        plantRepository.save(plant);
//        when(plantRepository.findById(any())).thenReturn(Optional.of(plant));
//        when(plantService.update(1L, requestDto)).thenReturn(plant);
//        given(plantService.update(plant.getId(), requestDto)).willReturn(plant);


//        when(plantService.update(any(), eq(requestDto))).thenReturn(plant);
        when(plantService.findOnePlant(any())).thenReturn(plant);

        //then
        mockMvc.perform(put("/api/plants/profiles/{plant-id}", plant.getId())
                .contentType(MediaType.APPLICATION_JSON)
                .accept(MediaType.APPLICATION_JSON)
                .content(new ObjectMapper().registerModule(new JavaTimeModule()).writeValueAsString(requestDto)))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.plant_name").value("토로리"))
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