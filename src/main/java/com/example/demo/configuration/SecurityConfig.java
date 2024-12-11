package com.example.demo.configuration;

import com.example.demo.jwt.filter.JwtAuthenticationFilter;
import com.example.demo.security.handler.CustomOAuth2UserService;
import com.example.demo.security.handler.CustomAuthenticationSuccessHandler;

import java.util.Arrays;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.core.Ordered;
import org.springframework.core.annotation.Order;
import org.springframework.http.MediaType;
import org.springframework.security.config.Customizer;
import org.springframework.security.config.annotation.web.builders.HttpSecurity;
import org.springframework.security.config.annotation.web.configuration.EnableWebSecurity;
import org.springframework.security.config.http.SessionCreationPolicy;
import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.security.oauth2.client.authentication.OAuth2AuthenticationToken;
import org.springframework.security.oauth2.client.userinfo.OAuth2UserRequest;
import org.springframework.security.oauth2.client.userinfo.OAuth2UserService;
import org.springframework.security.oauth2.client.web.AuthorizationRequestRepository;
import org.springframework.security.oauth2.client.web.HttpSessionOAuth2AuthorizationRequestRepository;
import org.springframework.security.oauth2.client.web.HttpSessionOAuth2AuthorizedClientRepository;
import org.springframework.security.oauth2.client.web.OAuth2AuthorizedClientRepository;
import org.springframework.security.oauth2.core.AuthorizationGrantType;
import org.springframework.security.oauth2.core.user.OAuth2User;
import org.springframework.security.oauth2.server.authorization.client.InMemoryRegisteredClientRepository;
import org.springframework.security.oauth2.server.authorization.client.RegisteredClient;
import org.springframework.security.oauth2.server.authorization.client.RegisteredClientRepository;
import org.springframework.security.oauth2.server.authorization.config.annotation.web.configuration.OAuth2AuthorizationServerConfiguration;
import org.springframework.security.oauth2.server.authorization.config.annotation.web.configurers.OAuth2AuthorizationServerConfigurer;
import org.springframework.security.oauth2.server.authorization.settings.AuthorizationServerSettings;
import org.springframework.security.web.SecurityFilterChain;
import org.springframework.security.web.authentication.LoginUrlAuthenticationEntryPoint;
import org.springframework.security.web.util.matcher.MediaTypeRequestMatcher;
import org.springframework.web.client.RestTemplate;
import org.springframework.web.cors.CorsConfiguration;
import org.springframework.web.cors.CorsConfigurationSource;
import org.springframework.web.cors.UrlBasedCorsConfigurationSource;
import org.springframework.http.HttpMethod; // HTTP 메서드 사용
import org.springframework.security.web.authentication.AuthenticationSuccessHandler;
import org.springframework.security.web.authentication.UsernamePasswordAuthenticationFilter;

@Configuration
@EnableWebSecurity
public class SecurityConfig {
    @Autowired
    private JwtAuthenticationFilter jwtAuthenticationFilter;

    @Bean
    public PasswordEncoder passwordEncoder() {
        return new BCryptPasswordEncoder();
    }

    @Bean
    @Order(Ordered.HIGHEST_PRECEDENCE)
    public SecurityFilterChain authorizationServer(HttpSecurity http) throws Exception {
        // OAuth2 Authorization Server 기본 설정 적용 기본 인증 서버
        OAuth2AuthorizationServerConfiguration.applyDefaultSecurity(http);
        System.out.println(OAuth2AuthenticationToken.class.getName());
        // OpenID Connect (OIDC) 설정 추가
        http
                .getConfigurer(OAuth2AuthorizationServerConfigurer.class)
                .oidc(Customizer.withDefaults()); // OIDC 활성화
        // HTML 요청에 대한 기본 인증 엔트리포인트 설정
        http
                .exceptionHandling((exceptions) -> exceptions
                        .defaultAuthenticationEntryPointFor(
                                new LoginUrlAuthenticationEntryPoint("/login"),
                                new MediaTypeRequestMatcher(MediaType.TEXT_HTML)
                        )
                );

        return http.build();
    }

    @Bean
    public SecurityFilterChain filterChain(HttpSecurity http) throws Exception {
        http
                .csrf(csrf -> csrf.disable())
                .cors(cors -> cors.configurationSource(corsConfigurationSource())) // CORS 설정 추가
                .authorizeHttpRequests(auth -> auth
                        .requestMatchers(HttpMethod.OPTIONS, "/**", "/favicon.ico").permitAll() // OPTIONS 요청 허용
                        .requestMatchers("/api/user/login", "/api/user/join", "/api/auth/token/refresh", "/api/admin/**", "/api/user/**").permitAll()
                        .anyRequest().authenticated()
                )
                .addFilterBefore(jwtAuthenticationFilter, UsernamePasswordAuthenticationFilter.class) // JWT 필터 추가
                .sessionManagement(session -> session
                        .sessionCreationPolicy(SessionCreationPolicy.STATELESS)
                );

        return http.build();
    }


    @Bean
    public AuthorizationServerSettings authorizationServerSettings() {
        return AuthorizationServerSettings.builder()
                .issuer("http://localhost:5173")
                .authorizationEndpoint("/oauth2/v1/authorize")
                .tokenEndpoint("/oauth2/v1/token")
                .tokenIntrospectionEndpoint("/oauth2/v1/introspect") // 토큰 상태 확인
                .tokenRevocationEndpoint("/oauth2/v1/revoke") // 토큰 폐기 (RFC 7009)
                .jwkSetEndpoint("/oauth2/v1/jwks") // 공개키 확인
                .oidcLogoutEndpoint("/connect/v1/logout")
                .oidcUserInfoEndpoint("/connect/v1/userinfo") // 리소스 서버와 유저 정보 연관
                .oidcClientRegistrationEndpoint("/connect/v1/register") // OAuth2 사용 신청
                .build();
    }

    @Bean
    public CorsConfigurationSource corsConfigurationSource() {
        CorsConfiguration configuration = new CorsConfiguration();
        configuration.setAllowedOrigins(Arrays.asList("http://localhost:5173"));
        configuration.setAllowedMethods(Arrays.asList("GET", "POST", "PUT", "DELETE", "OPTIONS"));
        configuration.setAllowedHeaders(Arrays.asList("Authorization", "Content-Type", "X-Requested-With"));
        configuration.addExposedHeader("Authorization");
        configuration.setAllowCredentials(true); // 쿠키 허용

        UrlBasedCorsConfigurationSource source = new UrlBasedCorsConfigurationSource();
        source.registerCorsConfiguration("/**", configuration);
        return source;
    }

    //Kakao 로그인 설정(자동설정이 안되서 임시로 수동 삽입, 스프링부트 2.0이상에선 자동생성이 안될수도 있다고함)
    //import org.springframework.security.oauth2.client.registration.ClientRegistrationRepository;
    //현재 위 import로 생성가능 yml설정과 동일.
    @Bean
    public RegisteredClientRepository registeredClientRepository() {
        // Kakao ClientRegistration 설정
        RegisteredClient kakao = RegisteredClient.withId("kakao")
                .clientId("6f5bc792a0f0199fd3df6a7dd153f1d7")
                .clientSecret("KWJn3264i3Tf7Ald26x5wqMox9aXMEEQ")
                .redirectUri("http://localhost:5173/api/user/oauth2/callback/kakao")
                .clientName("Kakao")
                .authorizationGrantType(AuthorizationGrantType.AUTHORIZATION_CODE)
                .authorizationGrantType(AuthorizationGrantType.REFRESH_TOKEN)
                .scope("profile_nickname")
                .build();

        RegisteredClient google = RegisteredClient.withId("google")
                .clientId("679990079220-prfchh4nd9k9oit85na1guc84jk6pjje.apps.googleusercontent.com")
                .clientSecret("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")
                .redirectUri("http://localhost:5173/api/user/oauth2/callback/google")
                .authorizationGrantType(new AuthorizationGrantType("authorization_code"))
                .scope("profile")
                .build();

        return new InMemoryRegisteredClientRepository(kakao, google);
    }

    //OAuth2 인증 후 사용자 정보를 저장할 메서드
    @Bean
    public OAuth2UserService<OAuth2UserRequest, OAuth2User> oAuth2UserService() {
        return new CustomOAuth2UserService();
    }

    //클라이언트 인증 정보를 세션에 저장
    //OAuth2 인증 사용하는 App에선 정상작동, 다만 Stateless 방식에선 사용 X 라고 함
    @Bean
    public OAuth2AuthorizedClientRepository authorizedClientRepository() {
        return new HttpSessionOAuth2AuthorizedClientRepository();
    }

    // 인증된 클라이언트 정보를 저장하는 레포지토리
    @Bean
    public AuthorizationRequestRepository authorizationRequestRepository() {
        return new HttpSessionOAuth2AuthorizationRequestRepository();
    }

    //로그인 성공시 호출 SecurityContext 저장관련
    @Bean
    public AuthenticationSuccessHandler successHandler() {
        System.out.println("계속 들어와?");
        return new CustomAuthenticationSuccessHandler();  // Custom handler에서 SecurityContext 설정
    }

    @Bean
    public RestTemplate restTemplate() {
        return new RestTemplate();
    }
}