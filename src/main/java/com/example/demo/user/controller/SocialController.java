package com.example.demo.user.controller;

import org.apache.http.HttpStatus;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import com.example.demo.user.service.SocialService;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestParam;

@RestController
@RequestMapping("api/user/social")
public class SocialController {

    @Autowired
    private SocialService socialService;

    // 24.12.16 - uj
    // 카카오 승인 URI 요청
    @GetMapping("/kakao")
    public ResponseEntity<?> getKakaoURI() {
        try {
            String kakaoURI = socialService.getKakaoURI();
            return ResponseEntity.ok(kakaoURI);
        } catch (Exception e) {
            e.printStackTrace();
            return ResponseEntity.status(HttpStatus.SC_EXPECTATION_FAILED).body(null);
        }
    }

    // 24.12.16 - uj
    // 카카오 로그인 or 회원가입
    @GetMapping("/kakao/login")
    public ResponseEntity<?> getKakaoLogin(@RequestParam(name = "code") String code) {
        try {
            socialService.getKakaoLogin(code);
            return ResponseEntity.ok(null);
        } catch (NullPointerException e) {
            // 카카오 서버에서 회원 정보 추출 실패
            e.printStackTrace();
            return ResponseEntity.status(HttpStatus.SC_NOT_FOUND).body(e.getMessage());
        } catch (Exception e) {
            e.printStackTrace();
            return ResponseEntity.status(HttpStatus.SC_EXPECTATION_FAILED).body(null);
        }
    }

}
