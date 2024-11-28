package com.example.demo.configuration;

import lombok.RequiredArgsConstructor;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.beans.factory.annotation.Configurable;
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
import org.springframework.security.oauth2.client.userinfo.DefaultOAuth2UserService;
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

@RequiredArgsConstructor
@EnableWebSecurity //스프링 시큐리티 필터가 스프링 필터체인에 등록됨
@Configurable
@Configuration
public class SecurityConfig {

    @Autowired
    private CustomUserDetailsService customUserDetailsService;

    @Autowired
    private JwtAuthenticationEntryPoint jwtAuthenticationEntryPoint;


    //Bean 주입
    @Qualifier("OAuth2UserServiceImpl")
    private final DefaultOAuth2UserService oAuth2UserService;

    @Bean
    public SecurityFilterChain securityFilterChain(HttpSecurity http, JwtProps jwtProps,
                                                   @Qualifier("customOAuth2UserService") OAuth2UserService<OAuth2UserRequest, OAuth2User> oAuth2UserService,
                                                   @Qualifier("customUserDetailsService") UserDetailsService userDetailsService) throws Exception {
        http
                .csrf(csrf -> csrf.disable())
                .authorizeHttpRequests(authorize -> authorize
                        // .requestMatchers("/api/user/join", "/api/user/login").permitAll()
                        // //api/user/coupons, store 이걸 넣어도 되도록
                        .requestMatchers("/api/store/**").permitAll() // 상품 목록 조회는 인증 없이 허용
                        .requestMatchers("/api/user/**", "/api/admin/**").permitAll()
                        // .requestMatchers("/api/user/**").permitAll()
                        .requestMatchers("/api/admin/**").hasRole("ADMIN") // ADMIN 권한 명시
                        .requestMatchers("/api/user/oauth2/**").permitAll() //oauth2설정. 테스트 하는동안 permitAll
                        .anyRequest().authenticated()) // 나머지 경로는 인증 필요
                //OAuth2 소셜로그인 설정
                .oauth2Login(oauth2 -> oauth2
                        .redirectionEndpoint(endpoint -> endpoint.baseUri("http://localhost:8080/api/oauth2/callback/*"))
                        .userInfoEndpoint(endpoint -> endpoint.userService(oAuth2UserService))
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

    //Kakao 로그인 설정(자동설정이 안되서 임시로 수동 삽입)
//    @Bean
//    public ClientRegistrationRepository clientRegistrationRepository() {
//        // Kakao ClientRegistration 설정
//        ClientRegistration kakao = ClientRegistration.withRegistrationId("kakao")
//                .clientId("714a575754949434c7f9e10bb527da9a")
//                .clientSecret("zAQRGb72z0JexxUESus4CMGV90BYP4Rs")
//                .redirectUri("http://localhost:8080/api/user/oauth2/callback/kakao")
//                .authorizationUri("https://kauth.kakao.com/oauth/authorize")
//                .tokenUri("https://kauth.kakao.com/oauth/token")
//                .userInfoUri("https://kapi.kakao.com/v2/user/me")
//                .userNameAttributeName("id")
//                .clientName("Kakao")
//                .authorizationGrantType(new AuthorizationGrantType("authorization_code"))
//                .scope("profile_nickname", "profile_image")
//                .build();
//
//        return new InMemoryClientRegistrationRepository(kakao);
//    }

    //OAuth2 인증 후 사용자 정보를 저장할 메서드
    @Bean
    public OAuth2UserService<OAuth2UserRequest, OAuth2User> oAuth2UserService(@Qualifier("OAuth2UserServiceImpl") DefaultOAuth2UserService oAuth2UserService){
        return new CustomOAuth2UserService();
    }
}