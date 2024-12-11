package com.example.demo.user.service.impl;


import com.example.demo.jwt.util.JwtUtil;
import com.example.demo.user.entity.CartEntity;
import com.example.demo.user.entity.UserEntity;
import com.example.demo.user.entity.WishEntity;
import com.example.demo.user.repository.UserRepository;
import com.example.demo.user.service.KakaoService;
import lombok.RequiredArgsConstructor;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.http.*;
import org.springframework.stereotype.Service;
import org.springframework.util.LinkedMultiValueMap;
import org.springframework.util.MultiValueMap;
import org.springframework.web.client.RestTemplate;

import java.util.HashMap;
import java.util.Map;

@Service
@RequiredArgsConstructor
public class KakaoServiceImpl implements KakaoService {

    private final RestTemplate restTemplate;
    private final UserRepository userRepository;
    private final JwtUtil jwtUtil;

    @Value("${spring.security.oauth2.client.registration.kakao.client-id}")
    private String clientId;

    @Value("${spring.security.oauth2.client.registration.kakao.client-secret}")
    private String clientSecret;

    @Value("${spring.security.oauth2.client.registration.kakao.redirect-uri}")
    private String redirectUri;

    @Override
    public Map<String, String> processKakaoLogin(String code) {
        // 카카오 액세스 토큰 얻기
        String kakaoAccessToken = getKakaoAccessToken(code);
        
        // 카카오 사용자 정보 얻기
        Map<String, Object> userInfo = getKakaoUserInfo(kakaoAccessToken);
        
        // 사용자 정보 저장 또는 업데이트
        UserEntity user = saveOrUpdateUser(userInfo);
        
        // JWT 토큰 생성
        String accessToken = jwtUtil.generateAccessToken(user.getUserId(), user.getId(), 
            user.getWishEntity().getId(), user.getCartEntity().getId(), user.isAdmin());
        String refreshToken = jwtUtil.generateRefreshToken(user.getUserId(), user.getId());

        Map<String, String> tokens = new HashMap<>();
        tokens.put("accessToken", accessToken);
        tokens.put("refreshToken", refreshToken);
        tokens.put("userId", user.getUserId());
        
        return tokens;
    }

    @Override
    public String getKakaoAccessToken(String code) {
        HttpHeaders headers = new HttpHeaders();
        headers.setContentType(MediaType.APPLICATION_FORM_URLENCODED);

        MultiValueMap<String, String> body = new LinkedMultiValueMap<>();
        body.add("grant_type", "authorization_code");
        body.add("client_id", clientId);
        body.add("client_secret", clientSecret);
        body.add("redirect_uri", redirectUri);
        body.add("code", code);

        HttpEntity<MultiValueMap<String, String>> request = new HttpEntity<>(body, headers);

        ResponseEntity<Map> response = restTemplate.postForEntity(
            "https://kauth.kakao.com/oauth/token",
            request,
            Map.class
        );

        return (String) response.getBody().get("access_token");
    }

    @Override
    public Map<String, Object> getKakaoUserInfo(String accessToken) {
        HttpHeaders headers = new HttpHeaders();
        headers.setBearerAuth(accessToken);
        
        HttpEntity<String> request = new HttpEntity<>(headers);
        
        ResponseEntity<Map> response = restTemplate.exchange(
            "https://kapi.kakao.com/v2/user/me",
            HttpMethod.GET,
            request,
            Map.class
        );
        
        return response.getBody();
    }

    private UserEntity saveOrUpdateUser(Map<String, Object> userInfo) {
        Map<String, Object> kakaoAccount = (Map<String, Object>) userInfo.get("kakao_account");
        Map<String, Object> profile = (Map<String, Object>) kakaoAccount.get("profile");
        
        // 카카오 고유 ID를 문자열로 변환한거임
        String kakaoId = String.valueOf(userInfo.get("id"));
        String email = (String) kakaoAccount.get("email");
        String nickname = (String) profile.get("nickname");
        
        // userId를 이메일 대신 카카오 고유 ID로 검색 및 저장
        return userRepository.findByUserId(kakaoId)
            .orElseGet(() -> {
                UserEntity newUser = new UserEntity();
                newUser.setUserId(kakaoId);    // 카카오 고유 ID를 userId로 저장
                newUser.setName(nickname);
                newUser.setLoginType(UserEntity.LoginType.KAKAO);
                newUser.setEmail(email);       // 이메일은 email 필드에 별도로 저장
                
                newUser.setAdmin(false);
                
                // Cart 엔티티 생성
                CartEntity cartEntity = new CartEntity();
                cartEntity.setUserEntity(newUser);
                newUser.setCartEntity(cartEntity);

                // Wish 엔티티 생성
                WishEntity wishEntity = new WishEntity();
                wishEntity.setUserEntity(newUser);
                newUser.setWishEntity(wishEntity);
                
                return userRepository.save(newUser);
            });
    }
}    //이 파일 자체 생성 _ 241210_yjy