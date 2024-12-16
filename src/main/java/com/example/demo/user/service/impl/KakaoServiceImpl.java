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
        try {
            String kakaoAccessToken = getKakaoAccessToken(code);
            Map<String, Object> userInfo = getKakaoUserInfo(kakaoAccessToken);
            
            String kakaoId = userInfo.get("id").toString();
            Map<String, Object> kakaoAccount = (Map<String, Object>) userInfo.get("kakao_account");
            String email = kakaoAccount.get("email").toString();
            
            // 사용자 조회 또는 생성
            UserEntity user = userRepository.findByUserId("KAKAO_" + kakaoId)
                .orElseGet(() -> createKakaoUser(kakaoId, email, 
                    ((Map<String, Object>)kakaoAccount.get("profile")).get("nickname").toString()));

            // JWT 토큰 생성
            String accessToken = jwtUtil.generateAccessToken(
                user.getUserId(),
                user.getId(),
                user.getWishEntity().getId(),
                user.getCartEntity().getId(),
                user.isAdmin()
            );
            
            String refreshToken = jwtUtil.generateRefreshToken(
                user.getUserId(),
                user.getId()
            );
            
            // 모든 필요한 정보를 포함하여 반환
            Map<String, String> response = new HashMap<>();
            response.put("accessToken", accessToken);
            response.put("refreshToken", refreshToken);
            response.put("userId", user.getUserId());
            response.put("id", user.getId().toString());
            response.put("cartId", user.getCartEntity().getId().toString());
            response.put("wishId", user.getWishEntity().getId().toString());
            response.put("isAdmin", String.valueOf(user.isAdmin()));
            
            return response;
        } catch (Exception e) {
            throw new RuntimeException("카카오 로그인 처리 중 오류 발생: " + e.getMessage());
        }
    }

    @Override
    public String getKakaoAccessToken(String code) {
        try {
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
        } catch (Exception e) {
            throw new RuntimeException("카카오 액세스 토큰 획득 중 오류 발생: " + e.getMessage());
        }
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

    private UserEntity createKakaoUser(String kakaoId, String email, String nickname) {
        UserEntity user = new UserEntity();
        user.setUserId("KAKAO_" + kakaoId);
        user.setEmail(email);
        user.setName(nickname);
        user.setAdmin(false);

        // 장바구니 생성
        CartEntity cart = new CartEntity();
        cart.setUserEntity(user);
        user.setCartEntity(cart);

        // 위시리스트 생성
        WishEntity wish = new WishEntity();
        wish.setUserEntity(user);
        user.setWishEntity(wish);

        return userRepository.save(user);
    }
}