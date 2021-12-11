package com.opinio.plantrowth.repository.plant;

import static org.junit.jupiter.api.Assertions.*;

import java.time.LocalDate;
import java.time.LocalDateTime;
import java.util.ArrayList;
import java.util.List;

import org.assertj.core.api.Assertions;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.autoconfigure.orm.jpa.DataJpaTest;

import com.opinio.plantrowth.domain.plant.DiagnosisRecord;
import com.opinio.plantrowth.domain.plant.Plant;

@DataJpaTest
class DiagnosisRecordRepositoryTest {

	@Autowired
	private PlantRepository plantRepository;
	@Autowired
	private DiagnosisRecordRepository diagnosisRecordRepository;

	Plant plant;
	List<DiagnosisRecord> records = new ArrayList<>();

	@BeforeEach
	public void setUpTest() {
		plant = Plant.builder()
			.plantSpecies("화분")
			.plantName("토리이")
			.fileName("fffff")
			.build();
		plantRepository.save(plant);

		for (int i = 0; i < 5; i++) {
			DiagnosisRecord diagnosisRecord = DiagnosisRecord.builder()
				.diseaseName("백분병")
				.diseasePercent("70" + Integer.toString(i))
				.diagnosisDate(LocalDateTime.now())
				.plant(plant)
				.imageUrl("ggggg")
				.build();
			records.add(diagnosisRecord);
		}
		diagnosisRecordRepository.saveAll(records);
	}

	@Test
	public void findAllRecord() throws Exception{
	    //given

	    //when
		List<DiagnosisRecord> savedRecords = diagnosisRecordRepository.findAllByPlantId(plant.getId());
		//then
		Assertions.assertThat(savedRecords.size()).isEqualTo(records.size());
	}

}