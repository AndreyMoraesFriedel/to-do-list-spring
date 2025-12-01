package com.IFC.BCC2025.to_do_list.config;

import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.security.config.annotation.web.builders.HttpSecurity;
import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.security.web.SecurityFilterChain;

@Configuration
public class SecurityConfig {

    @Bean
    public SecurityFilterChain filterChain(HttpSecurity http) throws Exception {
        http
            .csrf(csrf -> csrf.disable()) 
            .authorizeHttpRequests(auth -> auth

                .requestMatchers("/api/**").permitAll()

                .requestMatchers("/css/**", "/js/**", "/images/**").permitAll()

                .requestMatchers("/*.html").permitAll()
                
                .requestMatchers("/error").permitAll() 

                .anyRequest().authenticated()
            )
            .formLogin(form -> form
                .loginPage("/LoginPage.html") 
                .permitAll()
            )
            .logout(logout -> logout.permitAll());

        return http.build();
    }

    @Bean
    public PasswordEncoder passwordEncoder() {
        return new BCryptPasswordEncoder();
    }
}