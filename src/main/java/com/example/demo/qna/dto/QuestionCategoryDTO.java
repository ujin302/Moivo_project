package com.example.demo.qna.dto;

import com.example.demo.qna.entity.QuestionCategoryEntity.QuestionCategory;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@AllArgsConstructor
@NoArgsConstructor
public class QuestionCategoryDTO {
    private Integer id; // 카테고리 고유 키
    private QuestionCategory name = QuestionCategory.DELIVERY; // 카테고리 이름
}