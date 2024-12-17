package com.example.demo.store.service.impl;

import org.springframework.beans.factory.annotation.Autowired;
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

}
