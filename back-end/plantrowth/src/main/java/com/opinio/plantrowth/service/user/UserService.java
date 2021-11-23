package com.opinio.plantrowth.service.user;

import com.opinio.plantrowth.api.dto.auth.*;
import com.opinio.plantrowth.api.dto.user.UserLookUpDTO;
import com.opinio.plantrowth.api.dto.user.UserUpdateDTO;
import com.opinio.plantrowth.api.dto.user.addPlantDTO;
import com.opinio.plantrowth.domain.User;
import com.opinio.plantrowth.repository.user.UserRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.security.core.userdetails.UserDetailsService;
import org.springframework.security.core.userdetails.UsernameNotFoundException;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.Collections;

@Transactional(readOnly = true)
@RequiredArgsConstructor
@Service
public class UserService {
    private final UserRepository userRepository;

    @Transactional
    public void updateUser(Long id, UserUpdateDTO user){
        User member = userRepository.findById(id).orElseThrow(IllegalAccessError::new);
        if(!(user.getUser_name()==null))
            member.setName(user.getUser_name());
        if(!(user.getUser_birth()==null))
            member.setBirth(user.getUser_birth());

        userRepository.save(member);
    }

//    @Transactional
//    public boolean changePassword(Long id){
////        String rawPassword = user.getPassword();
////        String encPassword =passwordEncoder.encode(rawPassword);
////        member.setPassword(encPassword);
//    }
//
    @Transactional
    public UserLookUpDTO lookup(Long id){
        User member = userRepository.findById(id)
                .orElseThrow(()-> new IllegalArgumentException("찾을 수 없는 사용자입니다."));
        UserLookUpDTO dto = new UserLookUpDTO();
        dto.setUser_name(member.getName());
        dto.setUser_birth(member.getBirth());
        dto.setEmail(member.getEmail());
        dto.setPoint(member.getPoint());
        dto.setPlantNum(member.getPlantNum());
        dto.setMaxPlantNum(member.getMaxPlantNum());
        return dto;
    }
    @Transactional
    public Long deleteUser(Long id){
        User user = userRepository.findById(id)
                .orElseThrow(()-> new IllegalArgumentException("찾을 수 없는 사용자입니다."));
        userRepository.delete(user);

        return id;
    }

    @Transactional
    public addPlantDTO addPlant(Long id){
        User user = userRepository.findById(id)
                .orElseThrow(()-> new IllegalArgumentException("찾을 수 없는 사용자입니다."));
        if(user.getPoint()<50) {
            throw new IllegalArgumentException("포인트가 부족합니다.");
        }
        user.setPoint(user.getPoint()-50);
        user.setMaxPlantNum(user.getMaxPlantNum()+1);
        addPlantDTO dto = new addPlantDTO();
        dto.setPoint(user.getPoint());
        dto.setMax_plant_num(user.getMaxPlantNum());

        return  dto;
    }

    public User findUser(Long id) {
        /*
        getById는 지연로딩 시킴, id값 외에 다른 필드를 참조할때 쿼리가 발생
        -> Id외에 다른 필드에 대한 정보가 필요하지 않을때 유리함
        -> 지연로딩 시켜서 plant에 user를 저장시키지 못하는 문제 발생시킴 (2021/11/03)
         */
        User user = userRepository.findById(id).orElseThrow(IllegalAccessError::new);
        return user;
    }


}
