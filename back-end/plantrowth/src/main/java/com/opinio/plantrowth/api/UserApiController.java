package com.opinio.plantrowth.api;


import com.opinio.plantrowth.api.dto.auth.*;
import com.opinio.plantrowth.config.security.JwtTokenProvider;
import com.opinio.plantrowth.domain.Message;
import com.opinio.plantrowth.domain.User;
import com.opinio.plantrowth.service.UserService;
import lombok.RequiredArgsConstructor;
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
    private final UserService userService;
    private final JwtTokenProvider jwtTokenProvider;
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

    @PostMapping("/api/auth/join")
    public ResponseEntity join(@RequestBody JoinDTO user){
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
   @PostMapping("/api/auth/login")
    public ResponseEntity<?> login(HttpServletResponse response, @RequestBody LoginDTO user){
        User member = userService.login(user);
        Message message = new Message();
        HttpHeaders headers = new HttpHeaders();
        String token = jwtTokenProvider.createToken(member.getName(), member.getRoles());
        response.setHeader("Authorization", token);
        return  ResponseEntity.ok().body("로그인 성공");
    }

    @PostMapping("/api/auth/kakao")
    public ResponseEntity<Message> kakaoLogin(@RequestBody KakaoDTO user){
        Long result = userService.kakaoLogin(user);
        Message message = new Message();
        HttpHeaders headers = new HttpHeaders();
        headers.setContentType(new MediaType("application", "json", Charset.forName("UTF-8")));
        message.setStatus(Message.StatusEnum.OK);
        message.setMessage("카카오 로그인 성공");
        message.setData(result);
        return new ResponseEntity<>(message, headers, HttpStatus.OK);
    }
    @GetMapping("/api/user/{user-id}")
    public ResponseEntity<?> lookUpUser(@PathVariable("user-id") Long id){
       User member = userService.findUser(id);
       UserLookUpDTO user = new UserLookUpDTO();
       user.setUser_name(member.getName());
       user.setUser_birth(member.getBirth());
       user.setEmail(member.getEmail());
       user.setPoint(member.getPoint());
       user.setPlantNum(member.getPlantNum());
       user.setMaxPlantNum(member.getMaxPlantNum());
       Message message = new Message();
       HttpHeaders headers = new HttpHeaders();
       headers.setContentType(new MediaType("application", "json", Charset.forName("UTF-8")));
       message.setStatus(Message.StatusEnum.OK);
       message.setMessage("회원 조회 성공");
       message.setData(user);

       return new ResponseEntity<>(message, headers, HttpStatus.OK);
    }
    @PutMapping("/api/user/{user-id}")
    public ResponseEntity<?> updateUser(@PathVariable("user-id") Long id, @RequestBody UserUpdateDTO user){
       userService.updateUser(id, user);
       Message message = new Message();
       HttpHeaders headers = new HttpHeaders();
       headers.setContentType(new MediaType("application", "json", Charset.forName("UTF-8")));
       message.setStatus(Message.StatusEnum.OK);
       message.setMessage("회원 정보가 수정되었습니다.");
       message.setData(user);

       return new ResponseEntity<>(message, headers, HttpStatus.OK);
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

