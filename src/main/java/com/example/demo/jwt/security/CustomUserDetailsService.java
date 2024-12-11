package com.example.demo.jwt.security;

import org.springframework.security.core.userdetails.User;
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
    public UserDetails loadUserByUsername(String userId) throws UsernameNotFoundException {
        UserEntity user = userRepository.findByUserId(userId)
            .orElseThrow(() -> new UsernameNotFoundException("User not found"));
        // - 241211_yjy
        String password = (UserEntity.LoginType.KAKAO.equals(user.getLoginType())) ? 
            "{noop}KAKAO_USER" : 
            user.getPwd();

        return User.builder()
            .username(user.getUserId())
            .password(password)
            .roles(user.isAdmin() ? "ADMIN" : "USER")
            .build();
    }
}