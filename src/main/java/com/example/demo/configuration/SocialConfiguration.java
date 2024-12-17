package com.example.demo.configuration;

import org.springframework.beans.factory.annotation.Value;
import org.springframework.context.annotation.Configuration;
import org.springframework.context.annotation.PropertySource;

import jakarta.annotation.PostConstruct;
import lombok.Getter;

@Getter
@Configuration
@PropertySource("classpath:external-config.properties")
public class SocialConfiguration {

    @Value("${KAKAO_CLIENT_ID}")
    private String kakaoClientId;

    @Value("${KAKAO_CLIENT_SECRET}")
    private String kakaoClientSecret;

    @Value("${KAKAO_REDIRECT_URI}")
    private String kakaoRedirectUri;

    @Value("${KAKAO_AUTHORIZATION_URI}")
    private String kakaoAuthorizationUri;

    @Value("${KAKAO_TOKEN_URI}")
    private String kakaoTokenUri;

    @Value("${KAKAO_USER_INFO_URI}")
    private String kakaoUserInfoUri;

    // @PostConstruct를 사용하여 값이 주입된 후 URI를 동적으로 수정합니다.
    @PostConstruct
    public void init() {
        this.kakaoRedirectUri = kakaoRedirectUri.replace("${KAKAO_CLIENT_ID}", kakaoClientId)
                .replace("${KAKAO_REDIRECT_URI}", kakaoRedirectUri);
    }

}
