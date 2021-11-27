package com.opinio.plantrowth.api.dto.user;

import lombok.Getter;
import lombok.Setter;

import java.time.LocalDate;

@Getter
@Setter
public class adminUserLookupDTO {
    private Long id;
    private String name;
    private LocalDate birth;
    private String email;
    private Integer point;
    private Integer plantNum;
    private Integer maxPlantNum;
    private String FCMAccessToken;
}
