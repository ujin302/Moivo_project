package com.example.demo.store.service.impl;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

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

    // 리뷰 작성
    @Override
    public void insertReview(ReviewDTO reviewDTO, int userid, int productid) {
        UserEntity userEntity = userRepository.findById(userid).orElseThrow();
        ProductEntity productEntity = productRepository.findById(productid).orElseThrow();
        ReviewEntity entity = ReviewEntity.toSaveReviewEntity(reviewDTO, userEntity, productEntity);

        // 리뷰 저장
        reviewRepository.save(entity);
    }

}
