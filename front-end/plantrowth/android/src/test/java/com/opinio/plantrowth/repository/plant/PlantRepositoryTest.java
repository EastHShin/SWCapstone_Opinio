package com.opinio.plantrowth.repository.plant;

import com.opinio.plantrowth.domain.plant.Plant;
import com.opinio.plantrowth.domain.user.User;
import com.opinio.plantrowth.repository.plant.PlantRepository;
import com.opinio.plantrowth.repository.user.UserRepository;

import org.assertj.core.api.Assertions;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.DisplayName;
import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.autoconfigure.orm.jpa.DataJpaTest;

import java.time.LocalDate;
import java.util.List;

@DataJpaTest
class PlantRepositoryTest {

	@Autowired
	private PlantRepository plantRepository;

	@Autowired
	private UserRepository userRepository;

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
	@DisplayName("식물이 DB에 저장되는지 확인")
	void savePlant() throws Exception {
		//given

		//when
		Plant savedPlant = plantRepository.save(plant);
		//then
		Assertions.assertThat(plant).isSameAs(savedPlant);
		Assertions.assertThat(plant.getPlantName()).isEqualTo(savedPlant.getPlantName());
		Assertions.assertThat(plant.getPlantBirth()).isEqualTo(savedPlant.getPlantBirth());
		Assertions.assertThat(plant.getPlantSpecies()).isEqualTo(savedPlant.getPlantSpecies());
		Assertions.assertThat(plant.getWaterSupply()).isEqualTo(savedPlant.getWaterSupply());
	}

	@Test
	@DisplayName("저장된 식물이 조회되는지 확인")
	void findPlant() throws Exception {
		//given
		userRepository.save(user);
		Plant savedPlant = plantRepository.save(plant);
		Plant savedPlant2 = plantRepository.save(plant2);

		//when
		Plant findPlant = plantRepository.findById(savedPlant.getId())
			.orElseThrow(() -> new IllegalArgumentException("Wrong PlantId :" + savedPlant.getId()));
		Plant findPlant2 = plantRepository.findById(savedPlant2.getId())
			.orElseThrow(() -> new IllegalArgumentException("Wrong PlantId :" + savedPlant2.getId()));
		//then
		Assertions.assertThat(plantRepository.count()).isEqualTo(2);
		Assertions.assertThat(findPlant.getPlantSpecies()).isEqualTo(plant.getPlantSpecies());
		Assertions.assertThat(findPlant.getPlantName()).isEqualTo(plant.getPlantName());

		Assertions.assertThat(findPlant2.getPlantSpecies()).isEqualTo(plant2.getPlantSpecies());
		Assertions.assertThat(findPlant2.getPlantName()).isEqualTo(plant2.getPlantName());
	}

	@Test
	public void plantList() throws Exception {
		//given

		User savedUser = userRepository.save(user);
		Plant savedPlant = plantRepository.save(plant);
		Plant savedPlant2 = plantRepository.save(plant2);
		//when
		List<Plant> plantList = plantRepository.findAllByUserId(savedUser.getId());
		//then
		Assertions.assertThat(plantList.size()).isEqualTo(2);
	}

}
