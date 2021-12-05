package com.opinio.plantrowth.api.dto.auth;

import lombok.Getter;
import lombok.Setter;

@Getter
@Setter
public class KakaoDTO {
    private String email;
    private String accessToken;
    private String refreshToken;
}
