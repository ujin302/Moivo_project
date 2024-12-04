package com.example.demo.user.service.impl;

import java.time.LocalDate;
import java.time.LocalDateTime;
import java.time.YearMonth;
import java.time.format.DateTimeFormatter;
import java.util.Date;
import java.util.HashMap;
import java.util.List;
import java.util.Map;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;

import com.example.demo.jwt.prop.JwtProps;
import com.example.demo.jwt.service.BlacklistService;
import com.example.demo.jwt.service.RefreshTokenService;
import com.example.demo.jwt.util.JwtUtil;
import com.example.demo.payment.entity.PaymentEntity;
import com.example.demo.payment.repository.PaymentRepository;
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
    private PaymentRepository paymentRepository;
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
        String accessToken = jwtUtil.generateAccessToken(user.getUserId(), user.getId(), wishId, cartId);
        String refreshToken = jwtUtil.generateRefreshToken(user.getUserId(), user.getId());

        // 응답에 포함될 데이터
        Map<String, Object> result = new HashMap<>();
        result.put("accessToken", accessToken);
        result.put("refreshToken", refreshToken);  // 컨트롤러에서 제거될 예정
        result.put("id", user.getId());
        result.put("cartId", cartId);
        result.put("wishId", wishId);

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
    System.out.println("\n=== DB 인증 프로세스 시작 ===");
    System.out.println("1. DB 접근 시도");
    try {
        // DB 연결 상태 확인
        boolean isConnected = userRepository.count() >= 0;
        System.out.println("DB 연결 상태: " + (isConnected ? "성공" : "실패"));
        
        System.out.println("2. 사용자 조회 시도");
        System.out.println("조회할 userId: " + userId);
        
        // DB에서 사용자 조회
        Optional<UserEntity> userOptional = userRepository.findByUserId(userId);
        
        System.out.println("DB 조회 결과: " + (userOptional.isPresent() ? "사용자 존재" : "사용자 없음"));
        
        if (userOptional.isEmpty()) {
            throw new RuntimeException("존재하지 않는 사용자입니다.");
        }

        UserEntity userEntity = userOptional.get();
        System.out.println("3. 비밀번호 검증 시도");
        System.out.println("입력된 비밀번호: " + password);
        System.out.println("DB 저장된 암호화 비밀번호: " + userEntity.getPwd());
        
        boolean passwordMatch = passwordEncoder.matches(password, userEntity.getPwd());
        System.out.println("비밀번호 일치 여부: " + passwordMatch);

        if (!passwordMatch) {
            throw new RuntimeException("비밀번호가 일치하지 않습니다.");
        }

        System.out.println("=== DB 인증 프로세스 완료 ===\n");
        return userEntity;
        
    } catch (Exception e) {
        System.out.println("=== DB 인증 프로세스 실패 ===");
        System.out.println("에러 메시지: " + e.getMessage());
        System.out.println("에러 타입: " + e.getClass().getName() + "\n");
        throw e;
    }
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

}
