package com.opinio.plantrowth.repository.payment;

import java.util.List;

import org.springframework.data.jpa.repository.JpaRepository;

import com.opinio.plantrowth.domain.payment.PointRecord;

public interface PointRecordRepository extends JpaRepository<PointRecord, Long> {
	List<PointRecord> findAllByUserId(Long userId);
}
