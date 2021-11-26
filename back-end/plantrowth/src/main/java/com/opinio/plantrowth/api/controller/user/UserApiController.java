package com.opinio.plantrowth.api.controller.user;


import com.opinio.plantrowth.api.dto.auth.checkPasswordDTO;
import com.opinio.plantrowth.api.dto.user.UserLookUpDTO;
import com.opinio.plantrowth.api.dto.user.UserUpdateDTO;
import com.opinio.plantrowth.api.dto.user.addPlantDTO;
import com.opinio.plantrowth.config.security.JwtTokenProvider;
import com.opinio.plantrowth.api.dto.Message;
import com.opinio.plantrowth.service.user.AuthService;
import com.opinio.plantrowth.service.user.UserPointService;
import com.opinio.plantrowth.service.user.UserService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpHeaders;
import org.springframework.http.HttpStatus;
import org.springframework.http.MediaType;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.nio.charset.Charset;
import java.util.HashMap;
import java.util.Map;

@RequiredArgsConstructor
@RestController
@CrossOrigin(origins = "*", allowedHeaders = "*")
public class UserApiController {
    private final JwtTokenProvider jwtTokenProvider;
    private final UserService userService;
    private final AuthService authService;
    private final UserPointService userPointService;
    private final Integer decreasingPoint = 50;


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
        UserUpdateDTO updatedUser = userService.updateUser(id, user);
        Message message = new Message();
        HttpHeaders headers = new   HttpHeaders();
        headers.setContentType(new MediaType("application", "json", Charset.forName("UTF-8")));
        message.setStatus(Message.StatusEnum.OK);
        message.setMessage("회원 정보가 수정되었습니다.");
        message.setData(updatedUser);

        return new ResponseEntity<>(message, headers, HttpStatus.OK);
    }

    @DeleteMapping("/api/user/{user-id}")
    public ResponseEntity<?> deleteUser(@PathVariable("user-id") Long id,
        @RequestBody checkPasswordDTO dto) {
        if(!(authService.checkPassword(id, dto))){
            return ResponseEntity.badRequest().build();
        }
        Long result = userService.deleteUser(id);
        return result != null ?
            ResponseEntity.ok().body("회원 탈퇴 성공") :
            ResponseEntity.badRequest().build();
    }


    @PostMapping("/api/users/profiles/{user-id}")
    public ResponseEntity<?> addPlant(@PathVariable("user-id") Long id){
        addPlantDTO dto = userService.addPlant(userPointService.decreasePoint(id, decreasingPoint).getId());
        Message message = new Message();
        HttpHeaders headers = new HttpHeaders();
        headers.setContentType(new MediaType("application", "json", Charset.forName("UTF-8")));
        message.setStatus(Message.StatusEnum.OK);
        message.setMessage("프로필 개수 추가");
        message.setData(dto);

        return new ResponseEntity<>(message, headers, HttpStatus.OK);
    }


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