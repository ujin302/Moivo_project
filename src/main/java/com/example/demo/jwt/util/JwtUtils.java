package com.example.demo.jwt.util;

import io.jsonwebtoken.*;
import io.jsonwebtoken.security.Keys;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Component;
import com.example.demo.jwt.security.CustomUserDetails;

import java.security.Key;
import java.util.Date;

@Component
public class JwtUtils {

    private final Key signingKey;
    private static final long EXPIRATION_TIME = 3600000; // 1시간

    // yml에 있는 문자열 secretkey가 아니라, JWT서명을 위한 Key 객체로 변환되어야 함
    //Key 객체로 변환시키기 위해 Keys.hmacShaKeyFor 메소드를 사용하는거임
    public JwtUtils(@Value("${com.example.demo.jwt.secret-key}") String secretKey) {
        this.signingKey = Keys.hmacShaKeyFor(secretKey.getBytes());
    }

    // JWT 생성
    public String generateToken(CustomUserDetails userDetails) {
        return Jwts.builder()
                .setSubject(userDetails.getUsername())
                .claim("roles", userDetails.getAuthorities())
                .setIssuedAt(new Date()) // 토큰 발행 시간
                .setExpiration(new Date(System.currentTimeMillis() + EXPIRATION_TIME)) // 만료 시간
                .signWith(signingKey, SignatureAlgorithm.HS512) // 서명 알고리즘과 키 설정
                .compact();
    }

    // JWT 유효성 검증 및 Claims 반환
    public Claims validateToken(String token) {
        try {
            return Jwts.parserBuilder()
                    .setSigningKey(signingKey) // 서명 키 설정
                    .build()
                    .parseClaimsJws(token)
                    .getBody();
        } catch (JwtException e) {
            throw new RuntimeException("Invalid JWT token", e);
        }
    }
}
