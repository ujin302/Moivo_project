package com.example.demo.user.controller;

import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;
import com.example.demo.user.service.AdminUserService;
import lombok.RequiredArgsConstructor;
import java.util.Map;

// 24.12.13 _ yjy
@RestController
@RequestMapping("/api/admin/users")
@RequiredArgsConstructor
public class AdminUserController {

    private final AdminUserService adminUserService;
    
    // 회원 현황 통계 조회
    @GetMapping("/states")
    public ResponseEntity<Map<String, Object>> getUserStates() {
        return ResponseEntity.ok(adminUserService.getUserStates());
    }
    
    // 등급별 회원 수 조회
    @GetMapping("/states/grade")
    public ResponseEntity<Map<String, Integer>> getUserCountByGrade() {
        return ResponseEntity.ok(adminUserService.getUserCountByGrade());
    }
}
