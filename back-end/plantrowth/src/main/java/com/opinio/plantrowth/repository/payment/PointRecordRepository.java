package com.opinio.plantrowth.repository.payment;

import org.springframework.data.jpa.repository.JpaRepository;

import com.opinio.plantrowth.domain.payment.PointRecord;

public interface PointRecordRepository extends JpaRepository<PointRecord, Long> {
}
