package com.example.demo.user.controller;

import com.example.demo.user.service.KakaoService;

import jakarta.servlet.http.HttpServletResponse;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.io.IOException;
import java.util.HashMap;
import java.util.Map;

@RestController
@RequiredArgsConstructor
@RequestMapping("/api/oauth/kakao")
@CrossOrigin(origins = {
    "http://localhost:5173",
    "http://localhost:8080",
    "https://kauth.kakao.com",
    "https://kapi.kakao.com"
}, allowCredentials = "true")
public class KakaoController {
    
    private final KakaoService kakaoService;
    
    @GetMapping("/callback")
    public ResponseEntity<?> kakaoCallback(@RequestParam String code) {
        try {
            System.out.println("Received authorization code: " + code);
            Map<String, String> tokens = kakaoService.processKakaoLogin(code);
            System.out.println("Generated Tokens: " + tokens);

            if (tokens == null || tokens.isEmpty()) {
                throw new RuntimeException("토큰 생성 실패");
            }

            // null 체크를 포함한 응답 맵 생성
            Map<String, Object> response = new HashMap<>();
            response.put("accessToken", tokens.get("accessToken"));
            response.put("refreshToken", tokens.get("refreshToken"));
            response.put("userId", tokens.get("userId"));
            response.put("id", tokens.get("id"));
            response.put("cartId", tokens.get("cartId"));
            response.put("wishId", tokens.get("wishId"));
            response.put("isAdmin", tokens.get("isAdmin"));

            return ResponseEntity.ok(response);

        } catch (Exception e) {
            System.err.println("Error processing Kakao callback: " + e.getMessage());
            e.printStackTrace();
            return ResponseEntity.status(HttpStatus.UNAUTHORIZED)
                .body(new HashMap<String, String>() {{
                    put("error", e.getMessage() != null ? e.getMessage() : "Unknown error occurred");
                }});
        }
    }
}
  //_ 241210_yjy