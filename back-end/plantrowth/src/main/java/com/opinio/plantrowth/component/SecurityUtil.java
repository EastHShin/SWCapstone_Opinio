package com.opinio.plantrowth.component;

import lombok.extern.slf4j.Slf4j;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContextHolder;

@Slf4j
public class SecurityUtil {
    private SecurityUtil(){}
    public static Long getCurrentMemberId(){
        final Authentication authentication = SecurityContextHolder.getContext().getAuthentication();
        if(authentication == null || authentication.getName()==null){
            throw new RuntimeException("Security에 정보 없음");
        }
        return Long.parseLong((authentication.getName()));
    }
}
