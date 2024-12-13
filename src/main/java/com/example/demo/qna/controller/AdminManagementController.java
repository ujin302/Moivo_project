package com.example.demo.qna.controller;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;

import com.example.demo.qna.dto.QuestionCategoryDTO;
import com.example.demo.qna.dto.QuestionDTO;
import com.example.demo.qna.service.AdminManagementService;

import java.util.List;

@RestController
@RequestMapping("/api/admin/qna/management")
public class AdminManagementController {

    @Autowired
    private AdminManagementService adminManagementService;

    // 자주 묻는 질문 등록
    @PostMapping("/faq")
    @PreAuthorize("hasRole('ADMIN')")
    public ResponseEntity<String> addFAQ(@RequestBody QuestionDTO questionDTO) {
        adminManagementService.addFAQ(questionDTO);
        return ResponseEntity.ok("자주 묻는 질문이 성공적으로 등록되었습니다.");
    }

    // 모든 문의 조회 (관리자용)
    @GetMapping("/questions")
    @PreAuthorize("hasRole('ADMIN')")
    public ResponseEntity<?> getAllQuestions() {
        try {
            List<QuestionDTO> questions = adminManagementService.getAllQuestions();
            return ResponseEntity.ok().body(questions);
        } catch (Exception e) {
            e.printStackTrace();
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
                .body("Failed to fetch questions: " + e.getMessage());
        }
    }

    // 문의 답변 등록
    @PostMapping("/questions/{questionId}/response")
    // @PreAuthorize("hasRole('ADMIN')")
    public ResponseEntity<Void> respondToQuestion(@PathVariable Integer questionId, @RequestBody String response) {
        adminManagementService.respondToQuestion(questionId, response);
        return ResponseEntity.ok().build();
    }

    // 문의 답변 수정
    @PutMapping("/questions/{questionId}/response")
    @PreAuthorize("hasRole('ADMIN')")
    public ResponseEntity<Void> updateResponse(@PathVariable Integer questionId, @RequestBody String response) {
        adminManagementService.updateResponse(questionId, response);
        return ResponseEntity.ok().build();
    }

    // 문의 답변 삭제
    @DeleteMapping("/questions/{questionId}/response")
    @PreAuthorize("hasRole('ADMIN')")
    public ResponseEntity<Void> deleteResponse(@PathVariable Integer questionId) {
        adminManagementService.deleteResponse(questionId);
        return ResponseEntity.ok().build();
    }

    // 카테고리 조회
    @GetMapping("/categories")
    @PreAuthorize("hasRole('ADMIN')")
    public ResponseEntity<List<QuestionCategoryDTO>> getAllCategories() {
        List<QuestionCategoryDTO> categories = adminManagementService.getAllCategories();
        return ResponseEntity.ok().body(categories);
    }

}
