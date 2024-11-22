package com.example.demo.jwt.controller;

import java.util.ArrayList;
import java.util.Date;
import java.util.List;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestHeader;
import org.springframework.web.bind.annotation.RestController;

import com.example.demo.jwt.constants.SecurityConstants;
import com.example.demo.jwt.domain.AuthenticationRequest;
import com.example.demo.jwt.prop.JwtProps;

import io.jsonwebtoken.Claims;
import io.jsonwebtoken.Jws;
import io.jsonwebtoken.Jwts;
import io.jsonwebtoken.security.Keys;  // SecretKey 생성을 위한 클래스
import io.jsonwebtoken.SignatureAlgorithm;  // JWT 서명 알고리즘

import lombok.extern.slf4j.Slf4j;

@Slf4j
@RestController
public class LoginController {
    @Autowired
    private JwtProps jwtProps;

    /**
     * JWT를 생성하는 Login 요청임 (암호화)
     * [GET] - /login
     * body : 
            {
                "name" : "yang",
                "pwd" : "1234"
            }
     * @param authReq
     * @return
     */
    @PostMapping("login")
    public ResponseEntity<?> login(@RequestBody AuthenticationRequest authReq) {
        // 사용자로부터 전달받은 인증 정보
        String username = authReq.getName();
        String password = authReq.getPwd();

        log.info("username : " + username);
        log.info("password : " + password);

        // 사용자 역할 정보
        List<String> roles = new ArrayList<>();
        roles.add("ROLE_USER");
        roles.add("ROLE_ADMIN");

        // 서명에 사용할 키 생성 (새로운 방식)
        String secretKey = jwtProps.getSecretKey();
        byte[] signingKey = jwtProps.getSecretKey().getBytes();

        log.info("secretKey : " + secretKey);
        log.info("signingKey : " + signingKey);

        // JWT 토큰 생성
        String jwt = Jwts.builder()
            .setHeaderParam("typ", SecurityConstants.TOKEN_TYPE)  // 헤더 설정
            .signWith(Keys.hmacShaKeyFor(signingKey), SignatureAlgorithm.HS512) // SignatureAlgorithm.HS512 사용
            .setExpiration(new Date(System.currentTimeMillis() + 3600000))  // 토큰 만료 시간 1시간으로 설정
            .claim("uid", username)  // 클레임 설정: 사용자 아이디
            .claim("rol", roles)     // 클레임 설정: 역할 정보
            .compact();  // 최종적으로 토큰 생성

        log.info("jwt : " + jwt);

        // 생성된 토큰을 클라이언트에게 반환
        return new ResponseEntity<String>(jwt, HttpStatus.OK);
    }

    /**
     * JWT를 해석하는 요청 (복호화)
     * 
     * @param header
     * @return
     */
    @GetMapping("/user/info")
    public ResponseEntity<String> userInfo(@RequestHeader(name="Authorization") String header) {
        log.info("===== header =====");
        log.info("Authorization : " + header);

        String jwt = header.substring(7);  // "Bearer " + jwt  ➡ jwt 추출

        log.info("jwt : " + jwt);

        String secretKey = jwtProps.getSecretKey();
        byte[] signingKey = jwtProps.getSecretKey().getBytes();

        log.info("secretKey : " + secretKey);
        log.info("signingKey : " + signingKey);

        // JWT 해석
        Jws<Claims> parsedToken = Jwts.parserBuilder()
            .setSigningKey(Keys.hmacShaKeyFor(signingKey))  // 서명 검증 키 설정
            .build()
            .parseClaimsJws(jwt);  // JWT 해석

        log.info("parsedToken : " + parsedToken);

        String username = parsedToken.getBody().get("uid").toString(); 
        log.info("username : " + username);

        Claims claims = parsedToken.getBody(); 
        Object roles = claims.get("rol");
        log.info("roles : " + roles);

        return new ResponseEntity<String>(parsedToken.toString(), HttpStatus.OK);
    }
}
