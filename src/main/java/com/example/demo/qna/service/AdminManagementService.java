package com.example.demo.qna.service;

import java.util.List;

import com.example.demo.qna.dto.QuestionDTO;

public interface AdminManagementService {
    public void respondToQuestion(QuestionDTO questionDTO); // 문의에 대한 응답 메서드
    public void updateResponse(QuestionDTO questionDTO);
    public void deleteResponse(Integer id);
    public List<QuestionDTO> getAllQuestionsIncludingSecret();
    public boolean checkAdminStatus();
}


