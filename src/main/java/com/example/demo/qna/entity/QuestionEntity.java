package com.example.demo.qna.entity;

import java.time.LocalDateTime;

import com.example.demo.user.entity.UserEntity;

import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.GenerationType;
import jakarta.persistence.Id;
import jakarta.persistence.JoinColumn;
import jakarta.persistence.ManyToOne;
import jakarta.persistence.Table;
import lombok.Data;

@Data
@Entity
@Table(name = "question")
public class QuestionEntity {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Integer id; // 문의 고유 키

    // 문의 n개 : 카테고리 1개
    @ManyToOne
    @JoinColumn(name = "categoryid", nullable = false) // 카테고리와 연결
    private QuestionCategoryEntity categoryEntity; // 문의 카테고리

    // 문의 n개 : 사용자 1개
    @ManyToOne
    @JoinColumn(name = "userid", nullable = false)
    private UserEntity userEntity; // 문의 작성

    @Column(name = "content", nullable = false)
    private String content; // 문의 내용

    @Column(name = "questiondate", columnDefinition = "TIMESTAMP DEFAULT CURRENT_TIMESTAMP")
    private LocalDateTime questionDate; // 문의 작성 일시

    @Column(name = "response")
    private String response; // 관리자 응답 (NULL이면 미응답)

    @Column(name = "responsedate")
    private LocalDateTime responseDate; // 응답 일시 (NULL이면 미응답)
}
