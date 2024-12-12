package com.example.demo.qna.service.impl;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import com.example.demo.qna.dto.QuestionDTO;
import com.example.demo.qna.entity.QuestionEntity;
import com.example.demo.qna.repository.QuestionRepository;
import com.example.demo.qna.service.AdminManagementService;
import com.example.demo.qna.repository.QuestionCategoryRepository;

import java.time.LocalDateTime;
import java.util.List;
import java.util.stream.Collectors;

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

    @Override
    public List<QuestionDTO> getAllQuestionsIncludingSecret() {
        return questionRepository.findAll().stream()
            .map(question -> new QuestionDTO(
                question.getId(),
                question.getCategoryEntity().getId(),
                question.getUserEntity().getId(),
                question.getTitle(),
                question.getContent(),
                question.getQuestionDate(),
                question.getResponse(),
                question.getResponseDate(),
                question.getSecret(),
                question.getFixQuestion()
            ))
            .collect(Collectors.toList());
    }

    @Override
    public boolean checkAdminStatus() {
        // 여기에 관리자 상태를 확인하는 로직을 구현
        // 예를 들어, 세션이나 토큰에서 관리자 정보를 확인가능.
        // 현재는 임시로 true를 반환.
        return true;
    }

}
