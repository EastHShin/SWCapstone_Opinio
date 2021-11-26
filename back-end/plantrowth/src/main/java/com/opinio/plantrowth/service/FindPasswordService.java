package com.opinio.plantrowth.service;

import com.opinio.plantrowth.domain.User;
import com.opinio.plantrowth.repository.UserRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.LocalDate;
import java.util.Optional;

@Transactional(readOnly = true)
@Service
@RequiredArgsConstructor
public class FindPasswordService {

    private final UserRepository userRepository;


//    public Long findPassword(String email, LocalDate userBirth) {
//        User user = userRepository.findByEmailAndBirth(email, userBirth)
//                .orElseThrow(() -> new IllegalArgumentException("There is No user information"));
//
//
//
//    }
}
