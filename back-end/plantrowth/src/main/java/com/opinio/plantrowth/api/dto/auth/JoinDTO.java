package com.opinio.plantrowth.api.dto.auth;

import lombok.Getter;
import lombok.Setter;

import java.time.LocalDate;

@Getter
@Setter
public class JoinDTO {
    private String user_name;
    private LocalDate user_birth;
    private String email;
    private String password;
    private String fcm_access_token;
}
