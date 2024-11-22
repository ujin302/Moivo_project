package com.example.demo.store.dto;

import java.time.LocalDateTime;

import com.example.demo.store.entity.ReviewEntity;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@NoArgsConstructor
@AllArgsConstructor
public class ReviewDTO { // 리뷰
    private Integer id; // 리뷰 고유 키
    private Integer userId; // 리뷰 작성자 PK
    private String userName; // 리뷰 작성자 Name
    private int productId; // 상품 고유 키
    private int rating; // 평점 (1~5)
    private String content; // 리뷰 내용
    private LocalDateTime reviewDate; // 리뷰 작성 일시

    // entity => dto 변환

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
