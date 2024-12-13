package com.example.demo.qna.controller;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.domain.Page;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;

import com.example.demo.qna.dto.QuestionCategoryDTO;
import com.example.demo.qna.dto.QuestionDTO;
import com.example.demo.qna.service.AdminManagementService;

import java.time.LocalDateTime;
import java.util.List;

@RestController
@RequestMapping("/api/admin/qna/management")
public class AdminManagementController {

    @Autowired
    private AdminManagementService adminManagementService;

    // 문의에 대한 응답 작성
    @PostMapping("/response")
    public ResponseEntity<String> respondToQuestion(@RequestBody QuestionDTO questionDTO) {
        adminManagementService.respondToQuestion(questionDTO);
        return ResponseEntity.ok("응답이 성공적으로 등록되었습니다.");
    }

    // 자주 묻는 질문 등록
    @PostMapping("/faq")
    public ResponseEntity<String> addFAQ(@RequestBody QuestionDTO questionDTO) {
        adminManagementService.addFAQ(questionDTO);
        return ResponseEntity.ok("자주 묻는 질문이 성공적으로 등록되었습니다.");
    }

    // 모든 문의 조회 (관리자용)
    @GetMapping("/questions")
    @PreAuthorize("hasRole('ADMIN')")
    public ResponseEntity<List<QuestionDTO>> getAllQuestions() {
        List<QuestionDTO> questions = adminManagementService.getAllQuestions();
        return ResponseEntity.ok(questions);
    }

    @PostMapping("/questions/{questionId}/response")
    @PreAuthorize("hasRole('ADMIN')")
    public ResponseEntity<Void> respondToQuestion(@PathVariable Integer questionId, @RequestBody String response) {
        adminManagementService.respondToQuestion(questionId, response);
        return ResponseEntity.ok().build();
    }

    @PutMapping("/questions/{questionId}/response")
    @PreAuthorize("hasRole('ADMIN')")
    public ResponseEntity<Void> updateResponse(@PathVariable Integer questionId, @RequestBody String response) {
        adminManagementService.updateResponse(questionId, response);
        return ResponseEntity.ok().build();
    }

    @DeleteMapping("/questions/{questionId}/response")
    @PreAuthorize("hasRole('ADMIN')")
    public ResponseEntity<Void> deleteResponse(@PathVariable Integer questionId) {
        adminManagementService.deleteResponse(questionId);
        return ResponseEntity.ok().build();
    }

    // 문의 카테고리 목록 가져오기
    @GetMapping("/categories")
    @PreAuthorize("hasRole('ADMIN')")
    public ResponseEntity<List<QuestionCategoryDTO>> getQuestionCategories() {
        List<QuestionCategoryDTO> categories = adminManagementService.getQuestionCategories();
        return ResponseEntity.ok(categories);
    }
}
