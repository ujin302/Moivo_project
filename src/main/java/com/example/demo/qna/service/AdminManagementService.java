package com.example.demo.qna.service;

import java.util.List;

import com.example.demo.qna.dto.QuestionDTO;
import com.example.demo.qna.dto.QuestionCategoryDTO;
import org.springframework.data.domain.Page;

public interface AdminManagementService {
    public List<QuestionDTO> getAllQuestions();
    public void respondToQuestion(Integer questionId, String response);
    public void updateResponse(Integer questionId, String response);
    public void deleteResponse(Integer questionId);
    public List<QuestionCategoryDTO> getQuestionCategories();
}


