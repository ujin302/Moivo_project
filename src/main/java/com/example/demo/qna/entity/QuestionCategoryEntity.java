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
        ALL("전체문의"),
        BASIC("일반문의"),
        PRIVATE("비밀문의"),
        SIZE("사이즈문의"),
        OTHER("기타문의");

        private final String displayName;

        QuestionCategory(String displayName) {
            this.displayName = displayName;
        }

        public String getDisplayName() {
            return displayName;
        }
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
