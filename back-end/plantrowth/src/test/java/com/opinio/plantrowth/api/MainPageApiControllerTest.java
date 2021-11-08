package com.opinio.plantrowth.api;

import com.opinio.plantrowth.domain.Plant;
import com.opinio.plantrowth.domain.User;
import com.opinio.plantrowth.service.PlantService;
import com.opinio.plantrowth.service.UserService;
import com.opinio.plantrowth.service.fileUpload.FileUploadService;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.mockito.Mockito;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.autoconfigure.web.servlet.WebMvcTest;
import org.springframework.boot.test.mock.mockito.MockBean;
import org.springframework.test.web.servlet.MockMvc;
import org.springframework.test.web.servlet.request.MockMvcRequestBuilders;
import org.springframework.test.web.servlet.result.MockMvcResultMatchers;

import java.time.LocalDate;
import java.util.ArrayList;
import java.util.List;

import static org.junit.jupiter.api.Assertions.*;
import static org.mockito.ArgumentMatchers.any;
import static org.mockito.Mockito.*;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.*;
import static org.springframework.test.web.servlet.result.MockMvcResultHandlers.print;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.*;

@WebMvcTest
class MainPageApiControllerTest {

    @Autowired
    private MockMvc mockMvc;
    @MockBean
    private PlantService plantService;
    @MockBean
    private UserService userService;
    @MockBean
    private FileUploadService fileUploadService;

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
    public void getMainPage() throws Exception{
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
                .andExpect(jsonPath("$.data.length()").value(3))
                .andExpect(jsonPath("$.data.plants.length()").value(2))
                .andExpect(jsonPath("$.data.plants[0].plantName").value(plant.getPlantName()))
                .andExpect(jsonPath("$.data.plants[1].plantName").value(plant2.getPlantName()))
                .andDo(print());
    }
}