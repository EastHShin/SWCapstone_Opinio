package com.opinio.plantrowth.api.dto.auth;

import com.opinio.plantrowth.domain.user.User;
import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

import java.time.LocalDate;

import javax.validation.constraints.NotBlank;
import javax.validation.constraints.NotEmpty;

@Getter
@AllArgsConstructor
@NoArgsConstructor
@Setter
public class JoinDTO {
    private String user_name;
    private LocalDate user_birth;
    @NotBlank
    private String email;
    @NotBlank
    private String password;
    private String fcm_access_token;
    public JoinDTO(User user){
        user_name = user.getUsername();
        user_birth = user.getBirth();
        email = user.getEmail();
        password = user.getPassword();
    }
}
