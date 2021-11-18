package com.opinio.plantrowth.repository;

import com.opinio.plantrowth.domain.ConfirmationToken;
import org.springframework.data.jpa.repository.JpaRepository;

import java.time.LocalDateTime;
import java.util.Optional;

public interface ConfirmationTokenRepository extends JpaRepository<ConfirmationToken, String> {
    Optional<ConfirmationToken> findByCodeAndExpirationDateAfterAndExpired(String code, LocalDateTime now, boolean expired);
}
