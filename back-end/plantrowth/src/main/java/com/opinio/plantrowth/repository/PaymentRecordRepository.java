package com.opinio.plantrowth.repository;

import org.springframework.data.jpa.repository.JpaRepository;

import com.opinio.plantrowth.domain.PaymentRecord;

public interface PaymentRecordRepository extends JpaRepository<PaymentRecord, Long> {

}
