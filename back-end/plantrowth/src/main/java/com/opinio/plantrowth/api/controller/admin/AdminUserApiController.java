package com.opinio.plantrowth.api.controller.admin;

import com.opinio.plantrowth.api.dto.Message;
import com.opinio.plantrowth.api.dto.admin.AdminJoinDto;
import com.opinio.plantrowth.api.dto.admin.AdminUserLookUpDto;
import com.opinio.plantrowth.api.dto.admin.AdminUserUpdateDto;
import com.opinio.plantrowth.api.dto.user.UserUpdateDTO;
import com.opinio.plantrowth.domain.user.User;
import com.opinio.plantrowth.service.user.AuthService;
import com.opinio.plantrowth.service.user.UserService;
import lombok.Getter;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpHeaders;
import org.springframework.http.HttpStatus;
import org.springframework.http.RequestEntity;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RequiredArgsConstructor
@RestController
@CrossOrigin(origins = "*", allowedHeaders = "*")
public class AdminUserApiController {

    private final UserService userService;
    private final AuthService authService;
    private String code = "plantrowth";

    @PostMapping("/api/auth/admin/join")
    public ResponseEntity adminJoin(@RequestBody AdminJoinDto dto){
        Message message = new Message();
        HttpHeaders headers = new HttpHeaders();
        if(dto.getCode()==code){
            message.setMessage("잘못된 관리자 코드");
            message.setStatus(Message.StatusEnum.NOT_ACCEPTABLE);
            return new ResponseEntity<>(message, headers, HttpStatus.NOT_ACCEPTABLE);
        }
        Long result = authService.adminJoin(dto);
        message.setMessage("회원가입 성공");
        message.setStatus(Message.StatusEnum.OK);
        message.setData(result);
        return new ResponseEntity<>(message, headers, HttpStatus.OK);
    }
    @GetMapping("/api/admin/user/{user-id}")
    public ResponseEntity getUserInfo(@PathVariable("user-id")Long userId){
        User user = userService.findUser(userId);
        AdminUserLookUpDto member = new AdminUserLookUpDto(user);
        Message message = new Message();
        message.setMessage("회원정보 조회");
        message.setData(member);
        message.setStatus(Message.StatusEnum.OK);
        HttpHeaders headers = new HttpHeaders();
        return new ResponseEntity<>(message, headers, HttpStatus.OK);
    }
    @PutMapping("/api/admin/user/{user-id}")
    public ResponseEntity updateUserInfo(@PathVariable("user-id") Long userId,
                                         @RequestBody AdminUserUpdateDto dto){
        User user = userService.adminUpdateUser(userId, dto);
        AdminUserLookUpDto updatedUser = new AdminUserLookUpDto(user);
        Message message = new Message();
        message.setMessage("회원정보 변경");
        message.setData(updatedUser);
        message.setStatus(Message.StatusEnum.OK);
        HttpHeaders headers = new HttpHeaders();
        return new ResponseEntity<>(message, headers, HttpStatus.OK);
    }

    @DeleteMapping("/api/admin/user/{user-id}")
    public ResponseEntity deleteUser(@PathVariable("user-id")Long userId){
        userService.deleteUser(userId);
        return ResponseEntity.ok().build();
    }

    @GetMapping("/api/admin/user")
    public ResponseEntity viewUser(){

        Message message = new Message();
        message.setMessage("회원리스트 조회");
        message.setData(1);
        message.setStatus(Message.StatusEnum.OK);
        HttpHeaders headers = new HttpHeaders();
        return new ResponseEntity<>(message, headers, HttpStatus.OK);
    }

}
