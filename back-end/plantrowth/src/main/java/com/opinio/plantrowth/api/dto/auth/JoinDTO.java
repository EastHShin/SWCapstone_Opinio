package com.opinio.plantrowth.api.dto.auth;

import lombok.Getter;
import lombok.Setter;

import java.time.LocalDate;

import javax.validation.constraints.NotBlank;
import javax.validation.constraints.NotEmpty;

@Getter
@Setter
public class JoinDTO {
    private String user_name;
    private LocalDate user_birth;
    @NotBlank
    private String email;
    @NotBlank
    private String password;
    private String fcm_access_token;
}
