package com.example.demo.qna.service.impl;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.stereotype.Service;

import com.example.demo.qna.dto.QuestionDTO;
import com.example.demo.qna.entity.QuestionCategoryEntity;
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

    // 관리자 상태 조회
    @Override
    public boolean checkAdminStatus() {
        Authentication authentication = SecurityContextHolder.getContext().getAuthentication();
        if (authentication != null && authentication.getAuthorities().stream()
                .anyMatch(authority -> authority.getAuthority().equals("ROLE_ADMIN"))) {
            return true;
        }
        return false;
    }

    @Override
    public List<QuestionDTO> getAllQuestions(String category, String secret) {
        List<QuestionEntity> questions;
        if (category != null && secret != null) {
            QuestionCategoryEntity.QuestionCategory questionCategory = QuestionCategoryEntity.QuestionCategory.valueOf(category);
            questions = questionRepository.findByCategoryEntity_NameAndSecret(questionCategory, secret);
        } else if (secret != null) {
            questions = questionRepository.findBySecret(secret);
        } else {
            questions = questionRepository.findAll();
        }
        return questions.stream().map(this::convertToDTO).collect(Collectors.toList());
    }

    @Override
    public void respondToQuestion(QuestionDTO questionDTO) {
        QuestionEntity question = questionRepository.findById(questionDTO.getId()).orElseThrow();
        question.setResponse(questionDTO.getResponse());
        question.setResponseDate(questionDTO.getResponseDate());
        questionRepository.save(question);
    }

    @Override
    public void updateResponse(QuestionDTO questionDTO) {
        respondToQuestion(questionDTO);
    }

    @Override
    public void deleteResponse(Integer id) {
        QuestionEntity question = questionRepository.findById(id).orElseThrow();
        question.setResponse(null);
        question.setResponseDate(null);
        questionRepository.save(question);
    }

    private QuestionDTO convertToDTO(QuestionEntity question) {
        return new QuestionDTO(
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
        );
    }

}
