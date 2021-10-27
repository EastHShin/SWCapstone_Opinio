package com.opinio.plantrowth.service;

import com.opinio.plantrowth.repository.PlantRepository;
import org.junit.jupiter.api.DisplayName;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.junit.jupiter.MockitoExtension;
import org.springframework.test.context.junit4.SpringRunner;

import static org.junit.jupiter.api.Assertions.*;

@ExtendWith(MockitoExtension.class)
class PlantServiceTest {
    @Mock
    private PlantRepository plantRepository;

    @InjectMocks
    private PlantService plantService;

    @Test
    @DisplayName("join 기능 테스트")
    public void join() throws Exception{
        //given

        //when

        //then
    }
}