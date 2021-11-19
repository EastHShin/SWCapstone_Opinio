package com.opinio.plantrowth.service;

import com.opinio.plantrowth.api.dto.plant.CreatePlantRequestDto;
import com.opinio.plantrowth.domain.plant.Plant;
import com.opinio.plantrowth.domain.User;
import com.opinio.plantrowth.repository.plant.PlantRepository;
import com.opinio.plantrowth.repository.user.UserRepository;
import com.opinio.plantrowth.service.plant.PlantService;
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
import java.util.ArrayList;
import java.util.List;
import java.util.Optional;

import static org.mockito.ArgumentMatchers.any;
import static org.mockito.BDDMockito.given;
import static org.mockito.Mockito.when;

@ExtendWith(MockitoExtension.class)
class PlantServiceTest {
    @Mock
    private PlantRepository plantRepository;
    @Mock
    private UserRepository userRepository;

    @InjectMocks
    private PlantService plantService;

    private User user;
    private Plant plant;
    private Plant plant2;

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
                .build();

        plant2 = Plant.builder()
                .plantSpecies("가시")
                .plantName("토이이이")
                .plantBirth(LocalDate.now())
                .alarmCycle(5)
                .waterSupply(1)
                .plantExp(0)
                .build();

    }

    @Test
    @DisplayName("join 기능 테스트")
    public void join() throws Exception{
        //given
//        User user = new User();
//        user.setEmail("xlddd@gmail.com");
//        user.setPassword("fffff");
//        user.setId(1L);
//        Plant plant = getPlant(user, "장미", "토로리",
//                LocalDate.now(), 0, 3, 2);

        when(plantRepository.save(any())).thenReturn(plant);

        //when
        Long id = plantService.join(plant);
        //then
        Assertions.assertThat(plant.getId()).isEqualTo(id);
    }

    @Test
    @DisplayName("식물 목록 테스트")
    public void plantList() throws Exception{
        //given
        List<Plant> plants = new ArrayList<>();
        plants.add(plant);
        plants.add(plant2);
        given(plantRepository.findAllByUserId(any())).willReturn(plants);
        //when
        List<Plant> findPlants = plantService.findPlants(user.getId());
        //then
        Assertions.assertThat(findPlants.size()).isEqualTo(2);
        Assertions.assertThat(findPlants.get(0)).isSameAs(plant);
        Assertions.assertThat(findPlants.get(1)).isSameAs(plant2);
    }

    @Test
    public void updatePlant() throws Exception{
        //given

        //when
        CreatePlantRequestDto requestDto = new CreatePlantRequestDto("가시", "토로리",
                LocalDate.now(), 5, 3, LocalDate.now());
        when(plantRepository.findById(any())).thenReturn(Optional.of(plant));
        plantService.update(plant.getId(), requestDto);

        //then
        Assertions.assertThat(plant.getPlantSpecies()).isEqualTo("가시");
        Assertions.assertThat(plant.getWaterSupply()).isEqualTo(5);
        Assertions.assertThat(plant.getAlarmCycle()).isEqualTo(3);
    }

    @Test
    public void deletePlant() throws Exception{
        //given

        //when
        when(plantRepository.findById(any())).thenReturn(Optional.of(plant));
        plantService.delete(1L);
        //then
        Mockito.verify(plantRepository).delete(plant);
    }


}