package com.opinio.plantrowth.service;

import com.opinio.plantrowth.domain.plant.Plant;
import com.opinio.plantrowth.domain.User;
import com.opinio.plantrowth.repository.plant.PlantRepository;
import com.opinio.plantrowth.service.plant.WateringService;
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

import static org.mockito.ArgumentMatchers.any;

@ExtendWith(MockitoExtension.class)
class WateringServiceTest {

    @Mock
    private PlantRepository plantRepository;

    @InjectMocks
    private WateringService wateringService;

    private Plant plant;
    private Plant plant2;
    private User user;
    @BeforeEach
    public void setUpTest() {
        user = User.builder()
                .email("fff")
                .Nickname("east")
                .password("orort")
                .build();

        plant = Plant.builder()
                .plantSpecies("장미")
                .plantName("토리이")
                .plantBirth(LocalDate.now())
                .alarmCycle(2)
                .waterSupply(3)
                .plantExp(0)
                .remainCycle(0)
                .recentWatering(LocalDate.now().minusDays(2))
                .build();
    }
    @Test
    @DisplayName("워터링 기능 정상 작동 확인")
    public void watering() throws Exception{
        //given
        plant.setId(1L);
        //when
        Mockito.when(plantRepository.findById(any())).thenReturn(Optional.of(plant));
        wateringService.watering(1L);
        //then
        Assertions.assertThat(plant.getRemainCycle()).isEqualTo(plant.getAlarmCycle());
        Assertions.assertThat(plant.getRecentWatering()).isEqualTo(LocalDate.now());
    }

}