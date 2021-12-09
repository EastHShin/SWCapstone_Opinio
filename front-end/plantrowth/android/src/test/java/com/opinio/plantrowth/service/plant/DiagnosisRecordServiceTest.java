package com.opinio.plantrowth.service.plant;

import static org.junit.jupiter.api.Assertions.*;
import static org.mockito.ArgumentMatchers.*;

import java.time.LocalDate;
import java.util.ArrayList;
import java.util.List;

import org.assertj.core.api.Assertions;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.DisplayName;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.Mockito;
import org.mockito.junit.jupiter.MockitoExtension;

import com.opinio.plantrowth.domain.plant.DiagnosisRecord;
import com.opinio.plantrowth.domain.plant.Plant;
import com.opinio.plantrowth.repository.plant.DiagnosisRecordRepository;
import com.opinio.plantrowth.repository.plant.PlantRepository;

@ExtendWith(MockitoExtension.class)
class DiagnosisRecordServiceTest {

	@Mock
	private DiagnosisRecordRepository diagnosisRecordRepository;

	@InjectMocks
	private DiagnosisRecordService diagnosisRecordService;

	Plant plant;
	List<DiagnosisRecord> records = new ArrayList<>();

	@BeforeEach
	public void setUpTest() {
		plant = Plant.builder()
			.plantSpecies("화분")
			.plantName("토리이")
			.fileName("fffff")
			.build();
	}

	@Test
	@DisplayName("진단내역 저장")
	public void saveRecord() throws Exception {
		//given
		String diseaseName = "백분병";
		String diseasePercent = "77";
		String imageUrl = "ffff";
		DiagnosisRecord diagnosisRecord = DiagnosisRecord.builder()
			.id(1L)
			.diseaseName(diseaseName)
			.diseasePercent(diseasePercent)
			.imageUrl(imageUrl)
			.plant(plant)
			.build();
		//when
		Mockito.when(diagnosisRecordRepository.save(any())).thenReturn(diagnosisRecord);

		DiagnosisRecord savedDiagnosisRecord = diagnosisRecordService.saveDiagnosisRecord(plant, diseaseName, diseasePercent,
			imageUrl);
		//then
		Assertions.assertThat(savedDiagnosisRecord.getDiseaseName()).isEqualTo(diseaseName);
		Assertions.assertThat(savedDiagnosisRecord.getPlant().getPlantName()).isEqualTo(plant.getPlantName());
		Assertions.assertThat(savedDiagnosisRecord.getPlant().getPlantSpecies()).isEqualTo(plant.getPlantSpecies());
	}
}