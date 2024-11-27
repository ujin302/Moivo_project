//package com.example.demo.configuration;
//
//import com.example.demo.jwt.filter.JwtAuthenticationFilter;
//import com.example.demo.jwt.prop.JwtProps;
//import lombok.RequiredArgsConstructor;
//import org.springframework.beans.factory.annotation.Configurable;
//import org.springframework.beans.factory.annotation.Qualifier;
//import org.springframework.context.annotation.Bean;
//import org.springframework.context.annotation.Configuration;
//import org.springframework.security.config.annotation.web.builders.HttpSecurity;
//import org.springframework.security.config.annotation.web.configuration.EnableWebSecurity;
//import org.springframework.security.core.userdetails.UserDetailsService;
//import org.springframework.security.oauth2.client.registration.ClientRegistration;
//import org.springframework.security.oauth2.client.registration.ClientRegistrationRepository;
//import org.springframework.security.oauth2.client.registration.InMemoryClientRegistrationRepository;
//import org.springframework.security.oauth2.client.userinfo.DefaultOAuth2UserService;
//import org.springframework.security.oauth2.client.userinfo.OAuth2UserService;
//import org.springframework.security.oauth2.core.AuthorizationGrantType;
//import org.springframework.security.web.SecurityFilterChain;
//
//@Configuration
//@Configurable
//@EnableWebSecurity
//@RequiredArgsConstructor
//public class WebSecurityConfig {
//    private final JwtAuthenticationFilter jwtAuthenticationFilter;
//    //private final DefaultOAuth2UserService oAuth2UserService;
//
//
//    @Bean
//    public SecurityFilterChain securityFilterChain(HttpSecurity http, UserDetailsService userDetailsService, OAuth2UserService oAuth2UserService) throws Exception {
//        http
//                .authorizeRequests()
//                .requestMatchers("/api/**").permitAll()
//                .anyRequest().authenticated()
//                .and()
//                .oauth2Login(oauth2 -> oauth2
//                        .redirectionEndpoint(endpoint -> endpoint.baseUri("http://localhost:8080/api/user/oauth2/callback/*"))
//                        //.userInfoEndpoint(endpoint -> endpoint.userService(oAuth2UserService))
//                );
//        return http.build();
//    }
//
////    @Bean
////    public ClientRegistrationRepository clientRegistrationRepository() {
////        // Kakao ClientRegistration 설정
////        ClientRegistration kakao = ClientRegistration.withRegistrationId("kakao")
////                .clientId("714a575754949434c7f9e10bb527da9a")
////                .clientSecret("zAQRGb72z0JexxUESus4CMGV90BYP4Rs")
////                .redirectUri("http://localhost:8080/api/user/oauth2/callback/kakao")
////                .authorizationUri("https://kauth.kakao.com/oauth/authorize")
////                .tokenUri("https://kauth.kakao.com/oauth/token")
////                .userInfoUri("https://kapi.kakao.com/v2/user/me")
////                .userNameAttributeName("id")
////                .clientName("Kakao")
////                .authorizationGrantType(new AuthorizationGrantType("authorization_code"))
////                .scope("profile_nickname", "profile_image")
////                .build();
////
////        return new InMemoryClientRegistrationRepository(kakao);
////    }
//
//}
