package com.opinio.plantrowth.api.dto.user;

import lombok.Getter;

import java.time.LocalDate;

@Getter
public class UserUpdateDTO {
    private String user_name;
    private LocalDate user_birth;
}
