package com.opinio.plantrowth.config;


import com.opinio.plantrowth.config.security.JwtAuthenticationFilter;
import com.opinio.plantrowth.config.security.JwtTokenProvider;
import lombok.RequiredArgsConstructor;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.config.annotation.web.builders.HttpSecurity;
import org.springframework.security.config.annotation.web.configuration.EnableWebSecurity;
import org.springframework.security.config.annotation.web.configuration.WebSecurityConfigurerAdapter;
import org.springframework.security.config.http.SessionCreationPolicy;
import org.springframework.security.crypto.factory.PasswordEncoderFactories;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.security.web.authentication.UsernamePasswordAuthenticationFilter;

@RequiredArgsConstructor
@EnableWebSecurity
@Configuration
public class WebSecurityConfig extends WebSecurityConfigurerAdapter{

  private final JwtTokenProvider jwtTokenProvider ;
  private final JwtAuthenticationEntryPoint jwtAuthenticationEntryPoint;
  private final JwtAccessDeniedHandler jwtAccessDeniedHandler;

  //암호화에 필요한 passwordencoder를 bean등록
//  @Bean
//  public PasswordEncoder passwordEncoder(){
//    return PasswordEncoderFactories.createDelegatingPasswordEncoder();
//  }

  //authenticationManager bean등록
  @Bean
  @Override
  public AuthenticationManager authenticationManagerBean() throws Exception{
    return super.authenticationManagerBean();
  }
  @Override
  protected void configure(HttpSecurity http) throws Exception{
    http.httpBasic().disable() //기본설정 해제
            .csrf().disable() //csrf 보안토큰 해제
            .sessionManagement().sessionCreationPolicy(SessionCreationPolicy.STATELESS)
            .and()
            .authorizeRequests()
            .antMatchers("/admin/**").hasRole("ADMIN")
            .antMatchers("/user/**").hasRole("USER")
            .antMatchers("/api/auth/**", "/api/community", "/api/community/**").permitAll()
            .anyRequest().authenticated()
            .and()
            .addFilterBefore(new JwtAuthenticationFilter(jwtTokenProvider),
                    UsernamePasswordAuthenticationFilter.class);
    http.sessionManagement()
            .maximumSessions(1) //세션 최대 허용수
            .maxSessionsPreventsLogin(false); // 중복 로그인하면 이전 로그인이 풀림
  }

  @Bean
  public PasswordEncoder passwordEncoder(){
    return PasswordEncoderFactories.createDelegatingPasswordEncoder();
  }
}