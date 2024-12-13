package com.example.demo.user.service.impl;

import java.util.Date;
import java.util.HashMap;
import java.util.List;
import java.util.Map;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.*;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;
import org.springframework.util.LinkedMultiValueMap;
import org.springframework.util.MultiValueMap;
import org.springframework.web.client.RestTemplate;

import com.example.demo.jwt.prop.JwtProps;
import com.example.demo.jwt.service.BlacklistService;
import com.example.demo.jwt.service.RefreshTokenService;
import com.example.demo.jwt.util.JwtUtil;
import com.example.demo.user.dto.UserDTO;
import com.example.demo.user.entity.CartEntity;
import com.example.demo.user.entity.UserEntity;
import com.example.demo.user.entity.WishEntity;
import com.example.demo.user.repository.CartRepository;
import com.example.demo.user.repository.UserRepository;
import com.example.demo.user.repository.WishRepository;
import com.example.demo.user.service.UserService;

import io.jsonwebtoken.Claims;
import io.jsonwebtoken.Jwts;
import io.jsonwebtoken.SignatureAlgorithm;
import io.jsonwebtoken.security.Keys;
import jakarta.transaction.Transactional;

import java.util.Optional;
import java.util.stream.Collectors;


@Transactional
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
    private RefreshTokenService refreshTokenService;
    @Autowired
    private BlacklistService blacklistService;
    @Autowired
    private JwtUtil jwtUtil;

    @Autowired
    private JwtProps jwtProps;

    @Override
    public String insert(UserDTO userDTO) {
        // DTO -> Entity 변환
        UserEntity userEntity = UserEntity.toGetUserEntity(userDTO);
        userEntity.setPwd(passwordEncoder.encode(userDTO.getPwd()));

         // Cart 엔티티 생성 및 연관관계 설정
         CartEntity cartEntity = new CartEntity();
         cartEntity.setUserEntity(userEntity);
         userEntity.setCartEntity(cartEntity);  // 양방향 관계 설정
         
         // Wish 엔티티 생성 및 연관관계 설정
         WishEntity wishEntity = new WishEntity();
         wishEntity.setUserEntity(userEntity);
         userEntity.setWishEntity(wishEntity);  // 양방향 관계 설정

        // 사용자 저장
        UserEntity savedUser = userRepository.save(userEntity);

        // 저장된 사용자 ID 반환
        return savedUser.getUserId();
    }
/*
    @Override
    public Map<String, Object> login(String userId, String pwd) {
        // 사용자 인증
        UserEntity userEntity = authenticate(userId, pwd);

        // Wish와 Cart 정보 조회
        WishEntity wishEntity = wishRepository.findByUserEntity_Id(userEntity.getId())
            .stream()
            .findFirst()
            .orElseGet(() -> {
                WishEntity newWish = new WishEntity();
                newWish.setUserEntity(userEntity);
                return wishRepository.save(newWish);
            });

        CartEntity cartEntity = cartRepository.findByUserEntity_Id(userEntity.getId())
            .orElseGet(() -> {
                CartEntity newCart = new CartEntity();
                newCart.setUserEntity(userEntity);
                return cartRepository.save(newCart);
            });

        // JWT 토큰 생성 (JwtUtil 사용)
        String accessToken = jwtUtil.generateAccessToken(
            userEntity.getUserId(),
            userEntity.getId(),
            wishEntity.getId(),
            cartEntity.getId()
        );
        
        String refreshToken = jwtUtil.generateRefreshToken(
            userEntity.getUserId(),
            userEntity.getId()
        );

        // 결과 맵 생성
        Map<String, Object> result = new HashMap<>();
        result.put("accessToken", accessToken);
        result.put("refreshToken", refreshToken);
        result.put("id", userEntity.getId());
        result.put("wishId", wishEntity.getId());
        result.put("cartId", cartEntity.getId());

        return result;
    }
*/

    @Override
    public Map<String, Object> login(String userId, String pwd) {
        // 사용자 인증 로직
        UserEntity user = authenticate(userId, pwd);
        
        if (user == null) {
            throw new RuntimeException("Invalid credentials");
        }
        int cartId = getCartIdById(user.getId());
        int wishId = getWishIdById(user.getId());

        // JWT 토큰 생성
        String accessToken = jwtUtil.generateAccessToken(user.getUserId(), user.getId(), wishId, cartId, user.isAdmin());
        String refreshToken = jwtUtil.generateRefreshToken(user.getUserId(), user.getId());

        // 응답에 포함될 데이터
        Map<String, Object> result = new HashMap<>();
        result.put("accessToken", accessToken);
        result.put("refreshToken", refreshToken);  // 컨트롤러에서 제거될 예정
        result.put("userId", user.getUserId());
        result.put("id", user.getId());
        result.put("cartId", cartId);
        result.put("wishId", wishId);
        result.put("isAdmin", user.isAdmin());

        return result;
    }
    @Override
    public void logout(String accessToken, String refreshToken) {
        // 토큰에서 Bearer 제거
        if (accessToken.startsWith("Bearer ")) {
            accessToken = accessToken.substring(7);
        }
        
        // RefreshTokenService를 통해 refresh 토큰을 블랙리스트에 추가
        refreshTokenService.addTokenToBlacklist(refreshToken);
        
        // BlacklistService를 통해 access 토큰을 블랙리스트에 추가
        Date expiryDate = jwtUtil.getExpirationDateFromToken(accessToken);
        blacklistService.addToBlacklist(accessToken, expiryDate);
    }

    @Override
    public List<UserDTO> findAllUsers() {
        return userRepository.findAll().stream()
                .map(UserEntity::toGetUserDTO)
                .collect(Collectors.toList());
    }
    /*
    @Override
    public void updateUserGrade(String userId, String grade) {
        UserEntity userEntity = userRepository.findByUserId(userId)
                .orElseThrow(() -> new RuntimeException("사용자를 찾을 수 없습니다."));
        userEntity.setGrade(UserEntity.Grade.valueOf(grade)); // 등급 업데이트
        userRepository.save(userEntity);
    }
     */
    // 결제 후 등급 업데이트
    //userService.updateUserGradeBasedOnPurchase(paymentEntity.getUserEntity().getId());
    // 추후 결제 시스템 코드 구현 후 추가하기
    
    // 결제에 따른 등급 업데이트
    
    /*
    @Override
    public void updateUserGradeBasedOnPurchase(int userId) {
        // 사용자 정보 조회
        UserEntity userEntity = userRepository.findByUserId(userId)
                .orElseThrow(() -> new RuntimeException("사용자를 찾을 수 없습니다."));
    
        // 현재 날짜를 기준으로 해당 월의 결제 금액을 계산
        LocalDateTime now = LocalDateTime.now();
        YearMonth yearMonth = YearMonth.from(now);
        LocalDateTime startDate = yearMonth.atDay(1).atStartOfDay();  // 해당 월의 첫날 00:00
        LocalDateTime endDate = yearMonth.atEndOfMonth().atTime(23, 59, 59);  // 해당 월의 마지막날 23:59
    
        // 해당 월에 해당하는 결제 금액 계산
        List<PaymentEntity> payments = paymentRepository.findByUserEntity_IdAndPaymentDateBetween(userId, startDate, endDate);
        double totalPurchaseAmount = payments.stream()
                .mapToDouble(PaymentEntity::getTotalPrice)
                .sum();
    
        // 결제 금액에 따른 등급 변경
        UserEntity.Grade newGrade = determineGradeBasedOnAmount(totalPurchaseAmount);
        userEntity.setGrade(newGrade);
    
        // 업데이트된 사용자 정보 저장
        userRepository.save(userEntity);
    }

    // 결제 금액에 따른 등급 결정
    private UserEntity.Grade determineGradeBasedOnAmount(double totalAmount) {
        if (totalAmount >= 700000) {
            return UserEntity.Grade.LV5;
        } else if (totalAmount >= 500000) {
            return UserEntity.Grade.LV4;
        } else if (totalAmount >= 300000) {
            return UserEntity.Grade.LV3;
        } else if (totalAmount >= 100000) {
            return UserEntity.Grade.LV2;
        } else {
            return UserEntity.Grade.LV1; // LV1: 일반회원
        }
    }
 */

    // 토큰 검사 _241126_sc
    @Override
    public boolean validateToken(String token) {
        try {
            // JWT 토큰 검증
            Jwts.parserBuilder()
                .setSigningKey(Keys.hmacShaKeyFor(jwtProps.getSecretKey().getBytes()))
                .build()
                .parseClaimsJws(token);
            return true;
        } catch (Exception e) {
            System.out.println("토큰 검증 실패: " + e.getMessage());
            return false;
        }
    }

    // 토큰에서 사용자 데이터 추출 _241127_sc
    @Override
    public Map<String, Object> getUserDataFromToken(String token) {
        try {
            Claims claims = Jwts.parserBuilder()
                .setSigningKey(Keys.hmacShaKeyFor(jwtProps.getSecretKey().getBytes()))
                .build()
                .parseClaimsJws(token)
                .getBody();
            
            Map<String, Object> userData = new HashMap<>();
            userData.put("userId", claims.get("userId"));
            userData.put("roles", claims.get("roles"));
            return userData;
        } catch (Exception e) {
            throw new RuntimeException("토큰에서 사용자 정보를 추출할 수 없습니다.");
        }
    }
    
    // 사용자 토큰 갱신 _241127_sc
    @Override
    public Map<String, Object> refreshUserToken(String userId) {
        UserEntity userEntity = userRepository.findByUserId(userId)
            .orElseThrow(() -> new RuntimeException("사용자를 찾을 수 없습니다."));
        
        // Wish와 Cart 정보 가져오기
        WishEntity wishEntity = wishRepository.findByUserEntity_Id(userEntity.getId())
            .stream()
            .findFirst()
            .orElseThrow(() -> new RuntimeException("Wish 정보를 찾을 수 없습니다."));
        
        CartEntity cartEntity = cartRepository.findByUserEntity_Id(userEntity.getId())
            .orElseThrow(() -> new RuntimeException("Cart 정보를 찾을 수 없습니다."));

        // 새 토큰 생성
        byte[] signingKey = jwtProps.getSecretKey().getBytes();
        String jwt = Jwts.builder()
            .setSubject(String.valueOf(userEntity.getId()))
            .claim("userId", userEntity.getUserId())
            .claim("roles", userEntity.isAdmin() ? "ROLE_ADMIN" : "ROLE_USER")
            .signWith(Keys.hmacShaKeyFor(signingKey), SignatureAlgorithm.HS512)
            .setExpiration(new Date(System.currentTimeMillis() + 3600000))
            .compact();

        Map<String, Object> result = new HashMap<>();
        result.put("jwt", jwt);
        result.put("id", userEntity.getId());
        result.put("wishId", wishEntity.getId());
        result.put("cartId", cartEntity.getId());

        return result;
    }

    @Override
    public UserEntity authenticate(String userId, String password) {
        Optional<UserEntity> userOptional = userRepository.findByUserId(userId);
        
        // 사용자가 없거나 비밀번호가 일치하지 않는 경우
        if (userOptional.isEmpty() || 
            !passwordEncoder.matches(password, userOptional.get().getPwd())) {
            throw new RuntimeException("아이디 또는 비밀번호가 일치하지 않습니다.");
        }

        return userOptional.get();
    }

    @Override
    public int getWishIdById(int id) {
        return wishRepository.findByUserEntity_Id(id)
                .stream()
                .findFirst()
                .orElseThrow(() -> new RuntimeException("위시리스트를 찾을 수 없습니다."))
                .getId();
    }

    @Override
    public int getCartIdById(int id) {
        return cartRepository.findByUserEntity_Id(id)
                .orElseThrow(() -> new RuntimeException("장바구니를 찾을 수 없습니다."))
                .getId();
    }

    public UserDTO findUserById(String userId) {
        // 사용자 정보 조회
        UserEntity userEntity = userRepository.findByUserId(userId)
                .orElseThrow(() -> new RuntimeException("사용자를 찾을 수 없습니다."));

        // Entity -> DTO 변환하여 반환
        return UserEntity.toGetUserDTO(userEntity);
    }


    private String getKakaoAccessToken(String code) {
        try {
            String tokenUrl = "https://kauth.kakao.com/oauth/token";
            
            // 요청 파라미터 설정
            MultiValueMap<String, String> params = new LinkedMultiValueMap<>();
            params.add("grant_type", "authorization_code");
            params.add("client_id", "f7a7c7e3336c98e0e10ec97636ac08fa");  // 본인의 REST API 키
            params.add("redirect_uri", "http://localhost:8080/api/oauth/kakao/callback");
            params.add("code", code);

            // HTTP 헤더 설정
            HttpHeaders headers = new HttpHeaders();
            headers.setContentType(MediaType.APPLICATION_FORM_URLENCODED);

            // HTTP 요청 엔티티 생성
            HttpEntity<MultiValueMap<String, String>> requestEntity = 
                new HttpEntity<>(params, headers);

            // RestTemplate으로 카카오 서버에 토큰 요청
            RestTemplate restTemplate = new RestTemplate();
            ResponseEntity<Map> response = restTemplate.exchange(
                tokenUrl,
                HttpMethod.POST,
                requestEntity,
                Map.class
            );

            // 응답에서 액세스 토큰 추출
            Map<String, Object> responseBody = response.getBody();
            return (String) responseBody.get("access_token");

        } catch (Exception e) {
            throw new RuntimeException("Failed to get Kakao access token: " + e.getMessage());
        }
    }

    // 카카오 사용자 정보 가져오기
    private Map<String, Object> getKakaoUserInfo(String accessToken) {
        try {
            String userInfoUrl = "https://kapi.kakao.com/v2/user/me";

            // HTTP 헤더 설정
            HttpHeaders headers = new HttpHeaders();
            headers.setBearerAuth(accessToken);
            headers.setContentType(MediaType.APPLICATION_FORM_URLENCODED);

            // HTTP 요청 엔티티 생성
            HttpEntity<String> requestEntity = new HttpEntity<>(headers);

            // RestTemplate으로 카카오 서버에 사용자 정보 요청
            RestTemplate restTemplate = new RestTemplate();
            ResponseEntity<Map> response = restTemplate.exchange(
                userInfoUrl,
                HttpMethod.GET,
                requestEntity,
                Map.class
            );

            // 응답에서 필요한 사용자 정보 추출
            Map<String, Object> userInfo = new HashMap<>();
            Map<String, Object> kakaoAccount = (Map<String, Object>) response.getBody().get("kakao_account");
            Map<String, Object> profile = (Map<String, Object>) kakaoAccount.get("profile");

            userInfo.put("id", response.getBody().get("id"));
            userInfo.put("email", kakaoAccount.get("email"));
            userInfo.put("nickname", profile.get("nickname"));

            return userInfo;

        } catch (Exception e) {
            throw new RuntimeException("Failed to get Kakao user info: " + e.getMessage());
        }
    }

    // 카카오 사용자 생성
    private UserEntity createKakaoUser(Map<String, Object> kakaoUserInfo) {
        String kakaoId = String.valueOf(kakaoUserInfo.get("id"));
        String email = (String) kakaoUserInfo.get("email");
        String nickname = (String) kakaoUserInfo.get("nickname");

        UserEntity user = new UserEntity();
        user.setUserId("KAKAO_" + kakaoId);
        user.setEmail(email);
        user.setName(nickname);
        user.setAdmin(false);  // 카카오 로그인 사용자는 기본적으로 일반 사용자
        
        // Cart 엔티티 생성 및 연관관계 설정
        CartEntity cartEntity = new CartEntity();
        cartEntity.setUserEntity(user);
        user.setCartEntity(cartEntity);
        
        // Wish 엔티티 생성 및 연관관계 설정
        WishEntity wishEntity = new WishEntity();
        wishEntity.setUserEntity(user);
        user.setWishEntity(wishEntity);
        
        return userRepository.save(user);
    }

}
