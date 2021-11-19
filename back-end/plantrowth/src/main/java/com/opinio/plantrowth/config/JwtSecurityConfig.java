package com.opinio.plantrowth.config;

import com.opinio.plantrowth.config.security.JwtAuthenticationFilter;
import com.opinio.plantrowth.config.security.JwtTokenProvider;
import lombok.RequiredArgsConstructor;
import org.springframework.security.config.annotation.SecurityConfigurerAdapter;
import org.springframework.security.config.annotation.web.builders.HttpSecurity;
import org.springframework.security.web.DefaultSecurityFilterChain;

@RequiredArgsConstructor
public class JwtSecurityConfig extends SecurityConfigurerAdapter
<DefaultSecurityFilterChain, HttpSecurity> {
    private final JwtTokenProvider jwtTokenProvider;

    @Override
    public void configure(HttpSecurity http){
        JwtAuthenticationFilter authenticationFilter = new JwtAuthenticationFilter(jwtTokenProvider);
        http.addFilterBefore(authenticationFilter, JwtAuthenticationFilter.class);
    }
}
