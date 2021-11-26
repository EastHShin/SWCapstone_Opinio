package com.opinio.plantrowth.repository.payment;

import org.springframework.data.jpa.repository.JpaRepository;

import com.opinio.plantrowth.domain.payment.PaymentRecord;

public interface PaymentRecordRepository extends JpaRepository<PaymentRecord, Long> {

}
