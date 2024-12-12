package com.example.demo.qna.service;

import java.util.List;

import com.example.demo.qna.dto.QuestionDTO;

public interface AdminManagementService {
    public List<QuestionDTO> getAllQuestions(String category, String secret);
    public void respondToQuestion(QuestionDTO questionDTO);
    public void updateResponse(QuestionDTO questionDTO);
    public void deleteResponse(Integer id);
}


