package com.example.demo.qna.controller;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import com.example.demo.qna.service.QuestionService;

@RestController
@RequestMapping("/api/qna/question")
public class QuestionController {
    @Autowired
    private QuestionService questionsService;
    // 고정 문의 & 문의 리스트 출력
    // 문의 사항 검색
}
