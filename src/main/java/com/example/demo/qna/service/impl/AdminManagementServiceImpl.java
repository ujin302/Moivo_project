package com.example.demo.qna.service.impl;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import com.example.demo.qna.dto.QuestionDTO;
import com.example.demo.qna.entity.QuestionEntity;
import com.example.demo.qna.repository.QuestionRepository;
import com.example.demo.qna.service.AdminManagementService;
import com.example.demo.qna.repository.QuestionCategoryRepository;

import java.time.LocalDateTime;

@Service
public class AdminManagementServiceImpl implements AdminManagementService {

    @Autowired
    private QuestionRepository questionRepository;

    @Autowired
    private QuestionCategoryRepository questionCategoryRepository;

    @Override
    public void respondToQuestion(QuestionDTO questionDTO) {
        QuestionEntity question = questionRepository.findById(questionDTO.getId())
                .orElseThrow(() -> new RuntimeException("문의를 찾을 수 없습니다."));
        
        question.setResponse(questionDTO.getResponse());
        question.setResponseDate(LocalDateTime.now());
        
        questionRepository.save(question);
    }

    @Override
    public void updateResponse(QuestionDTO questionDTO) {
        questionRepository.updateResponse(questionDTO.getId(), questionDTO.getResponse(), questionDTO.getResponseDate());
    }

    @Override
    public void deleteResponse(Integer id) {
        questionRepository.updateResponse(id, null, null);
    }

}
