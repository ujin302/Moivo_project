package com.example.demo.qna.controller;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import com.example.demo.qna.service.QuestionService;

@RestController
@RequestMapping("/api/user/question")
public class QuestionController {
    @Autowired
    private QuestionService questionsService;
    // 문의 작성, 문의 수정, 문의 삭제 기능 
    // 고정 문의 & 문의 리스트 출력
    // 문의 사항 검색


}
