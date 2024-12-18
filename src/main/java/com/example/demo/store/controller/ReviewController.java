package com.example.demo.store.controller;

import org.apache.http.HttpStatus;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.ModelAttribute;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import com.example.demo.store.dto.ReviewDTO;
import com.example.demo.store.service.ReviewService;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.domain.Sort;
import org.springframework.data.web.PageableDefault;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/user/review")
public class ReviewController {

    @Autowired
    private ReviewService reviewService;

    // 24.12.17 - uj (수정)
    // 리뷰 작성 -> 주문상세 페이지에서 모달 또는 페이지를 따로 띄워서 리뷰 작성 진행.
    @PostMapping("")
    public ResponseEntity<String> insertReview(@RequestBody ReviewDTO reviewDTO) {
        try {
            reviewService.insertReview(reviewDTO);
            return ResponseEntity.ok("리뷰 작성 성공");
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

    // 리뷰 조회 (페이징 처리)
    @GetMapping("/{productId}")
    public ResponseEntity<Page<ReviewDTO>> getReviewsByPage(
            @PathVariable int productId,
            @PageableDefault(size = 5, sort = "id", direction = Sort.Direction.DESC) Pageable pageable) {
        Page<ReviewDTO> reviews = reviewService.getReviewsByProductIdAndPage(productId, pageable);
        return ResponseEntity.ok(reviews);
    }

    // 리뷰 수정
    @PutMapping("/{reviewId}")
    public ResponseEntity<ReviewDTO> updateReview(@PathVariable int reviewId, @RequestBody ReviewDTO reviewDTO) {
        ReviewDTO updatedReview = reviewService.updateReview(reviewId, reviewDTO);
        return ResponseEntity.ok(updatedReview);
    }

    // 리뷰 삭제
    @DeleteMapping("/{reviewId}")
    public ResponseEntity<ReviewDTO> deleteReview(@PathVariable int reviewId) {
        ReviewDTO deletedReview = reviewService.deleteReview(reviewId);
        return ResponseEntity.ok(deletedReview);
    }

    // 특정 사용자의 리뷰 조회
    @GetMapping("/user/{userId}/{productId}")
    public ResponseEntity<Page<ReviewDTO>> getUserReviewsByPage(
            @PathVariable int userId,
            @PathVariable int productId,
            @PageableDefault(size = 5, sort = "id", direction = Sort.Direction.DESC) Pageable pageable) {
        Page<ReviewDTO> reviews = reviewService.getUserReviewsByProductId(userId, productId, pageable);
        return ResponseEntity.ok(reviews);
    }
}


/* 

1. 리뷰 작성
HTTP Method: POST
URL: /api/user/review
Request Body: ReviewDTO (리뷰 내용 포함)
Parameters:
userid: 작성자 ID
productid: 상품 ID
2. 리뷰 조회
HTTP Method: GET
URL: /api/user/review/{productId}
Path Variable: productId (리뷰를 조회할 상품 ID)
3. 리뷰 수정
HTTP Method: PUT
URL: /api/user/review/{reviewId}
Path Variable: reviewId (수정할 리뷰 ID)
Request Body: ReviewDTO (수정할 내용 포함)
4. 리뷰 삭제
HTTP Method: DELETE
URL: /api/user/review/{reviewId}
Path Variable: reviewId (삭제할 리뷰 ID)

*/
