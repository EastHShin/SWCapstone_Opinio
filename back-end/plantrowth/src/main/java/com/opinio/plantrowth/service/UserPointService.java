package com.opinio.plantrowth.service;

import com.opinio.plantrowth.domain.User;
import com.opinio.plantrowth.repository.UserRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

@Transactional(readOnly = true)
@RequiredArgsConstructor
@Service
public class UserPointService {

    private final UserRepository userRepository;

    private static final Integer increasingPoint = 10;
    @Transactional
    public User updatePoint(Long id) {
        User user = userRepository.findById(id).orElseThrow(IllegalAccessError::new);
        Integer curPoint = user.getPoint();
        user.setPoint(curPoint + increasingPoint);
        userRepository.save(user);
        return user;
    }
}
