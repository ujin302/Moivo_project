package com.example.demo.store.service.impl;

import java.time.LocalDateTime;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.stereotype.Service;

import com.example.demo.payment.entity.PaymentDetailEntity;
import com.example.demo.payment.repository.PaymentDetailRepository;
import com.example.demo.store.dto.ReviewDTO;
import com.example.demo.store.entity.ProductEntity;
import com.example.demo.store.entity.ReviewEntity;
import com.example.demo.store.repository.ProductRepository;
import com.example.demo.store.repository.ReviewRepository;
import com.example.demo.store.service.ReviewService;
import com.example.demo.user.entity.UserEntity;
import com.example.demo.user.repository.UserRepository;

@Service
public class ReviewServiceImpl implements ReviewService {

    @Autowired
    private ReviewRepository reviewRepository;

    @Autowired
    private UserRepository userRepository;

    @Autowired
    private ProductRepository productRepository;

    @Autowired
    private PaymentDetailRepository detailRepository;

    // 24.12.17, 19 - uj (수정)
    // 리뷰 작성
    @Override
    public void insertReview(ReviewDTO reviewDTO) {
        UserEntity userEntity = userRepository.findById(reviewDTO.getUserId())
                .orElseThrow(() -> new RuntimeException("User not found"));

        PaymentDetailEntity paymentDetailEntity = detailRepository.findById(
                reviewDTO.getPaymentDetailId()).orElseThrow();

        // 리뷰 중복 작성 방지
        System.out.println("리뷰 작성 여부 : " + paymentDetailEntity.isWriteReview());
        if (!paymentDetailEntity.isWriteReview()) {
            ProductEntity productEntity = productRepository.findById(reviewDTO.getProductId()).orElseThrow();

            ReviewEntity entity = ReviewEntity.toSaveReviewEntity(
                    reviewDTO, userEntity,
                    productEntity, paymentDetailEntity);

            // 리뷰 저장
            ReviewEntity reviewEntity = reviewRepository.save(entity);

            // 24.12.19 - DB 구조 변경으로 인해 추가 - uj
            paymentDetailEntity.setReviewEntity(reviewEntity);
            paymentDetailEntity.setWriteReview(true);
            detailRepository.save(paymentDetailEntity);
        } else {
            throw new RuntimeException("결제 상품에 대한 리뷰를 이미 작성하였습니다.");
        }

        System.out.println("리뷰 작성 성공");
    }

    // 리뷰 조회 (페이징 처리)
    @Override
    public Page<ReviewDTO> getReviewsByProductIdAndPage(int productId, Pageable pageable) {
        return reviewRepository.findByProductEntityId(productId, pageable)
                .map(ReviewDTO::toGetReviewDTO);
    }

    // 특정 사용자의 리뷰 조회
    @Override
    public Page<ReviewDTO> getUserReviewsByProductId(int userId, int productId, Pageable pageable) {
        return reviewRepository.findByUserEntityIdAndProductEntityId(userId, productId, pageable)
                .map(ReviewDTO::toGetReviewDTO);
    }

    // 사용자의 모든 리뷰 조회
    @Override
    public Page<ReviewDTO> getAllUserReviews(int userId, Pageable pageable) {
        System.out.println("서비스 레이어 - 사용자 리뷰 조회 시작 - userId: " + userId);
        Page<ReviewDTO> reviews = reviewRepository.findByUserEntityId(userId, pageable)
                .map(ReviewDTO::toGetReviewDTO);
        System.out.println("조회된 리뷰 수: " + reviews.getContent().size());
        return reviews;
    }

    // 리뷰 수정
    @Override
    public void updateReview(int reviewId, ReviewDTO reviewDTO) {
        ReviewEntity review = reviewRepository.findById(reviewId)
                .orElseThrow(() -> new RuntimeException("Review not found"));

        System.out.println("수정할 리뷰 ID: " + reviewId);
        System.out.println("수정 데이터: " + reviewDTO);

        // 리뷰 내용 업데이트
        review.setRating(reviewDTO.getRating());
        review.setContent(reviewDTO.getContent().trim());
        review.setReviewDate(LocalDateTime.now());

        // 리뷰 저장
        reviewRepository.save(review);
    }

    // 리뷰 삭제
    @Override
    public void deleteReview(int reviewId) {
        ReviewEntity review = reviewRepository.findById(reviewId)
                .orElseThrow(() -> new RuntimeException("Review not found"));

        // 리뷰 작성 여부 false로 변경
        PaymentDetailEntity paymentDetail = review.getPaymentDetailEntity();
        paymentDetail.setWriteReview(false);
        detailRepository.save(paymentDetail);

        reviewRepository.delete(review);
    }

    @Override
    public ReviewDTO getReview(int reviewId) {
        ReviewEntity review = reviewRepository.findById(reviewId)
                .orElseThrow(() -> new RuntimeException("Review not found"));
        return ReviewDTO.toGetReviewDTO(review);
    }

    @Override
    public ReviewDTO getReviewByPaymentDetailId(int paymentDetailId) {
        ReviewEntity review = reviewRepository.findByPaymentDetailEntityId(paymentDetailId)
                .orElseThrow(() -> new RuntimeException("Review not found"));
        return ReviewDTO.toGetReviewDTO(review);
    }

}
