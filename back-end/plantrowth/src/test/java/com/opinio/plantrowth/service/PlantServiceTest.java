package com.opinio.plantrowth.service;

import com.opinio.plantrowth.api.dto.CreatePlantRequestDto;
import com.opinio.plantrowth.domain.Plant;
import com.opinio.plantrowth.repository.PlantRepository;
import org.junit.jupiter.api.DisplayName;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.junit.jupiter.MockitoExtension;
import org.springframework.test.context.junit4.SpringRunner;

import java.time.LocalDate;

import static org.junit.jupiter.api.Assertions.*;
import static org.mockito.ArgumentMatchers.any;
import static org.mockito.Mockito.when;

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
        Plant plant = new Plant();
        plant.setPlantSpecies("장미");
        plant.setPlantName("토로리");
        plant.setPlantBirth(LocalDate.now());
        plant.setPlantExp(0);
        plant.setWaterSupply(10);
        plant.setAlarmCycle(2);

        when(plantRepository.save(any())).thenReturn(plant.getId());

        //when
        plantService.join(plant);

        //then
    }
}