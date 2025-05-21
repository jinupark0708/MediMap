package com.medimap.config;

import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.security.config.annotation.web.configuration.EnableWebSecurity;
import org.springframework.security.web.SecurityFilterChain;
import org.springframework.security.config.annotation.web.builders.HttpSecurity;

@Configuration
@EnableWebSecurity
public class SecurityConfig {

    @Bean
    public SecurityFilterChain securityFilterChain(HttpSecurity http) throws Exception {
        http
                .authorizeHttpRequests(auth -> auth
                        .requestMatchers(
                                "/h2-console/**",
                                "/api/login",
                                "/api/register",
                                "/api/users/me",
                                "/api/recommendation/**" // ✅ 증상 기반 추천 허용
                        ).permitAll()
                        .anyRequest().permitAll()
                )
                .formLogin(form -> form
                        .loginPage("/login.html")
                        .loginProcessingUrl("/perform_login")
                        .defaultSuccessUrl("/main.html", true)
                        .permitAll()
                )
                .logout(logout -> logout
                        .logoutSuccessUrl("/login.html")
                        .permitAll()
                )
                .headers(headers -> headers
                        .frameOptions(frame -> frame.sameOrigin())
                )
                .csrf(csrf -> csrf
                        .ignoringRequestMatchers(
                                "/h2-console/**",
                                "/api/login",
                                "/api/register",
                                "/api/users/me",
                                "/api/recommendation/**" // ✅ CSRF 예외 추가
                        )
                );

        return http.build();
    }
}