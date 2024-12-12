package com.example.demo.qna.controller;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import com.example.demo.qna.dto.QuestionDTO;
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
    public ResponseEntity<List<QuestionDTO>> getAllQuestionsIncludingSecret() {
        List<QuestionDTO> questions = adminManagementService.getAllQuestionsIncludingSecret();
        return ResponseEntity.ok(questions);
    }

    // 문의 답변
    @PostMapping("/questions/{id}/response")
    public ResponseEntity<String> respondToQuestion(
            @PathVariable Integer id,
            @RequestBody Map<String, String> response) {
        try {
            QuestionDTO questionDTO = new QuestionDTO();
            questionDTO.setId(id);
            questionDTO.setResponse(response.get("response"));
            questionDTO.setResponseDate(LocalDateTime.now());
            
            adminManagementService.respondToQuestion(questionDTO);
            return ResponseEntity.ok("답변이 성공적으로 등록되었습니다.");
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
                    .body("답변 등록에 실패했습니다: " + e.getMessage());
        }
    }
     // 문의 답변 수정
    @PutMapping("/questions/{id}/response")
    public ResponseEntity<String> updateResponse(
            @PathVariable Integer id,
            @RequestBody Map<String, String> response) {
        try {
            QuestionDTO questionDTO = new QuestionDTO();
            questionDTO.setId(id);
            questionDTO.setResponse(response.get("response"));
            questionDTO.setResponseDate(LocalDateTime.now());
            
            adminManagementService.updateResponse(questionDTO);
            return ResponseEntity.ok("답변이 성공적으로 수정되었습니다.");
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
                    .body("답변 수정에 실패했습니다: " + e.getMessage());
        }
    }

    // 문의 답변 삭제
    @DeleteMapping("/questions/{id}/response")
    public ResponseEntity<String> deleteResponse(@PathVariable Integer id) {
        try {
            adminManagementService.deleteResponse(id);
            return ResponseEntity.ok("답변이 성공적으로 삭제되었습니다.");
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
                    .body("답변 삭제에 실패했습니다: " + e.getMessage());
        }
    }

    // 관리자 상태 확인
    @GetMapping("/check")
    public ResponseEntity<Map<String, Boolean>> checkAdminStatus() {
        boolean isAdmin = adminManagementService.checkAdminStatus();
        Map<String, Boolean> response = new HashMap<>();
        response.put("isAdmin", isAdmin);
        return ResponseEntity.ok(response);
    }

}
