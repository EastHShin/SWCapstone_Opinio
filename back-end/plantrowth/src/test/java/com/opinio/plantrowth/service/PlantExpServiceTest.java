package com.opinio.plantrowth.service;

import com.opinio.plantrowth.domain.Plant;
import com.opinio.plantrowth.domain.User;
import com.opinio.plantrowth.repository.PlantRepository;
import org.assertj.core.api.Assertions;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.DisplayName;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.Mockito;
import org.mockito.junit.jupiter.MockitoExtension;

import java.time.LocalDate;
import java.util.Optional;

import static org.junit.jupiter.api.Assertions.*;
import static org.mockito.ArgumentMatchers.any;
import static org.mockito.Mockito.*;

@ExtendWith(MockitoExtension.class)
class PlantExpServiceTest {
    @Mock
    private PlantRepository plantRepository;

    @InjectMocks
    private PlantExpService plantExpService;

    private final Integer increasingExp = 10;
    private final Integer initialMaxExp = 30;

    User user;
    Plant plant;
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
                .plantBirth(LocalDate.now().minusDays(5))
                .alarmCycle(2)
                .waterSupply(3)
                .plantExp(0)
                .remainCycle(0)
                .recentWatering(LocalDate.now().minusDays(2))
                .build();
    }

    @Test
    @DisplayName("경험치를 얻어도 레벨업을 하지 않는 경우")
    public void increaseExp() throws Exception{
        //given
        plant.setId(1L);
        Integer plantLevel = 1;
        plant.setPlantLevel(plantLevel);
        Integer curExp = plant.getPlantExp();
        //when
//        plantRepository.findById(plant_id).orElseThrow(IllegalAccessError::new);
        when(plantRepository.findById(any())).thenReturn(Optional.of(plant));
        plantExpService.increaseExp(plant.getId());
        //then
        Assertions.assertThat(plant.getPlantExp()).isEqualTo(curExp + increasingExp);
        Assertions.assertThat(plant.getPlantLevel()).isEqualTo(plantLevel);
    }

    @Test
    @DisplayName("레벨업을 하는 경우")
    public void levelup() throws Exception{
        //given
        plant.setId(1L);
        plant.setPlantExp(20);
        Integer plantLevel = 1;
        plant.setPlantLevel(plantLevel);
        //when
        when(plantRepository.findById(any())).thenReturn(Optional.of(plant));
        plantExpService.increaseExp(plant.getId());
        //then
        Assertions.assertThat(plant.getPlantExp()).isEqualTo(0);
        Assertions.assertThat(plant.getPlantLevel()).isEqualTo(plantLevel + 1);
    }

}
