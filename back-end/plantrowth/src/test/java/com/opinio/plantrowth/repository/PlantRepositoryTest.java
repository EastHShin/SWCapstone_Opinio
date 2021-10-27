package com.opinio.plantrowth.repository;

import com.opinio.plantrowth.domain.Plant;
import org.assertj.core.api.Assertions;
import org.junit.jupiter.api.DisplayName;
import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.autoconfigure.orm.jpa.DataJpaTest;

import java.time.LocalDate;

import static org.junit.jupiter.api.Assertions.*;

@DataJpaTest
class PlantRepositoryTest {

    @Autowired
    private PlantRepository plantRepository;

    @Test
    @DisplayName("식물이 DB에 저장되는지 확인")
    void savePlant() throws Exception {
        //given
        Plant plant = new Plant();

        plant.setPlantSpecies("장미");
        plant.setPlantName("토로리");
        plant.setPlantBirth(LocalDate.now());
        plant.setPlantExp(0);
        plant.setWaterSupply(10);
        plant.setAlarmCycle(2);

        //when
        Plant savedPlant = plantRepository.save(plant);
        //then
        Assertions.assertThat(plant).isSameAs(savedPlant);
        Assertions.assertThat(plant.getPlantName()).isEqualTo(savedPlant.getPlantName());
        Assertions.assertThat(plant.getPlantBirth()).isEqualTo(savedPlant.getPlantBirth());
    }

    @Test
    @DisplayName("저장된 식물이 조회되는지 확인")
    void findPlant() throws Exception{
        //given
        Plant plant = new Plant();
        plant.setPlantSpecies("장미");
        plant.setPlantName("토로리");
        plant.setPlantBirth(LocalDate.now());
        plant.setPlantExp(0);
        plant.setWaterSupply(10);
        plant.setAlarmCycle(2);
        Plant savedPlant = plantRepository.save(plant);

        Plant plant2 = new Plant();
        plant2.setPlantSpecies("가시");
        plant2.setPlantName("토리이");
        plant2.setPlantBirth(LocalDate.now());
        plant2.setPlantExp(0);
        plant2.setWaterSupply(15);
        plant2.setAlarmCycle(5);
        Plant savedPlant2 = plantRepository.save(plant2);

        //when
        Plant findPlant = plantRepository.findById(savedPlant.getId())
                .orElseThrow(() -> new IllegalArgumentException("Wrong PlantId :" + savedPlant.getId()));
        Plant findPlant2 = plantRepository.findById(savedPlant2.getId())
                .orElseThrow(() -> new IllegalArgumentException("Wrong PlantId :" + savedPlant2.getId()));
        //then
        Assertions.assertThat(plantRepository.count()).isEqualTo(2);
        Assertions.assertThat(findPlant.getPlantSpecies()).isEqualTo("장미");
        Assertions.assertThat(findPlant.getPlantName()).isEqualTo("토로리");

        Assertions.assertThat(findPlant2.getPlantSpecies()).isEqualTo("가시");
        Assertions.assertThat(findPlant2.getPlantName()).isEqualTo("토리이");

    }
}
