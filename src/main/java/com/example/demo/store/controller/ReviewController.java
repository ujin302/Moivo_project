package com.example.demo.store.controller;

import java.util.HashMap;
import java.util.Map;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import com.example.demo.store.service.ReviewService;

@RestController
@RequestMapping("/api/store/review")
public class ReviewController {

    @Autowired
    private ReviewService reviewService;
    // 리뷰 작성
    // 리뷰 수정
    // 리뷰 삭제

    // 테스트 API: React와 Spring Boot 연결 확인
    @GetMapping("/test")
    public Map<String, String> testApi() {
        Map<String, String> response = new HashMap<>();
        response.put("message", "Spring Boot와 React 연결 성공!");
        return response;
    }


}
