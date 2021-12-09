package com.opinio.plantrowth.api.dto.admin;


import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

@NoArgsConstructor
@AllArgsConstructor
@Setter
@Getter
public class AdminJoinDto {
    private String name;
    private String id;
    private String password;
    private String code;
}
