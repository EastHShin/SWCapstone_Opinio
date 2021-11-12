package com.opinio.plantrowth.api.dto.auth;

import lombok.Getter;

import java.time.LocalDate;

@Getter
public class UserUpdateDTO {
    private String user_name;
    private LocalDate user_birth;
    private String email;
    private String password;
}
