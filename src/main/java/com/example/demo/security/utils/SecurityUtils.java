package com.example.demo.security.utils;

import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.security.oauth2.core.user.OAuth2User;
import org.springframework.security.authentication.AnonymousAuthenticationToken;

public class SecurityUtils {

    public static boolean isOAuthLogin() {
        Authentication authentication = SecurityContextHolder.getContext().getAuthentication();

        if (authentication == null || authentication instanceof AnonymousAuthenticationToken) {
            return false; // 로그인하지 않은 경우
        }

        // OAuth2 로그인 여부 확인
        if (authentication.getPrincipal() instanceof OAuth2User) {
            return true; // OAuth 로그인 사용자
        }

        return false; // 일반 로그인 사용자
    }
}
