package com.opinio.plantrowth.service.user;


import com.opinio.plantrowth.api.dto.auth.JoinDTO;
import com.opinio.plantrowth.api.dto.auth.KakaoDTO;
import com.opinio.plantrowth.api.dto.auth.LoginDTO;
import com.opinio.plantrowth.api.dto.auth.checkPasswordDTO;
import com.opinio.plantrowth.domain.User;
import com.opinio.plantrowth.repository.user.UserRepository;
import lombok.RequiredArgsConstructor;
import org.apache.catalina.security.SecurityUtil;
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
public class AuthService implements UserDetailsService {

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
    public User kakaoLogin(KakaoDTO user){
        User member = userRepository.findByEmail(user.getEmail())
                .orElseThrow(()->new IllegalArgumentException("가입되지 않은 아이디입니다."));
        Long userId = member.getId();
        return member;
    }

    @Transactional
    public boolean checkPassword(Long id, checkPasswordDTO pw){
        User user = userRepository.findById(id)
                .orElseThrow(()->new IllegalArgumentException("잘못된 회원ID입니다."));
        if (!passwordEncoder.matches(user.getPassword(), user.getPassword())){
            throw new IllegalArgumentException("잘못된 비밀번호입니다.");
        }
        return true;
    }

    @Override
    public UserDetails loadUserByUsername(String email) throws UsernameNotFoundException {
        return userRepository.findByEmail(email)
                .orElseThrow(()-> new UsernameNotFoundException("사용자를 찾을 수 없습니다."));
    }

    public boolean existEmail(String email){
        return userRepository.existsByEmail(email);
    }
    public boolean existName(String name){
        return userRepository.existsByName(name);
    }
}
