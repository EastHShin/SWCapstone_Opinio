package com.opinio.plantrowth.api.controller.user;


import com.opinio.plantrowth.api.dto.auth.JoinDTO;
import com.opinio.plantrowth.api.dto.auth.KakaoDTO;
import com.opinio.plantrowth.api.dto.auth.LoginDTO;
import com.opinio.plantrowth.config.security.JwtTokenProvider;
import com.opinio.plantrowth.domain.Message;
import com.opinio.plantrowth.domain.User;
import com.opinio.plantrowth.service.user.AuthService;
import com.opinio.plantrowth.service.user.UserService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpHeaders;
import org.springframework.http.HttpStatus;
import org.springframework.http.MediaType;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.web.bind.annotation.*;

import javax.servlet.http.HttpServletResponse;
import java.nio.charset.Charset;

@RequiredArgsConstructor
@RestController
@CrossOrigin(origins = "*", allowedHeaders = "*")
public class AuthApiContorller {
    private final JwtTokenProvider jwtTokenProvider;
    private final UserService userService;
    private final AuthService authService;

    @PostMapping("/api/auth/join")
    public ResponseEntity<?> join(@RequestBody JoinDTO user) {
        Message message = new Message();
        HttpHeaders headers = new HttpHeaders();
        if(authService.existEmail(user.getEmail())){
            message.setStatus(Message.StatusEnum.NOT_ACCEPTABLE);
            message.setMessage("이미 존재하는 이메일입니다.");
            return new ResponseEntity<>(message, headers, HttpStatus.NOT_ACCEPTABLE);
        }
        if(authService.existName(user.getUser_name())){
            message.setStatus(Message.StatusEnum.NOT_ACCEPTABLE);
            message.setMessage("이미 존재하는 닉네임입니다.");
            return new ResponseEntity<>(message, headers, HttpStatus.NOT_ACCEPTABLE);
        }
        Long result = authService.join(user);

        return result != null ?
                ResponseEntity.ok().body("회원가입 성공") :
                ResponseEntity.badRequest().build();

    }

    @PostMapping("/api/auth/login") //로그인
    public ResponseEntity<?> login(HttpServletResponse response,
                                   @RequestBody LoginDTO user) {
        User member = authService.login(user);
        Message message = new Message();
        HttpHeaders headers = new HttpHeaders();
        String token = jwtTokenProvider.createToken(member.getEmail(), member.getRoles());
        response.setHeader("Authorization", token);
        message.setStatus(Message.StatusEnum.OK);
        message.setMessage("로그인 성공");
        message.setData(member.getId());
        return new ResponseEntity<>(message, headers, HttpStatus.OK);
    }

    @PostMapping("/api/auth/kakao") //소셜 로그인
    public ResponseEntity<?> kakaoLogin(HttpServletResponse response,
                                        @RequestBody KakaoDTO user) {
        User member = authService.kakaoLogin(user);
        String token = jwtTokenProvider.createToken(member.getName(), member.getRoles());
        response.setHeader("Authorization", token);
        Message message = new Message();
        HttpHeaders headers = new HttpHeaders();
        headers.setContentType(new MediaType("application", "json", Charset.forName("UTF-8")));
        message.setStatus(Message.StatusEnum.OK);
        message.setMessage("카카오 로그인 성공");
        message.setData(member.getId());
        return new ResponseEntity<>(message, headers, HttpStatus.OK);
    }

    @PostMapping("/api/auth/logout")
    public ResponseEntity<?> logout(HttpServletResponse response){
        response.setHeader("Authorization", null);
        return ResponseEntity.ok().body("로그아웃 성공");
    }

    @GetMapping("/api/auth/info")
    public ResponseEntity<?> getInfo() {
        Object details = SecurityContextHolder.getContext().getAuthentication().getPrincipal();
        if (details != null && !(details instanceof String)) return ResponseEntity.ok().build();
        return ResponseEntity.badRequest().build();
    }

}
