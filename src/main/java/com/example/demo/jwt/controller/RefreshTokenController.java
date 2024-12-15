package com.example.demo.jwt.controller;

import com.example.demo.jwt.service.RefreshTokenService;
import com.example.demo.jwt.util.JwtUtil;

import jakarta.servlet.http.Cookie;
import jakarta.servlet.http.HttpServletRequest;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import java.util.Map;

@RestController
@RequestMapping("/api/auth")
@RequiredArgsConstructor
public class RefreshTokenController {

    private final JwtUtil jwtUtil;

    @PostMapping("/refresh")
    public ResponseEntity<?> refreshToken(HttpServletRequest request) {
        Cookie[] cookies = request.getCookies();
        System.out.println("쿠키에서 꺼낸 리프레시 토큰: " + cookies);
        String refreshToken = null;
        
        if (cookies != null) {
            for (Cookie cookie : cookies) {
                if ("refreshToken".equals(cookie.getName())) {
                    refreshToken = cookie.getValue();
                    break;
                }
            }
        }
        
        if (refreshToken == null) {
            return ResponseEntity.status(401).body("Refresh token not found");
        }
        
        if (!jwtUtil.validateToken(refreshToken) || jwtUtil.isTokenBlacklisted(refreshToken)) {
            return ResponseEntity.status(401).body("Invalid refresh token");
        }
        
        try {
            Map<String, Object> userData = jwtUtil.getUserDataFromToken(refreshToken);
            String userId = (String) userData.get("userId");
            int id = ((Number) userData.get("id")).intValue();
            int wishId = ((Number) userData.get("wishId")).intValue();
            int cartId = ((Number) userData.get("cartId")).intValue();
            boolean isAdmin = (boolean) userData.get("isAdmin");
            
            String newAccessToken = jwtUtil.generateAccessToken(userId, id, wishId, cartId, isAdmin);
            
            return ResponseEntity.ok(Map.of(
                "accessToken", newAccessToken,
                "isAdmin", isAdmin
            ));
        } catch (Exception e) {
            return ResponseEntity.status(401).body("Failed to process refresh token");
        }
    }
}
