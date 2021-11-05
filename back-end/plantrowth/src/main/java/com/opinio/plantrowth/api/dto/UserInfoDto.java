package com.opinio.plantrowth.api.dto;

import lombok.Getter;
import lombok.Setter;

@Getter
@Setter
public class UserInfoDto {
  private String email;
  private String password;
  private String nickname;
  private String user_name;
  private String user_birth;
  private Integer point;
  private Integer plant_num;
  private Integer max_plant_num;
  private String auth;
}
