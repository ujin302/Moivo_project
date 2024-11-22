package com.example.demo.qna.entity;

import java.util.List;

import jakarta.persistence.*;
import lombok.Data;
import lombok.ToString;

@Entity
@Table(name = "questioncategory")
@Data
public class QuestionCategoryEntity {

    public enum QuestionCategory {
        DELIVERY, // 배송
        PRODUCT, // 상품
        RETURN, // 반품
        REFUND, // 환불
        OTHER // 기타
    }

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Integer id; // 카테고리 고유 키

    @Column(name = "name", nullable = false, unique = true, length = 50)
    private QuestionCategory name = QuestionCategory.DELIVERY; // 카테고리 이름

    @OneToMany(mappedBy = "categoryEntity", cascade = CascadeType.ALL, orphanRemoval = true)
    @ToString.Exclude
    private List<QuestionEntity> questionList; // 문의 목록
}
