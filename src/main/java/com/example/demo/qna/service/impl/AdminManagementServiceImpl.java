package com.example.demo.qna.service.impl;

import com.example.demo.qna.entity.QuestionCategoryEntity;
import com.example.demo.qna.entity.QuestionEntity;
import com.example.demo.qna.repository.QuestionCategoryRepository;
import com.example.demo.qna.repository.QuestionRepository;
import com.example.demo.user.entity.UserEntity;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import com.example.demo.qna.service.AdminManagementService;

import java.time.LocalDateTime;

@Service
public class AdminManagementServiceImpl implements AdminManagementService {

    @Autowired
    private QuestionRepository questionRepository;

    @Autowired
    private QuestionCategoryRepository questionCategoryRepository;

    @Override
    public void addQuestion(String title, String content, Integer categoryId, Integer userId, Boolean isSecret) {
        QuestionCategoryEntity categoryEntity = questionCategoryRepository.findById(categoryId).orElseThrow(() -> new IllegalArgumentException("category ID"));

        UserEntity userEntity = new UserEntity();
        userEntity.setId(userId);

        QuestionEntity questionEntity = new QuestionEntity();
        questionEntity.setTitle(title);
        questionEntity.setContent(content);
        questionEntity.setCategoryEntity(categoryEntity);
        questionEntity.setUserEntity(userEntity);
        questionEntity.setSecret(isSecret ? "Y" : null);
//        questionEntity.setQuestionDate(LocalDateTime.now());
        //저장
        questionRepository.save(questionEntity);


    }
}
