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

    private OAuth2UserServiceImpl oAuth2UserServiceImpl;

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
                        .clientRegistrationRepository((clientRegistrationRepository)) //OAuth2 공급자 설정
                        .authorizedClientRepository(authorizedClientRepository()) //클라이언트 정보 설정
                        .userInfoEndpoint(endpoint -> endpoint.userService(oAuth2UserService))
                        .redirectionEndpoint(endpoint -> endpoint.baseUri("http://localhost:5173/api/user/oauth2/callback/kakao"))
                        .successHandler(successHandler())) //로그인 성공 후, custom success handler 사용

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
                // JWT 필터를 OAuth2 인증 후에 추가
                .addFilterBefore(new JwtAuthenticationFilter(jwtProps, customUserDetailsService), OAuth2LoginAuthenticationFilter.class)
                // UsernamePasswordAuthenticationFilter 필터를 JWT 필터 후에 추가
                .addFilterBefore(new JwtAuthenticationFilter(jwtProps, customUserDetailsService), UsernamePasswordAuthenticationFilter.class);

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
//    }

    //OAuth2 인증 후 사용자 정보를 저장할 메서드
    @Bean
    public OAuth2UserService<OAuth2UserRequest, OAuth2User> oAuth2UserService(@Qualifier("OAuth2UserServiceImpl") DefaultOAuth2UserService oAuth2UserService) {
        return new CustomOAuth2UserService();
    }

    @Bean
    public OAuth2AuthorizedClientRepository authorizedClientRepository() {
        return new HttpSessionOAuth2AuthorizedClientRepository();
    }

    @Bean
    public AuthenticationSuccessHandler successHandler() {
        System.out.println("securiity 들어와?");
        return new CustomAuthenticationSuccessHandler();  // Custom handler에서 SecurityContext 설정
    }


}