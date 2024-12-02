package com.example.demo.configuration;

import com.example.demo.security.handler.CustomAuthenticationSuccessHandler;
import com.example.demo.user.service.impl.OAuth2UserServiceImpl;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.beans.factory.annotation.Qualifier;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.security.config.annotation.web.builders.HttpSecurity;
import org.springframework.security.config.annotation.web.configuration.EnableWebSecurity;
import org.springframework.security.core.userdetails.UserDetailsService;
import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.security.oauth2.client.registration.ClientRegistrationRepository;
import org.springframework.security.oauth2.client.userinfo.DefaultOAuth2UserService;
import org.springframework.security.oauth2.client.userinfo.OAuth2UserRequest;
import org.springframework.security.oauth2.client.userinfo.OAuth2UserService;
import org.springframework.security.oauth2.client.web.HttpSessionOAuth2AuthorizedClientRepository;
import org.springframework.security.oauth2.client.web.OAuth2AuthorizedClientRepository;
import org.springframework.security.oauth2.client.web.OAuth2LoginAuthenticationFilter;
import org.springframework.security.oauth2.core.user.OAuth2User;
import org.springframework.security.web.SecurityFilterChain;
import org.springframework.security.web.authentication.AuthenticationSuccessHandler;
import org.springframework.security.web.authentication.UsernamePasswordAuthenticationFilter;
import org.springframework.web.client.RestTemplate;
import org.springframework.web.cors.CorsConfiguration;
import org.springframework.web.cors.CorsConfigurationSource;
import org.springframework.web.cors.UrlBasedCorsConfigurationSource;

import com.example.demo.jwt.exception.JwtAuthenticationEntryPoint;
import com.example.demo.jwt.filter.JwtAuthenticationFilter;
import com.example.demo.jwt.prop.JwtProps;
import com.example.demo.jwt.security.CustomUserDetailsService;

@Configuration
@EnableWebSecurity
public class SecurityConfig {

    @Autowired
    private CustomUserDetailsService customUserDetailsService;

    @Autowired
    private JwtAuthenticationEntryPoint jwtAuthenticationEntryPoint;

    //OAuth2UserService 설정
    private final DefaultOAuth2UserService oAuth2UserService;

    public SecurityConfig(DefaultOAuth2UserService oAuth2UserService) {
        this.oAuth2UserService = oAuth2UserService;
    }

    @Bean
    public SecurityFilterChain securityFilterChain(HttpSecurity http, JwtProps jwtProps,
                                                   @Qualifier("customUserDetailsService") UserDetailsService userDetailsService, ClientRegistrationRepository clientRegistrationRepository) throws Exception {
        http
                //OAuth2 소셜로그인 설정
                .oauth2Login(oauth2 -> oauth2
                        .clientRegistrationRepository((clientRegistrationRepository)) //OAuth2 공급자 설정 ex Kakao or Google
                        .authorizedClientRepository(authorizedClientRepository()) //인증된 클라이언트 정보를 저장하는 레포지토리
                        .userInfoEndpoint(endpoint -> endpoint.userService(oAuth2UserService)) // Spring Security. 참조해서 사용자 정보 API 호출 (Kakao의 경우 사용자 정보 URL은 https://kapi.kakao.com/v2/user/me)
                                                                                                // oAuth2UserService를 사용해서 사용자 정보를 매핑하고 로드함.
                        .redirectionEndpoint(endpoint -> endpoint.baseUri("http://localhost:5173/api/user/oauth2/callback/kakao"))
                        .successHandler(successHandler())) //로그인 후, success handler로 Security Context에 저장 해야하는데 안먹힘ㅜ 1 리다이렉트하면서 날라가거나, 2 저장로직이 제대로 안되거나

                .csrf(csrf -> csrf.disable())
                .authorizeHttpRequests(authorize -> authorize
                        .requestMatchers("/api/user/**", "/api/admin/**", "/api/store/**", "/api/**")
                        .permitAll()
                        // .requestMatchers("/api/user/join", "/api/user/login").permitAll()
                        // //api/user/coupons, store 이걸 넣어도 되도록
                        //.requestMatchers("/api/auth/**").permitAll()   // 인증 관련 API는 모두 허용 추가_김성찬
                        // .requestMatchers("/api/admin/**").hasRole("ADMIN") // ADMIN 권한 명시
                        // .requestMatchers("/api/**").permitAll()
                        .anyRequest().authenticated()) // 나머지 경로는 인증 필요
                .exceptionHandling(exception -> exception
                        .authenticationEntryPoint(jwtAuthenticationEntryPoint))
                .addFilterBefore(new JwtAuthenticationFilter(jwtProps, customUserDetailsService), OAuth2LoginAuthenticationFilter.class) // JWT 필터를 OAuth2 인증 필터보다 앞에 추가
                .addFilterBefore(new JwtAuthenticationFilter(jwtProps, customUserDetailsService), UsernamePasswordAuthenticationFilter.class); // JWT 필터를 UsernamePasswordAuthenticationFilter보다 앞에 추가


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

    //Kakao 로그인 설정(자동설정이 안되서 임시로 수동 삽입, 스프링부트 2.0이상에선 자동생성이 안될수도 있다고함)
    //import org.springframework.security.oauth2.client.registration.ClientRegistrationRepository;
    //현재 위 import로 생성가능 yml설정과 동일.
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
//        ClientRegistration google = ClientRegistration.withRegistrationId("google")
//                .clientId("679990079220-prfchh4nd9k9oit85na1guc84jk6pjje.apps.googleusercontent.com")
//                .clientSecret("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")
//                .redirectUri("http://localhost:8080/api/user/oauth2/callback/google")
//                .authorizationUri("https://accounts.google.com/o/oauth2/auth")
//                .authorizationGrantType(new AuthorizationGrantType("authorization_code"))
//                .tokenUri("https://oauth2.googleapis.com/token")
//                .userInfoUri("https://www.googleapis.com/oauth2/v3/userinfo")
//                .scope("profile", "email")
//                .build();
//
//        return new InMemoryClientRegistrationRepository(kakao, google);
//    }

    //OAuth2 인증 후 사용자 정보를 저장할 메서드
    @Bean
    public OAuth2UserService<OAuth2UserRequest, OAuth2User> oAuth2UserService(@Qualifier("OAuth2UserServiceImpl") DefaultOAuth2UserService oAuth2UserService) {
        return new CustomOAuth2UserService();
    }

    //클라이언트 인증 정보를 세션에 저장
    @Bean
    public OAuth2AuthorizedClientRepository authorizedClientRepository() {
        return new HttpSessionOAuth2AuthorizedClientRepository();
    }

    //로그인 성공시 호출 SecurityContext 저장관련
    @Bean
    public AuthenticationSuccessHandler successHandler() {
        return new CustomAuthenticationSuccessHandler();  // Custom handler에서 SecurityContext 설정
    }

    @Bean
    public RestTemplate restTemplate(){
        return new RestTemplate();
    }


}
