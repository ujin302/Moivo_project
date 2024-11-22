package com.example.demo.store.entity;

import java.time.LocalDateTime;

import com.example.demo.store.dto.ReviewDTO;
import com.example.demo.user.entity.UserEntity;

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

    // 리뷰 1개 : 사용자 1개
    @OneToOne
    @JoinColumn(name = "userid", nullable = false)
    private UserEntity userEntity; // 사용자 (리뷰 작성자)

    // 리뷰 n개 : 상품 1개
    @ManyToOne
    @JoinColumn(name = "productid", nullable = false)
    private ProductEntity productEntity; // 상품 고유 키

    @Column(name = "rating", nullable = false)
    private int rating; // 평점 (1~5)

    @Column(name = "content", nullable = false)
    private String content; // 리뷰 내용

    @Column(name = "reviewdate", columnDefinition = "TIMESTAMP DEFAULT CURRENT_TIMESTAMP")
    private LocalDateTime reviewDate; // 리뷰 작성 일시

    // dto => entity 변환

    // 리뷰 작성
    public static ReviewEntity toSaveReviewDTO(ReviewDTO dto, UserEntity userEntity, ProductEntity productEntity) {
        ReviewEntity entity = new ReviewEntity();
        entity.setUserEntity(userEntity);
        entity.setProductEntity(productEntity);
        entity.setRating(dto.getRating());
        entity.setContent(dto.getContent());

        return entity;
    }

    // 리뷰 출력
    public static ReviewDTO toGetReviewDTO(ReviewEntity entity) {
        ReviewDTO dto = new ReviewDTO();
        dto.setId(entity.getId());
        dto.setUserId(entity.getUserEntity().getId());
        dto.setUserName(entity.getUserEntity().getName());
        dto.setProductId(entity.getProductEntity().getId());
        dto.setRating(entity.getRating());
        dto.setContent(entity.getContent());
        dto.setReviewDate(entity.getReviewDate());

        return dto;
    }
}
