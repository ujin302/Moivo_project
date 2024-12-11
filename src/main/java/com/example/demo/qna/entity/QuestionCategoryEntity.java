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
        BASIC, // 일반
        PRIVATE, // 비밀
        OTHER, // 기타
        SIZE // 사이즈
    }

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Integer id; // 카테고리 고유 키

    @Enumerated(EnumType.STRING)
    @Column(name = "name", nullable = false, unique = true, length = 50)
    private QuestionCategory name = QuestionCategory.BASIC; // 카테고리 이름

    @OneToMany(mappedBy = "categoryEntity", cascade = CascadeType.ALL, orphanRemoval = true)
    @ToString.Exclude
    private List<QuestionEntity> questionList; // 문의 목록
}
