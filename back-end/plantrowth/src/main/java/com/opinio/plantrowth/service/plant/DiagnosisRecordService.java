package com.opinio.plantrowth.service.plant;

import java.time.LocalDate;
import java.time.LocalDateTime;
import java.util.List;
import java.util.Optional;
import java.util.stream.Collectors;

import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import com.opinio.plantrowth.domain.payment.PaymentRecord;
import com.opinio.plantrowth.domain.plant.DiagnosisRecord;
import com.opinio.plantrowth.domain.plant.Plant;
import com.opinio.plantrowth.repository.payment.PaymentRecordRepository;
import com.opinio.plantrowth.repository.plant.DiagnosisRecordRepository;

import lombok.RequiredArgsConstructor;

@Transactional(readOnly = true)
@RequiredArgsConstructor
@Service
public class DiagnosisRecordService {

	private final DiagnosisRecordRepository diagnosisRecordRepository;
	private final PaymentRecordRepository paymentRecordRepository;

	@Transactional
	public DiagnosisRecord saveDiagnosisRecord(Plant plant, String diseaseName, String diseasePercent, String imageUrl) {
		DiagnosisRecord diagnosisRecord = DiagnosisRecord.builder()
			.plant(plant)
			.diseaseName(diseaseName)
			.diseasePercent(diseasePercent)
			.diagnosisDate(LocalDateTime.now())
			.imageUrl(imageUrl)
			.build();
		return diagnosisRecordRepository.save(diagnosisRecord);
	}

	public List<DiagnosisRecord> getDiagnosisRecords(Long plantId) {
		List<DiagnosisRecord> records = diagnosisRecordRepository.findAllByPlantId(plantId);
		return records;
	}

	public List<DiagnosisRecord> getValidDiagnosisRecords(Long plantId, String merchantId) {
		List<DiagnosisRecord> records = diagnosisRecordRepository.findAllByPlantId(plantId);
		PaymentRecord paymentRecord = paymentRecordRepository.findByMerchantUid(merchantId).orElseThrow(
			() -> new IllegalArgumentException("No Found Payment Record")
		);
		return records.stream()
			.filter(record -> record.getDiagnosisDate().isAfter(paymentRecord.getDateTime()))
			.collect(Collectors.toList());
	}
}
