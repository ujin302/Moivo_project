package com.example.demo.jwt.security;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.context.annotation.Primary;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.security.core.userdetails.UserDetailsService;
import org.springframework.security.core.userdetails.UsernameNotFoundException;
import org.springframework.stereotype.Service;

import com.example.demo.user.entity.UserEntity;
import com.example.demo.user.repository.UserRepository;

@Service
@Primary
public class CustomUserDetailsService implements UserDetailsService {

    @Autowired
    private UserRepository userRepository;

    @Override
    public UserDetails loadUserByUsername(String username) throws UsernameNotFoundException {
        UserEntity user = userRepository.findByEmail(username)
            .orElseThrow(() -> new UsernameNotFoundException("User not found"));
        
        // 소셜 로그인 사용자를 위한 임시 비밀번호 설정  _ 241210_yjy
        String password = user.getPwd();
        if (password == null) {
            password = "{noop}SOCIAL_LOGIN_USER";  // 소셜 로그인 사용자용 더미 비밀번호
        }
        
        return org.springframework.security.core.userdetails.User.builder()
            .username(user.getEmail())
            .password(password)
            .roles(user.isAdmin() ? "ADMIN" : "USER")
            .build();
    }
}