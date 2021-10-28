package com.opinio.plantrowth.repository;

import com.opinio.plantrowth.domain.User;
import org.springframework.data.jpa.repository.JpaRepository;

public interface UserRepository extends JpaRepository<User, Long> {
}
