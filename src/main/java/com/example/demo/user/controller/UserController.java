package com.example.demo.user.controller;

import java.util.Map;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import com.example.demo.coupon.service.UserCouponService;
import com.example.demo.jwt.util.JwtUtil;
import com.example.demo.user.dto.UserDTO;
import com.example.demo.user.service.UserService;

import jakarta.servlet.http.Cookie;
import jakarta.servlet.http.HttpServletResponse;

@RestController
@RequestMapping("/api/user")
@CrossOrigin(origins = "http://localhost:5173", allowCredentials = "true")
public class UserController {

    @Autowired
    private UserService userService;

    @Autowired
    private UserCouponService userCouponService;


    @Autowired
    private JwtUtil jwtUtil;

// 회원가입
@PostMapping("/join")  // - yjy
public ResponseEntity<String> signup(@RequestBody UserDTO userDTO) {
    String userId = userService.insert(userDTO);

    /*
    // 회원가입이 성공한 후, LV1 쿠폰 발급 2024.11.25 sumin
    try {
        userCouponService.updateCouponByUserAndGrade(userId, "LV1");  // LV1 쿠폰 발급
        System.out.println("회원가입 후 LV1 쿠폰이 발급되었습니다.");
    } catch (Exception e) {
        return new ResponseEntity<>("회원가입 후 쿠폰 발급 실패: " + e.getMessage(), HttpStatus.INTERNAL_SERVER_ERROR);
    }
 */
    return new ResponseEntity<>("회원가입 성공: " + userId, HttpStatus.CREATED);
}
/*

  /*  // 회원가입
    @PostMapping("/join")
    public ResponseEntity<String> signup(@RequestBody UserDTO userDTO) {
        int userId = userService.insert(userDTO);

        // 회원가입이 성공한 후, LV1 쿠폰 발급 2024.11.25 sumin
        try {
            userCouponService.updateCouponByUserAndGrade(userId, "LV1");  // LV1 쿠폰 발급
            System.out.println("회원가입 후 LV1 쿠폰이 발급되었습니다.");
        } catch (Exception e) {
            return new ResponseEntity<>("회원가입 후 쿠폰 발급 실패: " + e.getMessage(), HttpStatus.INTERNAL_SERVER_ERROR);
        }

        return new ResponseEntity<>("회원가입 성공: " + userId, HttpStatus.CREATED);
    }
 */      // 충돌 난거!!!!!

 /*
    // 결제에 따른 등급 업데이트 2024.11.25 sumin
    @PostMapping("/updateGrade/{userId}")
    public ResponseEntity<Void> updateUserGrade(@PathVariable int userId) {
        try {
            userService.updateUserGradeBasedOnPurchase(userId);
            return ResponseEntity.ok().build(); // 200 OK 상태 코드만 반환
        } catch (RuntimeException e) {
            return ResponseEntity.status(HttpStatus.NOT_FOUND).build(); // 404 NOT FOUND 상태 코드만 반환
        }
    }
 */
    // 로그인
    @PostMapping("/login")
    public ResponseEntity<Map<String, Object>> login(@RequestBody Map<String, String> loginRequest,
                                                   HttpServletResponse response) {
        String userId = loginRequest.get("userId");
        String pwd = loginRequest.get("pwd");
        try {
            System.out.println("로그인 시도 - userId: " + userId); // 디버깅
            Map<String, Object> loginResult = userService.login(userId, pwd);
            
            // Refresh Token을 쿠키에 설정
            Cookie refreshTokenCookie = new Cookie("refreshToken", 
                (String) loginResult.get("refreshToken"));
            refreshTokenCookie.setHttpOnly(true);
            refreshTokenCookie.setPath("/");
            refreshTokenCookie.setMaxAge(7 * 24 * 60 * 60); // 7일
            response.addCookie(refreshTokenCookie);

            // isAdmin 값을 응답에 포함
            UserDTO userInfo = userService.findUserById(userId);
            loginResult.put("isAdmin", userInfo.isAdmin());

            // Refresh Token은 응답 바디에서 제거
            loginResult.remove("refreshToken");
            System.out.println("로그인 성공!!");

            return ResponseEntity.ok(loginResult);
        } catch (RuntimeException e) {
            System.out.println("로그인 실패: " + e.getMessage()); // 디버깅
            return ResponseEntity.status(HttpStatus.UNAUTHORIZED)
                .body(Map.of("error", e.getMessage()));
        }
    }

    // 로그아웃
    @PostMapping("/logout")
    public ResponseEntity<String> logout(@RequestHeader("Authorization") String accesstoken,
                                       @CookieValue("refreshToken") String refreshToken) {
        userService.logout(accesstoken, refreshToken);
        return ResponseEntity.ok("로그아웃 성공");
    }

    // 소셜 로그인

    // 사용자 정보 조회 엔드포인트 추가
    @GetMapping("/info")
    public ResponseEntity<?> getUserInfo(@RequestHeader("Authorization") String token) {
        try {
            // Bearer 토큰에서 실제 토큰 값 추출
            String actualToken = token.substring(7);
            
            // 토큰 유효성 검사
            if (!userService.validateToken(actualToken)) {
                return ResponseEntity.status(HttpStatus.UNAUTHORIZED)
                    .body(Map.of("error", "유효하지 않은 토큰입니다."));
            }

            // 토큰에서 사용자 정보 추출
            Map<String, Object> userData = userService.getUserDataFromToken(actualToken);
            String userId = (String) userData.get("userId");
            
            // 사용자 정보 조회
            UserDTO userInfo = userService.findUserById(userId);
            return ResponseEntity.ok(userInfo);
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.UNAUTHORIZED)
                .body(Map.of("error", e.getMessage()));
        }
    }
}