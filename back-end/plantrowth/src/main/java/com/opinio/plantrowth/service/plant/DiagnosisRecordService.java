package com.opinio.plantrowth.service.plant;

import java.time.LocalDate;

import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import com.opinio.plantrowth.domain.plant.DiagnosisRecord;
import com.opinio.plantrowth.domain.plant.Plant;
import com.opinio.plantrowth.repository.plant.DiagnosisRecordRepository;

import lombok.RequiredArgsConstructor;

@Transactional(readOnly = true)
@RequiredArgsConstructor
@Service
public class DiagnosisRecordService {

	private final DiagnosisRecordRepository diagnosisRecordRepository;

	@Transactional
	public DiagnosisRecord saveDiagnosisRecord(Plant plant, String diseaseName, String diseasePercent, String imageUrl) {
		DiagnosisRecord diagnosisRecord = DiagnosisRecord.builder()
			.plant(plant)
			.diseaseName(diseaseName)
			.diseasePercent(diseasePercent)
			.diagnosisDate(LocalDate.now())
			.imageUrl(imageUrl)
			.build();
		return diagnosisRecordRepository.save(diagnosisRecord);
	}
}
