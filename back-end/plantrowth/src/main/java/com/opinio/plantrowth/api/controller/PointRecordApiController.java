package com.opinio.plantrowth.api.controller;

import java.util.List;
import java.util.stream.Collectors;

import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.RestController;

import com.opinio.plantrowth.domain.payment.PointRecord;
import com.opinio.plantrowth.domain.payment.PointSpendType;
import com.opinio.plantrowth.service.payment.PointRecordService;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;
import lombok.RequiredArgsConstructor;

@RequiredArgsConstructor
@RestController
public class PointRecordApiController {
	private final PointRecordService pointRecordService;

	@GetMapping("/api/payments/point/record/{user-id}")
	public ResponseEntity<PointRecordDTO> getPointRecord(@PathVariable("user-id") Long userId) {
		List<PointRecord> pointRecords = pointRecordService.getPointRecords(userId);

		return new ResponseEntity<PointRecordDTO>(new PointRecordDTO(userId, pointRecords), HttpStatus.OK);
	}


	@Data
	@NoArgsConstructor
	static class PointRecordDTO{
		private Long user_id;
		List<PointRecordInfoDTO> records;

		public PointRecordDTO(Long userId, List<PointRecord> pointRecords) {
			user_id = userId;
			records = pointRecords.stream()
				.map(record -> new PointRecordInfoDTO(record))
				.collect(Collectors.toList());
		}
	}

	@Data
	@AllArgsConstructor
	static class PointRecordInfoDTO{
		private Integer spent_point;
		private Integer remain_point;
		private Boolean is_negative;
		private PointSpendType pointSpendType;

		public PointRecordInfoDTO(PointRecord pointRecord) {
			spent_point = pointRecord.getSpentPoint();
			remain_point = pointRecord.getRemainPoint();
			is_negative = pointRecord.getIsNegative();
			pointSpendType = pointRecord.getPointSpendType();
		}
	}
}
