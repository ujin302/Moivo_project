package com.example.demo.qna.controller;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.domain.Pageable;
import org.springframework.data.domain.Sort;
import org.springframework.data.web.PageableDefault;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;

import com.example.demo.qna.dto.QuestionCategoryDTO;
import com.example.demo.qna.dto.QuestionDTO;
import com.example.demo.qna.service.AdminManagementService;

import java.util.HashMap;
import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/api/admin/qna/management")
public class AdminManagementController {

    @Autowired
    private AdminManagementService adminManagementService;

    // 자주 묻는 질문 등록 - 24.12.18 yjy
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
    @PreAuthorize("hasRole('ADMIN')")
    public ResponseEntity<?> respondToQuestion(
        @PathVariable("questionId") Integer questionId,
        @RequestBody Map<String, String> requestBody
    ) {
        try {
            String response = requestBody.get("response");
            System.out.println("Received response in controller: " + response);
            
            if (response == null) {
                return ResponseEntity.badRequest().body("Response cannot be null");
            }
            
            adminManagementService.respondToQuestion(questionId, response);
            return ResponseEntity.ok("Response saved successfully");
        } catch (Exception e) {
            System.err.println("Error in controller: " + e.getMessage());
            e.printStackTrace();
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
                .body("Failed to save response: " + e.getMessage());
        }
    }

    // 문의 답변 수정
    @PutMapping("/questions/{questionId}/response")
    @PreAuthorize("hasRole('ADMIN')")
    public ResponseEntity<Void> updateResponse(
        @PathVariable("questionId") Integer questionId, 
        @RequestBody Map<String, String> requestBody) {
        try {
            String response = requestBody.get("response");
            adminManagementService.updateResponse(questionId, response);
            return ResponseEntity.ok().build();
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).build();
        }
    }

    // 문의 답변 삭제
    @DeleteMapping("/questions/{questionId}/response")
    @PreAuthorize("hasRole('ADMIN')")
    public ResponseEntity<Void> deleteResponse(@PathVariable("questionId") Integer questionId) {
        try {
            adminManagementService.deleteResponse(questionId);
            return ResponseEntity.ok().build();
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).build();
        }
    }

    // 카테고리 조회
    @GetMapping("/categories")
    @PreAuthorize("hasRole('ADMIN')")
    public ResponseEntity<List<QuestionCategoryDTO>> getAllCategories() {
        List<QuestionCategoryDTO> categories = adminManagementService.getAllCategories();
        return ResponseEntity.ok().body(categories);
    }

    // 답변된 문의 조회
    @GetMapping("/questions/answered")
    @PreAuthorize("hasRole('ADMIN')")
    public ResponseEntity<List<QuestionDTO>> getAnsweredQuestions() {
        return ResponseEntity.ok(adminManagementService.getAnsweredQuestions());
    }

    // 미답변 문의 조회
    @GetMapping("/questions/unanswered")
    @PreAuthorize("hasRole('ADMIN')")
    public ResponseEntity<List<QuestionDTO>> getUnansweredQuestions() {
        return ResponseEntity.ok(adminManagementService.getUnansweredQuestions());
    }

    // 관리자 대시보드 데이터 가져오기 - 24.12.13 yjy
    @GetMapping("/questions/status")
    @PreAuthorize("hasRole('ADMIN')")
    public ResponseEntity<Map<String, Integer>> getQuestionStatus() {
        Map<String, Integer> status = adminManagementService.getQuestionStatus();
        return ResponseEntity.ok(status);
    }

    //관리자 상품목록 가져오기, 카테고리 or 키워드별 검색 후 페이징처리 -12/16 17:31 tang
    @GetMapping("/product")
    public ResponseEntity<?> getAllProductList(
            @PageableDefault(page = 0, size = 15, sort = "id", direction = Sort.Direction.DESC) Pageable pageable,
            @RequestParam(name = "block", required = false, defaultValue = "3") int block,
            @RequestParam(name = "sortby", required = false, defaultValue = "newest") String sortby,
            @RequestParam(name = "categoryid", required = false, defaultValue = "0") int categoryid,
            @RequestParam(name = "keyword", required = false) String keyword) {
        Map<String, Object> datamap = new HashMap<>();
        datamap.put("pageable", pageable); //페이지 처리
        datamap.put("block", block); //한 페이지당 보여줄 숫자
        datamap.put("sortby", sortby); //정렬 기준
        datamap.put("categoryid", categoryid); //카테고리 정렬 기준
        datamap.put("keyword", keyword); //검색어

        Map<String, Object> map = adminManagementService.getAllProductList(datamap);


        // 값 존재 X
        if (map == null){
            return ResponseEntity.status(org.apache.http.HttpStatus.SC_NOT_FOUND).body(null);
        }

        System.out.println("Controller map = " + map);

        //값 존재 O
        return ResponseEntity.ok(map);
    }
}
