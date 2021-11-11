package com.opinio.plantrowth.service;

import com.opinio.plantrowth.api.dto.auth.JoinDTO;
import com.opinio.plantrowth.api.dto.auth.KakaoDTO;
import com.opinio.plantrowth.api.dto.auth.LoginDTO;
import com.opinio.plantrowth.api.dto.auth.UserUpdateDTO;
import com.opinio.plantrowth.domain.User;
import com.opinio.plantrowth.repository.UserRepository;
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
public class UserService implements UserDetailsService {

    private final UserRepository userRepository;
    private final PasswordEncoder passwordEncoder;

    @Transactional
    public Long join(JoinDTO user){
        Long userId = userRepository.save(
                User.builder()
                        .name(user.getUser_name())
                        .birth(user.getUser_birth())
                        .email(user.getEmail())
                        .password(passwordEncoder.encode(user.getPassword()))
                        .FCMAccessToken(user.getFcm_access_token())
                        .point(0)
                        .plantNum(0)
                        .maxPlantNum(3)
                        .roles(Collections.singletonList("ROLE_USER"))
                        .build())
                .getId();
        return userId;
    }


    public User login(LoginDTO user){
        User member = userRepository.findByEmail(user.getEmail())
                .orElseThrow(()->new IllegalArgumentException("가입되지 않은 아이디입니다."));
        if (!passwordEncoder.matches(user.getPassword(), member.getPassword())){
            throw new IllegalArgumentException("잘못된 아이디 혹은 비밀번호입니다.");
        }
        return member;
    }

    @Transactional
    public Long kakaoLogin(KakaoDTO user){
        User member = userRepository.findByEmail(user.getEmail())
                .orElseThrow(()->new IllegalArgumentException("가입되지 않은 아이디입니다."));
        Long userId = member.getId();
        return userId;
    }

    @Transactional
    public void updateUser(Long id, UserUpdateDTO user){
        User member = userRepository.findById(id).orElseThrow(IllegalAccessError::new);
        member.setName(user.getUser_name());
        member.setBirth(user.getUser_birth());
        member.setEmail(user.getEmail());
        String rawPassword = user.getPassword();
        String encPassword =passwordEncoder.encode(rawPassword);
        member.setPassword(encPassword);
        userRepository.save(member);
    }
    @Override
    public UserDetails loadUserByUsername(String username) throws UsernameNotFoundException{
        return userRepository.findByEmail(username)
                .orElseThrow(()-> new UsernameNotFoundException("사용자를 찾을 수 없습니다."));
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
