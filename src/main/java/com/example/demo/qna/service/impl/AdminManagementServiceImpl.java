package com.example.demo.qna.service.impl;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Pageable;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.stereotype.Service;

import com.example.demo.qna.dto.QuestionDTO;
import com.example.demo.qna.entity.QuestionCategoryEntity;
import com.example.demo.qna.entity.QuestionEntity;
import com.example.demo.qna.repository.QuestionRepository;
import com.example.demo.qna.service.AdminManagementService;
import com.example.demo.qna.repository.QuestionCategoryRepository;
import com.example.demo.qna.dto.QuestionCategoryDTO;
import com.example.demo.user.entity.UserEntity;

import java.time.LocalDateTime;
import java.util.List;
import java.util.stream.Collectors;

@Service
public class AdminManagementServiceImpl implements AdminManagementService {

    @Autowired
    private QuestionRepository questionRepository;

    @Autowired
    private QuestionCategoryRepository questionCategoryRepository;

    // 모든 문의 글 가져오기
    @Override
    public List<QuestionDTO> getAllQuestions() {
        // 관리자 권한으로 모든 문의글 가져오기
        List<QuestionEntity> questionEntities = questionRepository.findAll();
        
        return questionEntities.stream()
                .map(this::convertToDTO)
                .collect(Collectors.toList());
    }

    // 문의 글을 DTO로 변환하는 메서드
    private QuestionDTO convertToDTO(QuestionEntity questionEntity) {
        QuestionDTO questionDTO = new QuestionDTO();
        questionDTO.setId(questionEntity.getId());
        
        QuestionCategoryEntity categoryEntity = questionEntity.getCategoryEntity();
        if (categoryEntity != null) {
            QuestionCategoryDTO categoryDTO = new QuestionCategoryDTO();
            categoryDTO.setId(categoryEntity.getId());
            categoryDTO.setName(categoryEntity.getName());
            questionDTO.setCategoryDTO(categoryDTO);
        }
        
        UserEntity userEntity = questionEntity.getUserEntity();
        if (userEntity != null) {
            questionDTO.setUserId(userEntity.getId());
        }
        
        questionDTO.setTitle(questionEntity.getTitle());
        questionDTO.setContent(questionEntity.getContent());
        questionDTO.setQuestionDate(questionEntity.getQuestionDate());
        questionDTO.setResponse(questionEntity.getResponse());
        questionDTO.setResponseDate(questionEntity.getResponseDate());
        questionDTO.setSecret(questionEntity.getSecret());
        questionDTO.setFixQuestion(questionEntity.getFixQuestion());
        return questionDTO;
    }

    // 문의 글에 답변 추가
    @Override
    public void respondToQuestion(Integer questionId, String response) {
        QuestionEntity questionEntity = questionRepository.findById(questionId)
                .orElseThrow(() -> new IllegalArgumentException("Invalid question ID: " + questionId));
        
        questionEntity.setResponse(response);
        questionEntity.setResponseDate(LocalDateTime.now());
        questionRepository.save(questionEntity);
    }

    // 문의 글에 답변 수정
    @Override
    public void updateResponse(Integer questionId, String response) {
        QuestionEntity questionEntity = questionRepository.findById(questionId)
                .orElseThrow(() -> new IllegalArgumentException("Invalid question ID: " + questionId));
        
        questionEntity.setResponse(response);
        questionEntity.setResponseDate(LocalDateTime.now());
        questionRepository.save(questionEntity);
    }

    // 문의 글에 답변 삭제
    @Override
    public void deleteResponse(Integer questionId) {
        QuestionEntity questionEntity = questionRepository.findById(questionId)
                .orElseThrow(() -> new IllegalArgumentException("Invalid question ID: " + questionId));
        
        questionEntity.setResponse(null);
        questionEntity.setResponseDate(null);
        questionRepository.save(questionEntity);
    }

    @Override
    public List<QuestionCategoryDTO> getQuestionCategories() {
        List<QuestionCategoryEntity> categoryEntities = questionCategoryRepository.findAll();
        return categoryEntities.stream()
                .map(this::convertToCategoryDTO)
                .collect(Collectors.toList());
    }

    private QuestionCategoryDTO convertToCategoryDTO(QuestionCategoryEntity categoryEntity) {
        QuestionCategoryDTO categoryDTO = new QuestionCategoryDTO();
        categoryDTO.setId(categoryEntity.getId());
        categoryDTO.setName(categoryEntity.getName().name());
        return categoryDTO;
    }
}
