package com.opinio.plantrowth.service.payment;

import java.util.List;

import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import com.opinio.plantrowth.domain.payment.PointRecord;
import com.opinio.plantrowth.repository.payment.PointRecordRepository;

import lombok.RequiredArgsConstructor;

@RequiredArgsConstructor
@Transactional(readOnly = true)
@Service
public class PointRecordService {

	private final PointRecordRepository pointRecordRepository;

	public List<PointRecord> getPointRecords(Long userId) {
		return pointRecordRepository.findAllByUserId(userId);
	}

}
