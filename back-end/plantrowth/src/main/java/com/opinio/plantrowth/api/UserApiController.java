package com.opinio.plantrowth.api;


import com.opinio.plantrowth.api.dto.auth.*;
import com.opinio.plantrowth.config.security.JwtTokenProvider;
import com.opinio.plantrowth.domain.Message;
import com.opinio.plantrowth.domain.User;
import com.opinio.plantrowth.service.UserService;
import lombok.RequiredArgsConstructor;
import org.springframework.security.core.context.SecurityContextHolder;

import org.springframework.http.HttpHeaders;
import org.springframework.http.HttpStatus;
import org.springframework.http.MediaType;
import org.springframework.http.ResponseEntity;

import org.springframework.web.bind.annotation.*;

import javax.servlet.http.HttpServletResponse;
import java.nio.charset.Charset;
import java.util.HashMap;
import java.util.Map;

@RequiredArgsConstructor
@RestController
@CrossOrigin(origins = "*", allowedHeaders = "*")
public class UserApiController {
    private final JwtTokenProvider jwtTokenProvider;
    private final UserService userService;

    @PostMapping("/api/auth/join")
    public ResponseEntity<?> join(@RequestBody JoinDTO user) {
        Message message = new Message();
        HttpHeaders headers = new HttpHeaders();
        if(userService.existEmail(user.getEmail())){
            message.setStatus(Message.StatusEnum.NOT_ACCEPTABLE);
            message.setMessage("이미 존재하는 이메일입니다.");
            return new ResponseEntity<>(message, headers, HttpStatus.NOT_ACCEPTABLE);
        }
        if(userService.existName(user.getUser_name())){
            message.setStatus(Message.StatusEnum.NOT_ACCEPTABLE);
            message.setMessage("이미 존재하는 닉네임입니다.");
            new ResponseEntity<>(message, headers, HttpStatus.NOT_ACCEPTABLE);
        }
        Long result = userService.join(user);

        return result != null ?
                ResponseEntity.ok().body("회원가입 성공") :
                ResponseEntity.badRequest().build();

    }

    @PostMapping("/api/auth/login") //로그인
    public ResponseEntity<?> login(HttpServletResponse response,
                                   @RequestBody LoginDTO user) {
        User member = userService.login(user);
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
        User member = userService.kakaoLogin(user);
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

    @GetMapping("/api/user/{user-id}")
    public ResponseEntity<?> lookUpUser(@PathVariable("user-id") Long id) {
        UserLookUpDTO user = userService.lookup(id);
        Message message = new Message();
        HttpHeaders headers = new HttpHeaders();
        headers.setContentType(new MediaType("application", "json", Charset.forName("UTF-8")));
        message.setStatus(Message.StatusEnum.OK);
        message.setMessage("회원 조회 성공");
        message.setData(user);

        return new ResponseEntity<>(message, headers, HttpStatus.OK);
    }

    @PutMapping("/api/user/{user-id}")
    public ResponseEntity<?> updateUser(@PathVariable("user-id") Long id, @RequestBody UserUpdateDTO user) {
        userService.updateUser(id, user);
        Message message = new Message();
        HttpHeaders headers = new HttpHeaders();
        headers.setContentType(new MediaType("application", "json", Charset.forName("UTF-8")));
        message.setStatus(Message.StatusEnum.OK);
        message.setMessage("회원 정보가 수정되었습니다.");
        message.setData(user);

        return new ResponseEntity<>(message, headers, HttpStatus.OK);
    }

    @DeleteMapping("/api/user/{user-id}")
    public ResponseEntity<?> deleteUser(@PathVariable("user-id") Long id) {
        Long result = userService.deleteUser(id);
        return result != null ?
                ResponseEntity.ok().body("회원 탈퇴 성공") :
                ResponseEntity.badRequest().build();
    }

    @GetMapping("/info")
    public ResponseEntity<?> getInfo() {
        Object details = SecurityContextHolder.getContext().getAuthentication().getPrincipal();
        if (details != null && !(details instanceof String)) return ResponseEntity.ok().build();
        return ResponseEntity.badRequest().build();
    }

    @PostMapping("/api/auth/logout")
    public ResponseEntity<?> logout(HttpServletResponse response){
        response.setHeader("Authorization", null);
        return ResponseEntity.ok().body("로그아웃 성공");
    }

    @PostMapping("/api/users/profiles/{user-id}")
    public ResponseEntity<?> addPlant(@PathVariable("user-id") Long id){
        addPlantDTO dto = userService.addPlant(id);
        Message message = new Message();
        HttpHeaders headers = new HttpHeaders();
        headers.setContentType(new MediaType("application", "json", Charset.forName("UTF-8")));
        message.setStatus(Message.StatusEnum.OK);
        message.setMessage("프로필 개수 추가");
        message.setData(dto);

        return new ResponseEntity<>(message, headers, HttpStatus.OK);
    }

//    @PostMapping("/api/auth/reissue")
//    public TokenDTO reissue(@RequestBody TokenDTO tokenDTO){
//        userService.reissue(tokenDTO);
//        return tokenDTO;


    @PostMapping("/user/test")
    public Map userResponseTest() {
        Map<String, String> result = new HashMap<>();
        result.put("result", "user ok");
        return result;
    }

    @PostMapping("/admin/test")
    public Map adminResponseTest() {
        Map<String, String> result = new HashMap<>();
        result.put("result", "admin ok");
        return result;
    }

}