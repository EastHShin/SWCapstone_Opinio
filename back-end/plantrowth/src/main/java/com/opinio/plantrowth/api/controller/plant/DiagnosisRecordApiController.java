package com.opinio.plantrowth.api.controller.plant;

import java.time.LocalDate;
import java.time.LocalDateTime;
import java.util.List;
import java.util.stream.Collectors;

import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.RestController;

import com.opinio.plantrowth.domain.plant.DiagnosisRecord;
import com.opinio.plantrowth.domain.plant.Plant;
import com.opinio.plantrowth.service.plant.DiagnosisRecordService;
import com.opinio.plantrowth.service.plant.PlantService;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.RequiredArgsConstructor;

@RequiredArgsConstructor
@RestController
public class DiagnosisRecordApiController {

	private final DiagnosisRecordService diagnosisRecordService;
	private final PlantService plantService;

	@GetMapping("/api/plants/diagnosis/record/{plant-id}")
	public ResponseEntity<DiagnosisRecordDTO> getRecords(@PathVariable("plant-id") Long plantId) {
		Plant plant = plantService.findOnePlant(plantId);
		List<DiagnosisRecord> records = diagnosisRecordService.getDiagnosisRecords(plantId);

		return new ResponseEntity<DiagnosisRecordDTO>(new DiagnosisRecordDTO(plant, records), HttpStatus.OK);
	}

	@AllArgsConstructor
	@Data
	static class DiagnosisRecordDTO {
		private Long plant_id;
		private String plant_name;
		private String plant_species;
		private List<DiagnosisInfoDTO> records;

		public DiagnosisRecordDTO(Plant plant, List<DiagnosisRecord> diagnosisRecords) {
			plant_id = plant.getId();
			plant_name = plant.getPlantName();
			plant_species = plant.getPlantSpecies();

			records = diagnosisRecords.stream()
				.map(rec -> new DiagnosisInfoDTO(rec))
				.collect(Collectors.toList());
		}

	}

	@AllArgsConstructor
	@Data
	static class DiagnosisInfoDTO {
		private LocalDateTime diagnosis_date;
		private String disease_name;
		private String disease_percent;
		private String image_url;

		public DiagnosisInfoDTO(DiagnosisRecord diagnosisRecord) {
			diagnosis_date = diagnosisRecord.getDiagnosisDate();
			disease_name = diagnosisRecord.getDiseaseName();
			disease_percent = diagnosisRecord.getDiseasePercent();
			image_url = diagnosisRecord.getImageUrl();
		}
	}
}
