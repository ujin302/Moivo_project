package com.example.demo.qna.service.impl;

import java.time.LocalDateTime;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import com.example.demo.qna.repository.QuestionRepository;
import com.example.demo.qna.dto.QuestionDTO;
import com.example.demo.qna.entity.QuestionEntity;
import com.example.demo.qna.repository.QuestionCategoryRepository;
import com.example.demo.qna.service.QuestionService;
import com.example.demo.user.repository.UserRepository;

@Service
public class QuestionServiceImpl implements QuestionService {
    
    @Autowired
    private QuestionRepository questionRepository;

    @Autowired
    private QuestionCategoryRepository categoryRepository;

    @Autowired
    private UserRepository userRepository;

    @Override
    public void deleteQuestion(Integer id) {
        questionRepository.deleteById(id);
    }

     @Override
    public QuestionDTO createQuestion(QuestionDTO questionDTO) {
        QuestionEntity entity = new QuestionEntity();
        // 문의 제목
        entity.setTitle(questionDTO.getTitle());
        // 문의 내용
        entity.setContent(questionDTO.getContent());
        // 문의 비밀글 여부
        entity.setSecret(questionDTO.getSecret());
        // 문의 고정글 여부
        entity.setFixQuestion(questionDTO.getFixQuestion());
        // 문의 작성 일시
        entity.setQuestionDate(LocalDateTime.now());
        
        // 연관 엔티티 설정
        entity.setUserEntity(userRepository.findById(questionDTO.getUserId())
                .orElseThrow(() -> new RuntimeException("사용자를 찾을 수 없습니다.")));
        entity.setCategoryEntity(categoryRepository.findById(questionDTO.getCategoryId())
                .orElseThrow(() -> new RuntimeException("카테고리를 찾을 수 없습니다.")));

        QuestionEntity savedEntity = questionRepository.save(entity);
        return convertToDTO(savedEntity);
    }

    @Override
    public QuestionDTO updateQuestion(Integer id, QuestionDTO questionDTO) {
        QuestionEntity entity = questionRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("문의를 찾을 수 없습니다."));
        
        // 문의 제목
        entity.setTitle(questionDTO.getTitle());
        // 문의 내용
        entity.setContent(questionDTO.getContent());
        // 문의 비밀글 여부
        entity.setSecret(questionDTO.getSecret());
        // 문의 카테고리
        entity.setCategoryEntity(categoryRepository.findById(questionDTO.getCategoryId())
                .orElseThrow(() -> new RuntimeException("카테고리를 찾을 수 없습니다.")));

        QuestionEntity updatedEntity = questionRepository.save(entity);
        return convertToDTO(updatedEntity);
    }

    private QuestionDTO convertToDTO(QuestionEntity entity) {
        QuestionDTO dto = new QuestionDTO();
        // 문의 고유 키
        dto.setId(entity.getId());
        // 문의 제목
        dto.setTitle(entity.getTitle());
        // 문의 내용
        dto.setContent(entity.getContent());
        // 문의 카테고리
        dto.setCategoryId(entity.getCategoryEntity().getId());
        // 문의 작성자
        dto.setUserId(entity.getUserEntity().getId());
        // 문의 작성 일시
        dto.setQuestionDate(entity.getQuestionDate());
        // 문의 관리자 응답
        dto.setResponse(entity.getResponse());
        // 문의 관리자 응답 일시
        dto.setResponseDate(entity.getResponseDate());
        // 문의 비밀글 여부
        dto.setSecret(entity.getSecret());
        // 문의 고정글 여부
        dto.setFixQuestion(entity.getFixQuestion());
        return dto;
    }


}
