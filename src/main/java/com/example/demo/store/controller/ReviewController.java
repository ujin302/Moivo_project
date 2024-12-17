package com.example.demo.store.controller;

import org.apache.http.HttpStatus;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.ModelAttribute;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import com.example.demo.store.dto.ReviewDTO;
import com.example.demo.store.service.ReviewService;
import org.springframework.web.bind.annotation.PostMapping;

@RestController
@RequestMapping("/api/user/review")
public class ReviewController {

    @Autowired
    private ReviewService reviewService;

    // 24.12.17 - uj (수정)
    // 리뷰 작성 -> 주문상세 페이지에서 모달 또는 페이지를 따로 띄워서 리뷰 작성 진행.
    @PostMapping("")
    public ResponseEntity<String> insertReview(@ModelAttribute ReviewDTO reviewDTO) {
        try {
            reviewService.insertReview(reviewDTO);
            return ResponseEntity.ok("리뷰 작성");
        } catch (RuntimeException e) {
            e.printStackTrace();
            if (e.getMessage().toLowerCase().contains("user")) {
                return ResponseEntity.status(HttpStatus.SC_NOT_FOUND).body(e.getMessage());
            }
            // 리뷰 중복 작성
            return ResponseEntity.status(HttpStatus.SC_CONFLICT).body(e.getMessage());
        } catch (Exception e) {
            e.printStackTrace();
            return ResponseEntity.status(HttpStatus.SC_EXPECTATION_FAILED).body(null);
        }
    }

    // 리뷰 수정

    // 리뷰 삭제
}
