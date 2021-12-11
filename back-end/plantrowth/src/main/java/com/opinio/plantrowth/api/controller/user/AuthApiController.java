package com.opinio.plantrowth.api.controller.user;

import java.nio.charset.Charset;

import javax.servlet.http.HttpServletResponse;
import javax.validation.Valid;

import org.springframework.http.HttpHeaders;
import org.springframework.http.HttpStatus;
import org.springframework.http.MediaType;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RestController;

import com.opinio.plantrowth.api.dto.auth.JoinDTO;
import com.opinio.plantrowth.api.dto.auth.KakaoDTO;
import com.opinio.plantrowth.api.dto.auth.LoginDTO;
import com.opinio.plantrowth.api.dto.auth.checkPasswordDTO;
import com.opinio.plantrowth.api.dto.auth.checkUserDTO;
import com.opinio.plantrowth.config.security.JwtTokenProvider;
import com.opinio.plantrowth.api.dto.Message;
import com.opinio.plantrowth.domain.user.User;
import com.opinio.plantrowth.service.user.AuthService;
import com.opinio.plantrowth.service.user.UserService;

import lombok.RequiredArgsConstructor;

@RequiredArgsConstructor
@RestController
public class AuthApiController {

	private final JwtTokenProvider jwtTokenProvider;
	private final UserService userService;
	private final AuthService authService;

	@PostMapping("/api/auth/join")
	public ResponseEntity join(@RequestBody @Valid JoinDTO user) {
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
	public ResponseEntity<?> login(HttpServletResponse response, @RequestBody LoginDTO user) {
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
		String token = jwtTokenProvider.createToken(member.getEmail(), member.getRoles());
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

	@PostMapping("/api/auth/cp/{user-id}")
	public ResponseEntity<?> checkPassword(@PathVariable("user-id") Long id,
		@RequestBody checkPasswordDTO dto){
		boolean result = authService.checkPassword(id, dto);
		return result == true?
			ResponseEntity.ok().build():
			ResponseEntity.badRequest().build();
	}
	@PostMapping("/api/auth/cu")
	public ResponseEntity<?> checkUser(@RequestBody checkUserDTO dto){
		boolean result = authService.existName(dto.getUser_name());

		return !(result ==true)?
			ResponseEntity.ok().build():
			ResponseEntity.badRequest().build();
	}


}
