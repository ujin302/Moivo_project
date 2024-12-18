package com.example.demo.qna.service;

import com.example.demo.qna.dto.QuestionDTO;
import com.example.demo.qna.entity.QuestionEntity;

import java.util.List;
import java.util.Map;

public interface QuestionService {
    public void addQuestion(QuestionDTO questionDTO);

    public void updateQuestion(QuestionDTO questionDTO);

    public void deleteQuestion(QuestionDTO questionDTO);

    //문의사항 비밀글 조회
    //프론트에서 받아온 게시글번호랑 비밀번호로 그 게시글번호에 맞는 글을 찾아서 비밀번호 맞으면 true 틀리면 false
    String privateBoardCheck(String privatepwd, int id);

    public Map<String, Object> getQuestionList(Map<String, Object> datemap);

    // FAQ 목록 조회
    List<QuestionDTO> getFaqList();
}