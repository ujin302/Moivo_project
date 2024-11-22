package com.example.demo.user.service.impl;

import java.util.Date;
import java.util.HashMap;
import java.util.List;
import java.util.Map;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;

import com.example.demo.jwt.prop.JwtProps;
import com.example.demo.payment.entity.PaymentEntity;
import com.example.demo.payment.repository.PaymentRepository;
import com.example.demo.user.dto.UserDTO;
import com.example.demo.user.entity.UserEntity;
import com.example.demo.user.entity.WishEntity;
import com.example.demo.user.repository.UserRepository;
import com.example.demo.user.repository.WishRepository;
import com.example.demo.user.service.UserService;

import io.jsonwebtoken.Jwts;
import io.jsonwebtoken.SignatureAlgorithm;
import io.jsonwebtoken.security.Keys;
import java.util.Optional;


@Service
public class UserServiceImpl implements UserService {

    @Autowired
    private UserRepository userRepository;
    @Autowired
    private WishRepository wishRepository;
    @Autowired
    private PaymentRepository paymentRepository;

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

        // Wish ID 조회
        Integer wishId = null;
        List<WishEntity> wishEntities = wishRepository.findByUserEntity_Id(userEntity.getId());
        if (!wishEntities.isEmpty()) {
            wishId = wishEntities.get(0).getId(); // 첫 번째 Wish ID 가져오기
        }

        // Payment ID 조회
        Integer paymentId = null;
        List<PaymentEntity> paymentEntities = paymentRepository.findByUserEntity_Id(userEntity.getId());
        if (!paymentEntities.isEmpty()) {
            paymentId = paymentEntities.get(0).getId(); // 첫 번째 Payment ID 가져오기
        }

        // JWT 생성
        byte[] signingKey = jwtProps.getSecretKey().getBytes();
        String jwt = Jwts.builder()
                .setSubject(String.valueOf(userEntity.getUserId())) // 사용자 식별자
                .claim("roles", userEntity.isAdmin() ? "ROLE_ADMIN" : "ROLE_USER") // 역할 정보
                .signWith(Keys.hmacShaKeyFor(signingKey), SignatureAlgorithm.HS512) // 서명
                .setExpiration(new Date(System.currentTimeMillis() + 3600000)) // 1시간 유효
                .compact();

        System.out.println("userseq = " + userEntity.getUserId());
        Map<String, Object> result = new HashMap<>();
        result.put("jwt", jwt);
        result.put("userseq", userEntity.getUserId());
        result.put("wishId", wishId);
        result.put("paymentId", paymentId);

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
