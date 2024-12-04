package com.example.demo.jwt.controller;

import com.example.demo.jwt.service.BlacklistService;
import com.example.demo.jwt.service.RefreshTokenService;
import com.example.demo.jwt.util.JwtUtil;
import com.example.demo.user.service.UserService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.web.bind.annotation.*;

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
    @Autowired 
    private BlacklistService blacklistService;
    @Autowired
    private PasswordEncoder passwordEncoder;


    // Access 토큰 재발급 API
    @PostMapping("/token/refresh")
    public ResponseEntity<?> refreshAccessToken(HttpServletRequest request) {
        String refreshToken = request.getHeader("Authorization").replace("Bearer ", "");

        if (!jwtUtil.validateToken(refreshToken)) {
            return ResponseEntity.status(401).body("Invalid Refresh Token");
        }

        if (refreshTokenService.isTokenBlacklisted(refreshToken)) {
            return ResponseEntity.status(401).body("Token is blacklisted");
        }

        String userId = jwtUtil.getUserIdFromToken(refreshToken);
        int id = jwtUtil.getIdFromToken(refreshToken);
        int wishId = userService.getWishIdById(id);
        int cartId = userService.getCartIdById(id);
        
        String newAccessToken = jwtUtil.generateAccessToken(userId, id, wishId, cartId);

        return ResponseEntity.ok(Map.of("accessToken", newAccessToken));
    }

    
}
