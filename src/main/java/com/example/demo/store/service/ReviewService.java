package com.example.demo.store.service;

import com.example.demo.store.dto.ReviewDTO;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;

public interface ReviewService {

    // 리뷰 작성
    void insertReview(ReviewDTO reviewDTO);

    // 리뷰 조회 (페이징 처리)
    public Page<ReviewDTO> getReviewsByProductIdAndPage(int productId, Pageable pageable);

    // 리뷰 수정
    public ReviewDTO updateReview(int reviewId, ReviewDTO reviewDTO);

    // 리뷰 삭제
    public ReviewDTO deleteReview(int reviewId);

    // 특정 사용자의 리뷰 조회
    public Page<ReviewDTO> getUserReviewsByProductId(int userId, int productId, Pageable pageable);

    // 사용자의 모든 리뷰 조회
    public Page<ReviewDTO> getAllUserReviews(int userId, Pageable pageable);

}
