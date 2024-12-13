package com.example.demo.user.controller;

import java.util.HashMap;
import java.util.Map;

import org.springframework.security.crypto.bcrypt.BCrypt;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.userdetails.UserDetails;
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
    @PostMapping("/join")
    public ResponseEntity<String> signup(@RequestBody UserDTO userDTO) {
        System.out.println("FDFSFSFSFSDFSFSFSFSF");
        int userId = userService.insert(userDTO);
        System.out.println("userId = " + userId);
        // 회원가입이 성공한 후, LV1 쿠폰 발급 2024.11.25 sumin
        try {
            // 회원가입 후 LV1 쿠폰 발급
            System.out.println("쿠폰 발급 시도");
            userCouponService.updateCouponByUserAndGrade(userId, "LV1");  // LV1 쿠폰 발급
            System.out.println("회원가입 후 LV1 쿠폰 발급 완료");
        } catch (Exception e) {
            return new ResponseEntity<>("회원가입 후 쿠폰 발급 실패: " + e.getMessage(), HttpStatus.INTERNAL_SERVER_ERROR);
        }
        return new ResponseEntity<>("회원가입 성공: " + userId, HttpStatus.CREATED);
    }

 
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


     // 회원정보 수정 - sumin (2024.12.12)
    @PostMapping("/mypage/update")
    public ResponseEntity<String> updateUserInfo(@RequestBody UserDTO userDTO, @RequestHeader("Authorization") String token) {
        try {
            System.out.println("생일출력 = " + userDTO.getBirth());
            // 토큰에서 사용자 ID 추출
            String actualToken = token.substring(7); // "Bearer " 제거
            Map<String, Object> userData = jwtUtil.getUserDataFromToken(actualToken);
            String userIdFromToken = (String) userData.get("userId");

            // 사용자 ID 일치 여부 확인 (보안 검증)
            if (!userIdFromToken.equals(userDTO.getUserId())) {
                return ResponseEntity.status(HttpStatus.FORBIDDEN).body("권한이 없습니다.");
            }

            // 회원 정보 업데이트 처리
            userService.updateUserInfo(userDTO);

            return ResponseEntity.ok("회원정보가 성공적으로 수정되었습니다.");
        } catch (Exception e) {
            System.err.println("회원정보 수정 실패: " + e.getMessage());
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
                                .body("회원정보 수정 중 오류가 발생했습니다.");
        }
    }
    @PostMapping("/mypage/delete")
    public ResponseEntity<Map<String, String>> deleteUser(@RequestHeader("Authorization") String token,
                                                          @RequestBody Map<String, Object> requestData) {
        Integer userIdFromRequest = (Integer) requestData.get("userId");
        String passwordFromRequest = (String) requestData.get("pwd");
    
        System.out.println("userId = " + userIdFromRequest);
        System.out.println("pwd = " + passwordFromRequest);
    
        try {
            // Authorization 헤더에서 실제 토큰 값 추출
            if (token == null || !token.startsWith("Bearer ")) {
                return ResponseEntity.status(HttpStatus.FORBIDDEN).body(Map.of("message", "토큰이 잘못되었습니다."));
            }
    
            String actualToken = token.trim().substring(7); // "Bearer " 제거 후 공백 제거
    
            // 토큰에서 사용자 ID 추출
            Map<String, Object> userData = jwtUtil.getUserDataFromToken(actualToken);
            System.out.println("userData = " + userData);
            int userIdFromToken = (Integer) userData.get("id");
            System.out.println(userIdFromToken);
    
            // 사용자 ID 일치 여부 확인 (보안 검증)
            if (userIdFromToken == userIdFromRequest) {
                // 비밀번호 검증
                if (!userService.checkPassword(userIdFromRequest, passwordFromRequest)) {
                    Map<String, String> response = new HashMap<>();
                    response.put("message", "비밀번호가 일치하지 않습니다.");
                    return ResponseEntity.status(HttpStatus.FORBIDDEN).body(response);
                }
    
                // 회원 탈퇴 처리
                userService.deleteUser(userIdFromRequest);
                Map<String, String> response = new HashMap<>();
                response.put("message", "회원 탈퇴가 완료되었습니다.");
                return ResponseEntity.ok(response);
            } else {
                Map<String, String> response = new HashMap<>();
                response.put("message", "권한이 없습니다.");
                return ResponseEntity.status(HttpStatus.FORBIDDEN).body(response);
            }
    
        } catch (NumberFormatException e) {
            Map<String, String> response = new HashMap<>();
            response.put("message", "잘못된 사용자 ID 형식입니다.");
            return ResponseEntity.status(HttpStatus.BAD_REQUEST).body(response);
        } catch (IllegalArgumentException e) {
            Map<String, String> response = new HashMap<>();
            response.put("message", "회원 탈퇴 실패: " + e.getMessage());
            return ResponseEntity.status(HttpStatus.BAD_REQUEST).body(response);
        } catch (Exception e) {
            Map<String, String> response = new HashMap<>();
            response.put("message", "회원 탈퇴 중 오류가 발생했습니다.");
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body(response);
        }
    }
    
}