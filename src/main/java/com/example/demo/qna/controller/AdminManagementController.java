package com.example.demo.qna.controller;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;

import com.example.demo.qna.dto.QuestionDTO;
import com.example.demo.qna.entity.QuestionCategoryEntity;
import com.example.demo.qna.service.AdminManagementService;

import java.time.LocalDateTime;
import java.util.List;
import java.util.Map;
import java.util.HashMap;

@RestController
@RequestMapping("/api/admin/qna/management")
public class AdminManagementController {

    @Autowired
    private AdminManagementService adminManagementService;

    @GetMapping("/questions")
    public ResponseEntity<List<QuestionDTO>> getAllQuestions(
            @RequestParam(required = false) String category,
            @RequestParam(required = false) String secret) {
        List<QuestionDTO> questions = adminManagementService.getAllQuestions(category, secret);
        return ResponseEntity.ok(questions);
    }

    @PostMapping("/questions/{id}/response")
    public ResponseEntity<Void> respondToQuestion(@PathVariable Integer id, @RequestBody String response) {
        QuestionDTO questionDTO = new QuestionDTO();
        questionDTO.setId(id);
        questionDTO.setResponse(response);
        questionDTO.setResponseDate(LocalDateTime.now());
        adminManagementService.respondToQuestion(questionDTO);
        return ResponseEntity.ok().build();
    }

    @PutMapping("/questions/{id}/response")
    public ResponseEntity<Void> updateResponse(@PathVariable Integer id, @RequestBody String response) {
        QuestionDTO questionDTO = new QuestionDTO();
        questionDTO.setId(id);
        questionDTO.setResponse(response);
        questionDTO.setResponseDate(LocalDateTime.now());
        adminManagementService.updateResponse(questionDTO);
        return ResponseEntity.ok().build();
    }

    @DeleteMapping("/questions/{id}/response")
    public ResponseEntity<Void> deleteResponse(@PathVariable Integer id) {
        adminManagementService.deleteResponse(id);
        return ResponseEntity.ok().build();
    }

    // 관리자 상태 확인
    @GetMapping("/check")
    @PreAuthorize("hasRole('ADMIN')")
    public ResponseEntity<Map<String, Boolean>> checkAdminStatus() {
        boolean isAdmin = adminManagementService.checkAdminStatus();
        Map<String, Boolean> response = new HashMap<>();
        response.put("isAdmin", isAdmin);
        return ResponseEntity.ok(response);
    }

}
