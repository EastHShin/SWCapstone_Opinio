package com.opinio.plantrowth.api.dto.auth;

import lombok.Getter;

@Getter
public class KakaoDTO {
    private String email;
    private String accessToken;
    private String refreshToken;
}
