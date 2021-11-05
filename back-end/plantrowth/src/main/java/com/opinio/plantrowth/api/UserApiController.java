package com.opinio.plantrowth.api;


import com.opinio.plantrowth.config.security.JwtTokenProvider;
import com.opinio.plantrowth.api.dto.UserDTO;
import com.opinio.plantrowth.domain.User;
import com.opinio.plantrowth.repository.UserRepository;
import com.opinio.plantrowth.service.UserService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RestController;

import javax.servlet.http.HttpServletResponse;
import java.util.HashMap;
import java.util.Map;

@RequiredArgsConstructor
@RestController
public class UserApiController {
    private final PasswordEncoder passwordEncoder;
    private final JwtTokenProvider jwtTokenProvider;
    private final UserRepository userRepository;
    private final UserService userService;

    //회원가입
/*
    @PostMapping("/join")
    public Long join(@RequestBody Map<String, String> user){

        return
                userRepository.save(User.builder()
                .email(user.get("email"))
                .password(passwordEncoder.encode(user.get("password")))
                .roles(Collections.singletonList("ROLE_USER"))
                .build()).getId();
    }

 */

    @PostMapping("/join")
    public ResponseEntity join(@RequestBody UserDTO user){
        Long result = userService.join(user);

        return result != null?
                ResponseEntity.ok().body("회원가입 성공"):
                ResponseEntity.badRequest().build();

    }

    //로그인
    /*
    @PostMapping("/login")
    public String login(@RequestBody Map<String, String> user){
        User member = userRepository.findByEmail(user.get("email"))
                .orElseThrow(()->new IllegalArgumentException("가입되지 않은 아이디입니다."));
        if (!passwordEncoder.matches(user.get("password"), member.getPassword())){
            throw new IllegalArgumentException("잘못된 아이디 혹은 비밀번호입니다.");
        }
        return  jwtTokenProvider.createToken(member.getUsername(), member.getRoles());
    }
    */
   @PostMapping("/login")
    public ResponseEntity<?> login(HttpServletResponse response, @RequestBody Map<String, String> user){
        User member = userRepository.findByEmail(user.get("email"))
                .orElseThrow(()->new IllegalArgumentException("가입되지 않은 아이디입니다."));
        if (!passwordEncoder.matches(user.get("password"), member.getPassword())){
            throw new IllegalArgumentException("잘못된 아이디 혹은 비밀번호입니다.");
        }
        String token = jwtTokenProvider.createToken(member.getName(), member.getRoles());

        response.setHeader("Authorization", token);
        return
                ResponseEntity.ok().body("로그인 성공");
    }

    @PostMapping("/user/test")
    public Map userResponseTest(){
       Map<String, String> result = new HashMap<>();
       result.put("result", "user ok");
       return result;
    }

    @PostMapping("/admin/test")
    public Map adminResponseTest(){
       Map<String, String> result = new HashMap<>();
       result.put("result", "admin ok");
       return result;
    }

}

//컨트롤러 - 서비스 - 리포지토리

