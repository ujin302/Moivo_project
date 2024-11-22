package com.example.demo.qna.dto;

import java.time.LocalDateTime;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@AllArgsConstructor
@NoArgsConstructor
public class QuestionDTO {
    private Integer id; // 문의 고유 키
    private Integer categoryId; // 문의 카테고리
    private Integer userId; // 문의 작성
    private String content; // 문의 내용
    private LocalDateTime questionDate; // 문의 작성 일시
    private String response; // 관리자 응답 (NULL이면 미응답)
    private LocalDateTime responseDate; // 응답 일시 (NULL이면 미응답)
}
