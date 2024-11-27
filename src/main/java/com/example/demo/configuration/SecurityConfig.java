package com.example.demo.configuration;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.beans.factory.annotation.Qualifier;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.security.config.annotation.web.builders.HttpSecurity;
import org.springframework.security.config.annotation.web.configuration.EnableWebSecurity;
import org.springframework.security.core.userdetails.UserDetailsService;
import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.security.oauth2.client.registration.ClientRegistration;
import org.springframework.security.oauth2.client.registration.ClientRegistrationRepository;
import org.springframework.security.oauth2.client.registration.InMemoryClientRegistrationRepository;
import org.springframework.security.oauth2.client.userinfo.OAuth2UserRequest;
import org.springframework.security.oauth2.client.userinfo.OAuth2UserService;
import org.springframework.security.oauth2.core.AuthorizationGrantType;
import org.springframework.security.oauth2.core.user.OAuth2User;
import org.springframework.security.web.SecurityFilterChain;
import org.springframework.security.web.authentication.UsernamePasswordAuthenticationFilter;

import com.example.demo.jwt.exception.JwtAuthenticationEntryPoint;
import com.example.demo.jwt.filter.JwtAuthenticationFilter;
import com.example.demo.jwt.prop.JwtProps;
import com.example.demo.jwt.security.CustomUserDetailsService;
@EnableWebSecurity
@Configuration
public class SecurityConfig {

    @Autowired
    private CustomUserDetailsService customUserDetailsService;

    @Autowired
    private JwtAuthenticationEntryPoint jwtAuthenticationEntryPoint;

//    Spring Security 5.7 이상 버전에서는 WebSecurityConfigurerAdapter가 Deprecated되었고,
//    대신 **SecurityFilterChain**을 사용하는 방식으로 변경
    @Bean
    public SecurityFilterChain securityFilterChain(HttpSecurity http, JwtProps jwtProps, @Qualifier("customUserDetailsService") UserDetailsService userDetailsService) throws Exception {
        http
                .csrf(csrf -> csrf.disable())
                .authorizeHttpRequests(authorize -> authorize
//                        .requestMatchers("/api/user/join", "/api/user/login").permitAll()
                        .requestMatchers("/api/**").permitAll()
                        .anyRequest().authenticated())
                .oauth2Login(oauth2 -> oauth2
                        .redirectionEndpoint(endpoint ->endpoint.baseUri("http://localhost:8080/api/user/oauth2/callback/*"))
                )
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

    @Bean
    public OAuth2UserService<OAuth2UserRequest, OAuth2User> oAuth2UserService(){
        return new CustomOAuth2UserService();
    }

    @Bean
    public ClientRegistrationRepository clientRegistrationRepository() {
        // Kakao ClientRegistration 설정
        ClientRegistration kakao = ClientRegistration.withRegistrationId("kakao")
                .clientId("714a575754949434c7f9e10bb527da9a")
                .clientSecret("zAQRGb72z0JexxUESus4CMGV90BYP4Rs")
                .redirectUri("http://localhost:8080/api/user/oauth2/callback/kakao")
                .authorizationUri("https://kauth.kakao.com/oauth/authorize")
                .tokenUri("https://kauth.kakao.com/oauth/token")
                .userInfoUri("https://kapi.kakao.com/v2/user/me")
                .userNameAttributeName("id")
                .clientName("Kakao")
                .authorizationGrantType(new AuthorizationGrantType("authorization_code"))
                .scope("profile_nickname", "profile_image")
                .build();

        return new InMemoryClientRegistrationRepository(kakao);
    }
}
