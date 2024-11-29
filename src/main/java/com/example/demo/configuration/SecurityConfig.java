package com.example.demo.configuration;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.beans.factory.annotation.Qualifier;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.security.config.annotation.web.builders.HttpSecurity;
import org.springframework.security.core.userdetails.UserDetailsService;
import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.security.web.SecurityFilterChain;
import org.springframework.security.web.authentication.UsernamePasswordAuthenticationFilter;
import org.springframework.web.cors.CorsConfiguration;
import org.springframework.web.cors.CorsConfigurationSource;
import org.springframework.web.cors.UrlBasedCorsConfigurationSource;

import com.example.demo.jwt.exception.JwtAuthenticationEntryPoint;
import com.example.demo.jwt.filter.JwtAuthenticationFilter;
import com.example.demo.jwt.prop.JwtProps;
import com.example.demo.jwt.security.CustomUserDetailsService;

@Configuration
public class SecurityConfig {

        @Autowired
        private CustomUserDetailsService customUserDetailsService;

        @Autowired
        private JwtAuthenticationEntryPoint jwtAuthenticationEntryPoint;

        @Bean
        public SecurityFilterChain securityFilterChain(HttpSecurity http, JwtProps jwtProps,
                        @Qualifier("customUserDetailsService") UserDetailsService userDetailsService) throws Exception {
                http
                                .csrf(csrf -> csrf.disable())
                                .authorizeHttpRequests(authorize -> authorize
                                                        .requestMatchers("/api/user/**", "/api/admin/**", "/api/store/**")
                                                        .permitAll()
                                                // .requestMatchers("/api/user/join", "/api/user/login").permitAll()
                                                // //api/user/coupons, store 이걸 넣어도 되도록
                                                //.requestMatchers("/api/auth/**").permitAll()   // 인증 관련 API는 모두 허용 추가_김성찬
                                                // .requestMatchers("/api/admin/**").hasRole("ADMIN") // ADMIN 권한 명시
                                                // .requestMatchers("/api/**").permitAll()
                                                .anyRequest().authenticated()) // 나머지 경로는 인증 필요
                                .exceptionHandling(exception -> exception
                                                .authenticationEntryPoint(jwtAuthenticationEntryPoint))
                                .addFilterBefore(new JwtAuthenticationFilter(jwtProps, customUserDetailsService),
                                                UsernamePasswordAuthenticationFilter.class);

                return http.build();
        }

        @Bean
        public PasswordEncoder passwordEncoder() {
                return new BCryptPasswordEncoder();
        }

        // 클라이언트 주소 허용 추가 에러 수정용 _김성찬 24.11.28 07:18
        @Bean
        public CorsConfigurationSource corsConfigurationSource() {
                CorsConfiguration configuration = new CorsConfiguration();
                configuration.addAllowedOrigin("http://localhost:5173");
                configuration.addAllowedMethod("*");
                configuration.addAllowedHeader("*");
                configuration.setAllowCredentials(true);

                UrlBasedCorsConfigurationSource source = new UrlBasedCorsConfigurationSource();
                source.registerCorsConfiguration("/api/**", configuration);
                return source;
        }

}