package com.opinio.plantrowth.api.dto;

import lombok.Getter;

import java.time.LocalDate;

@Getter
public class JoinDTO {
    private String user_name;
    private LocalDate user_birth;
    private String email;
    private String password;

}
