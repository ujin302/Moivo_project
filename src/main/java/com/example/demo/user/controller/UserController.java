package com.example.demo.user.controller;

import java.util.Map;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import com.example.demo.coupon.service.UserCouponService;
import com.example.demo.user.dto.UserDTO;
import com.example.demo.user.service.UserService;

@RestController
@RequestMapping("/api/user")
public class UserController {

    @Autowired
    private UserService userService;

    @Autowired
    private UserCouponService userCouponService;

// 회원가입
@PostMapping("/join")
public ResponseEntity<String> signup(@RequestBody UserDTO userDTO) {
    int userId = userService.insert(userDTO);

    // 회원가입이 성공한 후, LV1 쿠폰 발급
    try {
        userCouponService.updateCouponByUserAndGrade(userId, "LV1");  // LV1 쿠폰 발급
        System.out.println("회원가입 후 LV1 쿠폰이 발급되었습니다.");
    } catch (Exception e) {
        return new ResponseEntity<>("회원가입 후 쿠폰 발급 실패: " + e.getMessage(), HttpStatus.INTERNAL_SERVER_ERROR);
    }

    return new ResponseEntity<>("회원가입 성공: " + userId, HttpStatus.CREATED);
}

    // 결제에 따른 등급 업데이트
    @PostMapping("/updateGrade/{userId}")
    public ResponseEntity<Void> updateUserGrade(@PathVariable int userId) {
        try {
            userService.updateUserGradeBasedOnPurchase(userId);
            return ResponseEntity.ok().build(); // 200 OK 상태 코드만 반환
        } catch (RuntimeException e) {
            return ResponseEntity.status(HttpStatus.NOT_FOUND).build(); // 404 NOT FOUND 상태 코드만 반환
        }
    }

    // 로그인 API
    @PostMapping("/login")
    public ResponseEntity<Map<String, Object>> login(@RequestBody UserDTO userDTO) {
        System.out.println("=== 로그인 시도 ===");
        System.out.println("받은 ID: " + userDTO.getUserId());
        System.out.println("받은 비밀번호 길이: " + (userDTO.getPwd() != null ? userDTO.getPwd().length() : "null"));

        try {
            Map<String, Object> result = userService.login(userDTO.getUserId(), userDTO.getPwd());
            return ResponseEntity.ok(result);
        } catch (RuntimeException e) {
            return ResponseEntity.status(HttpStatus.UNAUTHORIZED).body(Map.of("error", e.getMessage()));
        }
    }

    // 토큰 갱신 _241126_sc
    @PostMapping("/refresh-token")
    public ResponseEntity<Map<String, Object>> refreshToken(@RequestBody Map<String, String> payload) {
        try {
            String userId = payload.get("userId");
            String pwd = payload.get("pwd");
            
            // 기존 login 메서드를 재사용하여 새 토큰 발급
            Map<String, Object> result = userService.login(userId, pwd);
            return ResponseEntity.ok(result);
        } catch (RuntimeException e) {
            return ResponseEntity.status(HttpStatus.UNAUTHORIZED)
                            .body(Map.of("error", "토큰 갱신 실패: " + e.getMessage()));
        }
    }
    // 토큰 유효성 검사 _241126_sc
    @GetMapping("/validate-token")
    public ResponseEntity<Void> validateToken(@RequestHeader("Authorization") String token) {
        try {
            // 토큰 유효성 검사 로직
            if (token != null && token.startsWith("Bearer ")) {
                String jwt = token.substring(7);
                // JWT 유효성 검증
                if (userService.validateToken(jwt)) {
                    return ResponseEntity.ok().build();
                }
            }
            return ResponseEntity.status(HttpStatus.UNAUTHORIZED).build();
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.UNAUTHORIZED).build();
        }
    }

    // 로그아웃
    @PostMapping("/logout")
    public ResponseEntity<String> logout(@RequestHeader("Authorization") String token) {
        userService.logout(token); // 로그아웃 로직 서비스 호출
        return ResponseEntity.ok("로그아웃 성공");
    }

    // 소셜 로그인


}
