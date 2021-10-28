package com.opinio.plantrowth.api;

import com.fasterxml.jackson.databind.ObjectMapper;
import com.fasterxml.jackson.datatype.jsr310.JavaTimeModule;
import com.opinio.plantrowth.api.dto.CreatePlantRequestDto;
import com.opinio.plantrowth.api.dto.CreatePlantResponseDto;
import com.opinio.plantrowth.service.PlantService;
import org.junit.jupiter.api.DisplayName;
import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.autoconfigure.web.servlet.WebMvcTest;
import org.springframework.boot.test.mock.mockito.MockBean;
import org.springframework.http.MediaType;
import org.springframework.test.web.servlet.MockMvc;

import java.time.LocalDate;

import static org.junit.jupiter.api.Assertions.*;
import static org.mockito.ArgumentMatchers.any;
import static org.mockito.Mockito.when;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.post;
import static org.springframework.test.web.servlet.result.MockMvcResultHandlers.print;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.content;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.status;

@WebMvcTest
class PlantApiControllerTest {

    @Autowired
    private MockMvc mockMvc;

    @MockBean
    private PlantService plantService;

    @Test
    @DisplayName("식물 등록 확인")
    void createPlant() throws Exception {
        //given
        CreatePlantRequestDto requestDto = new CreatePlantRequestDto("장미", "토로리",
                LocalDate.now(), 0,
                null, 10, 2);

        //when
        when(plantService.join(any())).thenReturn(1000L);
        //then
        mockMvc.perform(post("/api/plants/profiles")
                .contentType(MediaType.APPLICATION_JSON)
                .content(new ObjectMapper().registerModule(new JavaTimeModule()).writeValueAsString(requestDto)))
                .andExpect(status().isOk())
                .andExpect(content().string("{\"id\":1000}"))
                .andDo(print());
    }

    @Test
    @DisplayName("식물 목록 테스트")
    public void findPlants() throws Exception{
        //given
//        CreatePlantResponseDto responseDto =
        //when

        //then
    }
}