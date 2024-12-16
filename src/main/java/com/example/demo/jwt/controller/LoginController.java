package com.example.demo.jwt.controller;

import com.example.demo.jwt.service.BlacklistService;
import com.example.demo.jwt.service.RefreshTokenService;
import com.example.demo.jwt.util.JwtUtil;
import com.example.demo.user.service.UserService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.web.bind.annotation.*;

import jakarta.servlet.http.Cookie;
import jakarta.servlet.http.HttpServletRequest;

import java.util.Map;

@RestController
@RequestMapping("/api/auth")
public class LoginController {
    @Autowired 
    private JwtUtil jwtUtil;
    @Autowired 
    private UserService userService;
    @Autowired 
    private RefreshTokenService refreshTokenService;

    // Access 토큰 재발급 API
    @PostMapping("/token/refresh")
    public ResponseEntity<?> refreshAccessToken(HttpServletRequest request) {
        // HTTP-only 쿠키에서 리프레시 토큰 추출
        Cookie[] cookies = request.getCookies();
        String refreshToken = null;
        System.out.println("리프레시 토큰 재발급 요청 받음" + cookies);
        
        if (cookies != null) {
            for (Cookie cookie : cookies) {
                if ("refreshToken".equals(cookie.getName())) {
                    refreshToken = cookie.getValue();
                    break;
                }
            }
        }

        // 리프레시 토큰이 없는 경우
        if (refreshToken == null) {
            return ResponseEntity.status(401).body("리프레시 토큰이 없습니다.");
        }

        // 토큰 유효성 검사
        if (!jwtUtil.validateToken(refreshToken)) {
            return ResponseEntity.status(401).body("토큰이 유효하지 않습니다.");
        }

        // 블랙리스트 체크
        if (refreshTokenService.isTokenBlacklisted(refreshToken)) {
            return ResponseEntity.status(401).body("블랙리스트에 등록된 토큰입니다.");
        }

        try {
            // 토큰에서 사용자 정보 추출
            String userId = jwtUtil.getUserIdFromToken(refreshToken);
            int id = jwtUtil.getIdFromToken(refreshToken);
            int wishId = userService.getWishIdById(id);
            int cartId = userService.getCartIdById(id);
            
            // isAdmin 값을 토큰에서 가져오는 대신 사용자 정보에서 조회
            boolean isAdmin = userService.isUserAdmin(id);
            
            // 새로운 액세스 토큰 생성
            String newAccessToken = jwtUtil.generateAccessToken(userId, id, wishId, cartId, isAdmin);

            return ResponseEntity.ok(Map.of(
                "newAccessToken", newAccessToken,
                "isAdmin", isAdmin
            ));
        } catch (Exception e) {
            return ResponseEntity.status(401).body("토큰 갱신 실패");
        }
    }

    
}
