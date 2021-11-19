package com.opinio.plantrowth.api.dto.auth;

import lombok.Getter;
import lombok.Setter;

@Getter
@Setter
public class TokenDTO {
    private String access_token;
    private String refresh_token;
}
