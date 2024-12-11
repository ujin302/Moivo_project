package com.example.demo.qna.controller;

import com.example.demo.qna.service.AdminManagementService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/admin/qna/management")
public class AdminManagementController {

    @Autowired
    private AdminManagementService adminManagementService;

    // 자주 묻는 질문 작성
    @PostMapping("/qna")
    public ResponseEntity<String> Createqna(@RequestParam String title,
                                            @RequestParam String content,
                                            @RequestParam Integer categoryId,
                                            @RequestParam Integer userId,
                                            @RequestParam(required = false, defaultValue = "false") Boolean isSecret){
        adminManagementService.addQuestion(title, content, categoryId, userId, isSecret);

        return ResponseEntity.ok("201 Created");
    }



    // 자주 묻는 질문 등록 (문의사항 리스트에서!)
    
}
