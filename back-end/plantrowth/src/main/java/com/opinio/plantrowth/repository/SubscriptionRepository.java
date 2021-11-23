package com.opinio.plantrowth.repository;

import com.opinio.plantrowth.domain.Subscription;
import org.springframework.data.jpa.repository.JpaRepository;

public interface SubscriptionRepository extends JpaRepository<Subscription, Long> {

}
