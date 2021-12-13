package com.opinio.plantrowth.service.scheduler;

import java.time.LocalDate;
import java.util.List;
import java.util.stream.Collectors;

import org.springframework.scheduling.annotation.EnableAsync;
import org.springframework.scheduling.annotation.Scheduled;
import org.springframework.stereotype.Component;
import org.springframework.transaction.annotation.Transactional;

import com.opinio.plantrowth.domain.payment.Subscription;
import com.opinio.plantrowth.domain.user.User;
import com.opinio.plantrowth.repository.payment.SubscriptionRepository;
import com.opinio.plantrowth.repository.user.UserRepository;

import lombok.RequiredArgsConstructor;

@RequiredArgsConstructor
@Component
public class SubscribeCancelScheduler {

	private final SubscriptionRepository subscriptionRepository;

	@Transactional
	@Scheduled(cron = "0 0 0 * * *")
	public void subscriptionSchedule() {
		List<Subscription> subscriptionList = subscriptionRepository.findAll();
		subscriptionList.stream()
			.filter(subscription -> subscription.getEnd().isAfter(LocalDate.now()))
			.forEach(expiredSubscription -> expiredSubscription.getUser().setSubscription(false));

	}


}
