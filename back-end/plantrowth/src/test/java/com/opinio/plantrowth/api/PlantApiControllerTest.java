package com.opinio.plantrowth.api;

import com.fasterxml.jackson.databind.ObjectMapper;
import com.fasterxml.jackson.datatype.jsr310.JavaTimeModule;
import com.opinio.plantrowth.api.dto.CreatePlantRequestDto;
import com.opinio.plantrowth.api.dto.CreatePlantResponseDto;
import com.opinio.plantrowth.domain.Plant;
import com.opinio.plantrowth.domain.User;
import com.opinio.plantrowth.service.PlantService;
import com.opinio.plantrowth.service.UserService;
import com.opinio.plantrowth.service.fileUpload.FileUploadService;
import org.junit.jupiter.api.DisplayName;
import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.autoconfigure.web.servlet.WebMvcTest;
import org.springframework.boot.test.json.GsonTester;
import org.springframework.boot.test.mock.mockito.MockBean;
import org.springframework.http.MediaType;
import org.springframework.test.web.servlet.MockMvc;

import java.nio.charset.StandardCharsets;
import java.time.LocalDate;
import java.util.ArrayList;
import java.util.List;

import static org.junit.jupiter.api.Assertions.*;
import static org.mockito.ArgumentMatchers.any;
import static org.mockito.BDDMockito.given;
import static org.mockito.Mockito.when;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.get;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.post;
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


    @Test
    @DisplayName("식물 등록 확인")
    void createPlant() throws Exception {
        //given
        User user = new User();
        user.setEmail("fff@nafa");
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
        User user = new User();
        user.setEmail("Ffff@fadf");
        user.setId(1L);
        Plant plant = getPlant(user, "장미", "fff",
                LocalDate.now(), 0, 3, 2);
        Plant plant2 = getPlant(user, "가시", "토리이",
                LocalDate.now(), 0, 3, 2);
        List<Plant> plants = new ArrayList<>();
        plants.add(plant);
        plants.add(plant2);
        //when
        when(plantService.findPlants(1L)).thenReturn(plants);
        //then
        mockMvc.perform(get("/api/plants/profiles/{user-id}", 1L))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.data.length()").value(2))
                .andExpect(jsonPath("$.data[0].plantName").value("fff"))
                .andExpect(jsonPath("$.data[1].plantName").value("토리이"))
                .andDo(print());

    }

    private Plant getPlant(User user, String species, String name,
                           LocalDate birth, int exp, int supply,
                           int cycle) {
        Plant plant = new Plant();
        plant.setUser(user);
        plant.setPlantSpecies(species);
        plant.setPlantName(name);
        plant.setPlantBirth(birth);
        plant.setPlantExp(exp);
        plant.setWaterSupply(supply);
        plant.setAlarmCycle(cycle);
        return plant;
    }
}