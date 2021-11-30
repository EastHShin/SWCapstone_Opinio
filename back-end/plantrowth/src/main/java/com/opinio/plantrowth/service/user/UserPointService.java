package com.opinio.plantrowth.service.user;

import java.time.LocalDate;

import com.opinio.plantrowth.domain.payment.PointRecord;
import com.opinio.plantrowth.domain.payment.PointSpendType;
import com.opinio.plantrowth.domain.user.User;
import com.opinio.plantrowth.repository.payment.PointRecordRepository;
import com.opinio.plantrowth.repository.user.UserRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

@Transactional(readOnly = true)
@RequiredArgsConstructor
@Service
public class UserPointService {

    private final UserRepository userRepository;
    private final PointRecordRepository pointRecordRepository;
    private static final Integer increasingPoint = 10;

    @Transactional
    public User increasePoint(Long id, PointSpendType pointSpendType) {
        User user = userRepository.findById(id).orElseThrow(IllegalAccessError::new);
        Integer curPoint = user.getPoint();
        user.setPoint(curPoint + increasingPoint);
        userRepository.save(user);
        PointRecord pointRecord = PointRecord.builder()
            .spentPoint(increasingPoint)
            .isNegative(false)
            .remainPoint(curPoint + increasingPoint)
            .pointSpendType(pointSpendType)
            .date(LocalDate.now())
            .user(user)
            .build();
        pointRecordRepository.save(pointRecord);
        return user;
    }

    @Transactional
    public User decreasePoint(Long id, Integer decreasingPoint, PointSpendType pointSpendType){
        User user = userRepository.findById(id).orElseThrow(IllegalAccessError::new);
        Integer curPoint = user.getPoint();
        user.setPoint(curPoint - decreasingPoint);
        userRepository.save(user);
        PointRecord pointRecord = PointRecord.builder()
            .spentPoint(decreasingPoint)
            .isNegative(true)
            .remainPoint(curPoint - decreasingPoint)
            .pointSpendType(pointSpendType)
            .date(LocalDate.now())
            .user(user)
            .build();
        pointRecordRepository.save(pointRecord);

        return user;
    }
}
