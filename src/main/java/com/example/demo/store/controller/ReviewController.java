package com.example.demo.store.controller;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.ModelAttribute;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;

import com.example.demo.store.dto.ReviewDTO;
import com.example.demo.store.service.ReviewService;
import org.springframework.web.bind.annotation.PostMapping;

@RestController
@RequestMapping("/api/user/review")
public class ReviewController {

    @Autowired
    private ReviewService reviewService;

    // 리뷰 작성
    @PostMapping("")
    public ResponseEntity<String> insertReview(@ModelAttribute ReviewDTO reviewDTO,
            @RequestParam(name = "userid") int userid,
            @RequestParam(name = "prductid") int productid) {

        reviewService.insertReview(reviewDTO, userid, productid);
        return ResponseEntity.ok("리뷰 작성");
    }

    // 리뷰 수정

    // 리뷰 삭제
}
