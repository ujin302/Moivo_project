package com.example.demo.security.handler;

import com.example.demo.user.entity.UserEntity;
import org.springframework.security.core.GrantedAuthority;
import org.springframework.security.core.authority.SimpleGrantedAuthority;
import org.springframework.security.oauth2.core.user.OAuth2User;

import java.util.Collection;
import java.util.List;
import java.util.Map;

public class CustomOAuth2User implements OAuth2User {
    private UserEntity userEntity;

    public CustomOAuth2User(UserEntity userEntity) {
        this.userEntity = userEntity;
    }

    @Override
    public Map<String, Object> getAttributes() {
        // userEntity에서 필요한 속성만 반환
        return Map.of("id", userEntity.getId(), "name", userEntity.getName());
    }

    @Override
    public Collection<? extends GrantedAuthority> getAuthorities() {
        // 권한 설정 (예: ROLE_USER 등)
//        return List.of(new SimpleGrantedAuthority("ROLE_USER"));
        return List.of(new SimpleGrantedAuthority("KAKAO"));
    }

    @Override
    public String getName() {
        return userEntity.getName();
    }
}

