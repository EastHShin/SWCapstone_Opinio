package com.opinio.plantrowth.repository.payment;

import java.util.Optional;

import org.springframework.data.jpa.repository.JpaRepository;

import com.opinio.plantrowth.domain.payment.PaymentRecord;

public interface PaymentRecordRepository extends JpaRepository<PaymentRecord, Long> {
	Optional<PaymentRecord> findByMerchantUid(String merchantUid);
}
