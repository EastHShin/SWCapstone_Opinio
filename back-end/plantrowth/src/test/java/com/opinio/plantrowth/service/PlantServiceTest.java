package com.opinio.plantrowth.service;

import com.opinio.plantrowth.api.dto.CreatePlantRequestDto;
import com.opinio.plantrowth.domain.Plant;
import com.opinio.plantrowth.domain.User;
import com.opinio.plantrowth.repository.PlantRepository;
import com.opinio.plantrowth.repository.UserRepository;
import org.assertj.core.api.Assertions;
import org.junit.jupiter.api.DisplayName;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.junit.jupiter.MockitoExtension;
import org.springframework.test.context.junit4.SpringRunner;

import java.time.LocalDate;
import java.util.ArrayList;
import java.util.List;

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

    @Test
    @DisplayName("join 기능 테스트")
    public void join() throws Exception{
        //given
        User user = new User();
        user.setEmail("xlddd@gmail.com");
        user.setPassword("fffff");
        user.setId(1L);
        Plant plant = getPlant(user, "장미", "토로리",
                LocalDate.now(), 0, 3, 2);

        when(plantRepository.save(any())).thenReturn(plant.getId());

        //when
        Long id = plantService.join(plant);
        //then
        Assertions.assertThat(plant.getId()).isEqualTo(id);
    }

    @Test
    @DisplayName("식물 목록 테스트")
    public void plantList() throws Exception{
        //given
        User user = new User();
        user.setEmail("xlddd@gmail.com");
        user.setPassword("fffff");
        user.setId(1L);

        Plant plant = getPlant(user, "장미", "토로리",
                LocalDate.now(), 0, 3, 2);
        Plant plant2 = getPlant(user, "가시", "토리이",
                LocalDate.now(), 0, 3, 2);
        List<Plant> plants = new ArrayList<>();
        plants.add(plant);
        plants.add(plant2);
        given(plantRepository.findAllByUserId(1L)).willReturn(plants);
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
        User user = new User();
        user.setEmail("xlddd@gmail.com");
        user.setPassword("fffff");
        user.setId(1L);
        Plant plant = getPlant(user, "장미", "토로리",
                LocalDate.now(), 0, 3, 2);
        //when
        CreatePlantRequestDto requestDto = new CreatePlantRequestDto("가시", "토로리",
                LocalDate.now(), 5,null, 5, 3);
        when(plantRepository.getById(any())).thenReturn(plant);
        plantService.update(plant.getId(), requestDto);

        //then
        Assertions.assertThat(plant.getPlantSpecies()).isEqualTo("가시");
        Assertions.assertThat(plant.getPlantExp()).isEqualTo(5);
        Assertions.assertThat(plant.getWaterSupply()).isEqualTo(5);
        Assertions.assertThat(plant.getAlarmCycle()).isEqualTo(3);
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