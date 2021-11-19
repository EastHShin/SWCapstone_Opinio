package com.opinio.plantrowth.service.user;

import com.opinio.plantrowth.domain.User;
import com.opinio.plantrowth.repository.user.UserRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

@Transactional(readOnly = true)
@RequiredArgsConstructor
@Service
public class UserPointService {

    private final UserRepository userRepository;

    private static final Integer increasingPoint = 10;
    private static final Integer decreasingPoint = 30;

    @Transactional
    public User increasePoint(Long id) {
        User user = userRepository.findById(id).orElseThrow(IllegalAccessError::new);
        Integer curPoint = user.getPoint();
        user.setPoint(curPoint + increasingPoint);
        userRepository.save(user);
        return user;
    }

    @Transactional
    public User decreasePoint(Long id){
        User user = userRepository.findById(id).orElseThrow(IllegalAccessError::new);
        Integer curPoint = user.getPoint();
        user.setPoint(curPoint - decreasingPoint);
        userRepository.save(user);
        return user;
    }
}
