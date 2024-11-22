package com.example.demo.qna.controller;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import com.example.demo.qna.service.QuestionService;

@RestController
@RequestMapping("/api/qna/answer")
public class AnswerController {
    @Autowired
    private QuestionService questionService;
    // 답변 작성
    // 답변 수정
}