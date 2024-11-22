package com.example.demo.user.controller;

import java.util.Map;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import com.example.demo.user.dto.UserDTO;
import com.example.demo.user.service.UserService;

@RestController
@RequestMapping("/api/user")
public class UserController {

    @Autowired
    private UserService userService;

    
    //회원가입
    @PostMapping("/join")
    public ResponseEntity<String> signup(@RequestBody UserDTO userDTO) {
        int userSeq = userService.insert(userDTO);
        return new ResponseEntity<>("회원가입 성공: " + userSeq, HttpStatus.CREATED);
    }

    // 로그인 API
    @PostMapping("/login")
    public ResponseEntity<Map<String, Object>> login(@RequestBody UserDTO userDTO) {
        System.out.println("=== 로그인 시도 ===");
        System.out.println("받은 ID: " + userDTO.getId());
        System.out.println("받은 비밀번호 길이: " + (userDTO.getPwd() != null ? userDTO.getPwd().length() : "null"));

        try {
            Map<String, Object> result = userService.login(userDTO.getUserId(), userDTO.getPwd());
            return ResponseEntity.ok(result);
        } catch (RuntimeException e) {
            return ResponseEntity.status(HttpStatus.UNAUTHORIZED).body(Map.of("error", e.getMessage()));
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
