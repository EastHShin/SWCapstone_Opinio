package com.opinio.plantrowth.repository.payment;

import com.opinio.plantrowth.domain.payment.Subscription;
import org.springframework.data.jpa.repository.JpaRepository;

public interface SubscriptionRepository extends JpaRepository<Subscription, Long> {

}
