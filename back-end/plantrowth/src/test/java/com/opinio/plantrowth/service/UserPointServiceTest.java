package com.opinio.plantrowth.service;

import com.opinio.plantrowth.domain.Plant;
import com.opinio.plantrowth.domain.User;
import com.opinio.plantrowth.repository.PlantRepository;
import com.opinio.plantrowth.repository.UserRepository;
import org.assertj.core.api.Assertions;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.DisplayName;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.Mockito;
import org.mockito.junit.jupiter.MockitoExtension;

import java.time.LocalDate;
import java.util.Optional;

import static org.mockito.ArgumentMatchers.any;

@ExtendWith(MockitoExtension.class)
class UserPointServiceTest {

    @Mock
    private PlantRepository plantRepository;
    @Mock
    private UserRepository userRepository;

    @InjectMocks
    private UserPointService userPointService;

    private User user;
    private Plant plant;
    private Plant plant2;

    private final Integer increasingPoint = 10;

    @BeforeEach
    public void setUpTest() {
        user = User.builder()
                .email("fff")
                .name("east")
                .password("orort")
                .point(0)
                .build();

        plant = Plant.builder()
                .plantSpecies("장미")
                .plantName("토리이")
                .plantBirth(LocalDate.now())
                .alarmCycle(2)
                .waterSupply(3)
                .plantExp(0)
                .build();

        plant2 = Plant.builder()
                .plantSpecies("가시")
                .plantName("토이이이")
                .plantBirth(LocalDate.now())
                .alarmCycle(5)
                .waterSupply(1)
                .plantExp(0)
                .build();

    }

    @Test
    @DisplayName("포인트 업데이트 정상 확인")
    public void increasePointTest() throws Exception{
        //given
        user.setId(1L);
        Integer curPoint = user.getPoint();
        //when
        Mockito.when(userRepository.findById(any())).thenReturn(Optional.of(user));
        User updatedUser = userPointService.increasePoint(user.getId());
        //then
        Assertions.assertThat(updatedUser.getPoint()).isEqualTo(curPoint+increasingPoint);
    }
}