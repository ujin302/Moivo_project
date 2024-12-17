package com.example.demo.store.entity;

import java.time.LocalDateTime;

import com.example.demo.store.dto.ReviewDTO;
import com.example.demo.user.entity.UserEntity;
import com.example.demo.payment.entity.PaymentDetailEntity;

import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.GenerationType;
import jakarta.persistence.Id;
import jakarta.persistence.JoinColumn;
import jakarta.persistence.ManyToOne;
import jakarta.persistence.OneToOne;
import jakarta.persistence.Table;
import lombok.Data;

@Data
@Entity
@Table(name = "review")
public class ReviewEntity { // 리뷰
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Integer id; // 리뷰 고유 키

    // 리뷰 n개 : 사용자 1개
    @ManyToOne
    @JoinColumn(name = "userid", nullable = false)
    private UserEntity userEntity; // 사용자 (리뷰 작성자)

    // 리뷰 n개 : 상품 1개
    @ManyToOne
    @JoinColumn(name = "productid", nullable = false)
    private ProductEntity productEntity; // 상품 고유 키

    // 결제 상품 1개 : 리뷰 1개
    @OneToOne
    @JoinColumn(name = "paymentdetailid", nullable = false)
    private PaymentDetailEntity PaymentDetailEntity; // 결제제 상세 고유 키

    @Column(name = "rating", nullable = false)
    private int rating; // 평점 (1~5)

    @Column(name = "content", nullable = false)
    private String content; // 리뷰 내용

    @Column(name = "reviewdate", columnDefinition = "TIMESTAMP DEFAULT CURRENT_TIMESTAMP")
    private LocalDateTime reviewDate = LocalDateTime.now(); // 리뷰 작성 일시

    // dto => entity 변환

    // 리뷰 작성
    public static ReviewEntity toSaveReviewEntity(
            ReviewDTO dto, UserEntity userEntity,
            ProductEntity productEntity, PaymentDetailEntity detailEntity) {
        ReviewEntity entity = new ReviewEntity();
        entity.setUserEntity(userEntity);
        entity.setProductEntity(productEntity);
        entity.setPaymentDetailEntity(detailEntity);
        entity.setRating(dto.getRating());
        entity.setContent(dto.getContent());
        entity.setReviewDate(LocalDateTime.now()); // 리뷰 작성 일시 추가 12.17 성찬

        return entity;
    }

    public void updateReview(ReviewDTO reviewDTO) {
        this.rating = reviewDTO.getRating();
        this.content = reviewDTO.getContent();
    }

}
