package com.example.demo.store.service.impl;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.security.access.AccessDeniedException;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.security.core.userdetails.UserDetails;
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

// 24.12.17 - uj (수정)
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
            reviewRepository.save(entity);

            // 리뷰 작성 여부 저장
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

    // 리뷰 수정
    @Override
    public ReviewDTO updateReview(int reviewId, ReviewDTO reviewDTO) {
        ReviewEntity reviewEntity = reviewRepository.findById(reviewId)
                .orElseThrow(() -> new RuntimeException("Review not found"));

        // 현재 사용자 정보 가져오기
        UserDetails userDetails = (UserDetails) SecurityContextHolder.getContext().getAuthentication().getPrincipal();
        String currentUsername = userDetails.getUsername();

        // 리뷰 작성자와 현재 사용자 비교
        if (!reviewEntity.getUserEntity().getUserId().equals(currentUsername)) {
            throw new AccessDeniedException("해당 리뷰를 수정할 권한이 없습니다.");
        }

        reviewEntity.updateReview(reviewDTO);
        reviewRepository.save(reviewEntity);

        // 수정된 리뷰 DTO 반환
        return ReviewDTO.toGetReviewDTO(reviewEntity);
    }

    // 리뷰 삭제
    @Override
    public ReviewDTO deleteReview(int reviewId) {
        ReviewEntity reviewEntity = reviewRepository.findById(reviewId)
                .orElseThrow(() -> new RuntimeException("Review not found"));

        // 현재 사용자 정보 가져오기
        UserDetails userDetails = (UserDetails) SecurityContextHolder.getContext().getAuthentication().getPrincipal();
        String currentUsername = userDetails.getUsername();

        // 리뷰 작성자와 현재 사용자 비교
        if (!reviewEntity.getUserEntity().getUserId().equals(currentUsername)) {
            throw new AccessDeniedException("해당 리뷰를 삭제할 권한이 없습니다.");
        }

        reviewRepository.delete(reviewEntity);

        // 삭제된 리뷰 DTO 반환
        return ReviewDTO.toGetReviewDTO(reviewEntity);
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
}
