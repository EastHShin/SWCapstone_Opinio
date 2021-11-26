package com.opinio.plantrowth.api.dto.user;

import lombok.Getter;
import lombok.Setter;

import java.time.LocalDate;

@Getter
@Setter
public class UserUpdateDTO {
    private String user_name;
    private LocalDate user_birth;
}
