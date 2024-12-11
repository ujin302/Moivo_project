package com.example.demo.qna.service;

import com.example.demo.qna.dto.QuestionDTO;

public interface QuestionService {

    // 문의 작성
    public QuestionDTO createQuestion(QuestionDTO questionDTO);

    // 문의 수정
    public QuestionDTO updateQuestion(Integer id, QuestionDTO questionDTO);

    // 문의 삭제
    public void deleteQuestion(Integer id);


    

}
