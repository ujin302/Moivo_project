package com.example.demo.qna.service;

import com.example.demo.qna.dto.QuestionDTO;
import com.example.demo.qna.entity.QuestionEntity;

import java.util.List;
import java.util.Map;

public interface QuestionService {
    public QuestionEntity addQuestion(QuestionDTO questionDTO);

    public void updateQuestion(QuestionDTO questionDTO);

    public void deleteQuestion(QuestionDTO questionDTO);

    public Map<String, Object> getQuestionList(Map<String, Object> datemap);

    // FAQ 목록 조회
    List<QuestionDTO> getFaqList();
}