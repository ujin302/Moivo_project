package com.example.demo.user.service.impl;

import java.util.Date;
import java.util.HashMap;
import java.util.Map;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;

import com.example.demo.jwt.prop.JwtProps;
import com.example.demo.user.dto.UserDTO;
import com.example.demo.user.entity.CartEntity;
import com.example.demo.user.entity.UserEntity;
import com.example.demo.user.entity.WishEntity;
import com.example.demo.user.repository.CartRepository;
import com.example.demo.user.repository.UserRepository;
import com.example.demo.user.repository.WishRepository;
import com.example.demo.user.service.UserService;

import io.jsonwebtoken.Jwts;
import io.jsonwebtoken.SignatureAlgorithm;
import io.jsonwebtoken.security.Keys;


@Service
public class UserServiceImpl implements UserService {

    @Autowired
    private UserRepository userRepository;
    @Autowired
    private WishRepository wishRepository;
    @Autowired
    private CartRepository cartRepository;

    @Autowired
    private PasswordEncoder passwordEncoder;

    @Autowired
    private JwtProps jwtProps;

    @Override
    public int insert(UserDTO userDTO) {
        // DTO -> Entity 변환
        UserEntity userEntity = UserEntity.toGetUserEntity(userDTO);
        userEntity.setPwd(passwordEncoder.encode(userDTO.getPwd()));

        // 사용자 저장
        UserEntity savedUser = userRepository.save(userEntity);

        // 저장된 사용자 ID 반환
        return savedUser.getId();
    }

    @Override
    public Map<String, Object> login(String userId, String pwd) {
        UserEntity userEntity = userRepository.findByUserId(userId)
            .orElseThrow(() -> new RuntimeException("사용자를 찾을 수 없습니다."));
        if (!passwordEncoder.matches(pwd, userEntity.getPwd())) {
            throw new RuntimeException("비밀번호가 일치하지 않습니다.");
        }

        System.out.println("=== 로그인 디버깅 ===");
        System.out.println("입력된 비밀번호: " + pwd);
        System.out.println("저장된 암호화 비밀번호: " + userEntity.getPwd());
        System.out.println("비밀번호 매칭 결과: " + passwordEncoder.matches(pwd, userEntity.getPwd()));

        // Wish 생성 확인 및 자동 생성
        WishEntity wishEntity = wishRepository.findByUserEntity_Id(userEntity.getId())
            .stream()
            .findFirst()
            .orElseGet(() -> {
                WishEntity newWish = new WishEntity();
                newWish.setUserEntity(userEntity);
                return wishRepository.save(newWish); // 새로운 Wish 생성 및 저장
            });

        // cart 생성 확인 및 자동 생성
        CartEntity cartEntity = cartRepository.findByUserEntity_Id(userEntity.getId())
            .orElseGet(() -> {
                CartEntity newCart = new CartEntity();
                newCart.setUserEntity(userEntity);
                return cartRepository.save(newCart); // 새로운 Cart 생성 및 저장
            });

        // JWT 생성
        byte[] signingKey = jwtProps.getSecretKey().getBytes();
        String jwt = Jwts.builder()
                .setSubject(String.valueOf(userEntity.getUserId())) // 사용자 식별자
                .claim("roles", userEntity.isAdmin() ? "ROLE_ADMIN" : "ROLE_USER") // 역할 정보
                .signWith(Keys.hmacShaKeyFor(signingKey), SignatureAlgorithm.HS512) // 서명
                .setExpiration(new Date(System.currentTimeMillis() + 3600000)) // 1시간 유효
                .compact();

        System.out.println("id = " + userEntity.getId());
        Map<String, Object> result = new HashMap<>();
        result.put("jwt", jwt);
        result.put("id", userEntity.getId());
        result.put("wishId", wishEntity.getId());
        result.put("cartId", cartEntity.getId());

        return result;
    }

    @Override
    public void logout(String token) {
        if (token.startsWith("Bearer ")) {
            token = token.substring(7); // "Bearer " 접두사 제거
        }

        System.out.println("로그아웃 처리됨. 토큰: " + token);
    }

}
