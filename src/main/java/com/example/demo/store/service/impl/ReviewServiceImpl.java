package com.example.demo.store.service.impl;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.security.access.AccessDeniedException;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.security.core.userdetails.UserDetails;
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
        UserEntity userEntity = userRepository.findById(userid)
        .orElseThrow(() -> new RuntimeException("User not found")); 
        
        if (userEntity == null) {
            throw new RuntimeException("User not found");
        }
        ProductEntity productEntity = productRepository.findById(productid).orElseThrow();
        ReviewEntity entity = ReviewEntity.toSaveReviewEntity(reviewDTO, userEntity, productEntity);
        
        // 리뷰 저장
        reviewRepository.save(entity);
    }
    
    // 리뷰 조회 (페이징 처리)
    @Override
    public Page<ReviewDTO> getReviewsByProductIdAndPage(int productId, Pageable pageable) {
        return reviewRepository.findByProductEntityId(productId, pageable)
                .map(ReviewDTO::toGetReviewDTO);
    }
    
    // 리뷰 수정
    @Override
    public void updateReview(int reviewId, ReviewDTO reviewDTO) {
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
    }

    // 리뷰 삭제
    @Override
    public void deleteReview(int reviewId) {
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
    }
}
