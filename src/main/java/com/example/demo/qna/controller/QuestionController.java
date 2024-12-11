package com.example.demo.qna.controller;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.DeleteMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.PutMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import com.example.demo.qna.dto.QuestionDTO;
import com.example.demo.qna.service.QuestionService;

@RestController
@RequestMapping("/api/user/question")
public class QuestionController {
    @Autowired
    private QuestionService questionsService;
    // 문의 작성, 문의 수정, 문의 삭제 기능 
    // 문의 작성
    @PostMapping
    public ResponseEntity<QuestionDTO> createQuestion(@RequestBody QuestionDTO questionDTO) {
        return ResponseEntity.status(HttpStatus.CREATED)
                .body(questionsService.createQuestion(questionDTO));
    }
    // 문의 수정
    @PutMapping("/{id}")
    public ResponseEntity<QuestionDTO> updateQuestion(
            @PathVariable Integer id,
            @RequestBody QuestionDTO questionDTO) {
        return ResponseEntity.ok(questionsService.updateQuestion(id, questionDTO));
    }
    // 문의 삭제
    @DeleteMapping("/{id}")
    public ResponseEntity<Void> deleteQuestion(@PathVariable Integer id) {
        questionsService.deleteQuestion(id);
        return ResponseEntity.ok().build();
    }

    // 고정 문의 & 문의 리스트 출력


    // 문의 사항 검색


}
