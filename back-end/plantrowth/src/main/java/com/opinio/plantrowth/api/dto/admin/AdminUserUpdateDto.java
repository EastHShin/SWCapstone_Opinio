package com.opinio.plantrowth.api.dto.admin;


import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
public class AdminUserUpdateDto {
    private String name;
    private String email;
    private Integer point;
    private Integer maxPlantNum;
    private Boolean subscription;
}
