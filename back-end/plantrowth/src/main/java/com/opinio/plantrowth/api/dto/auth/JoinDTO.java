package com.opinio.plantrowth.api.dto.auth;

import com.opinio.plantrowth.domain.user.User;
import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

import java.time.LocalDate;

@Getter
@AllArgsConstructor
@NoArgsConstructor
@Setter
public class JoinDTO {
    private String user_name;
    private LocalDate user_birth;
    private String email;
    private String password;
    private String fcm_access_token;
    public JoinDTO(User user){
        user_name = user.getUsername();
        user_birth = user.getBirth();
        email = user.getEmail();
        password = user.getPassword();
    }
}
