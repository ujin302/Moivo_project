package com.example.demo.qna.controller;

import com.example.demo.qna.dto.QuestionDTO;
import com.example.demo.user.repository.UserRepository;
import io.jsonwebtoken.Jwts;
import org.apache.http.HttpStatus;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.domain.Pageable;
import org.springframework.data.domain.Sort;
import org.springframework.data.web.PageableDefault;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import com.example.demo.qna.service.QuestionService;

import java.util.HashMap;
import java.util.Map;

@RestController
@RequestMapping("/api/user/question")
public class QuestionController {
    @Autowired
    private QuestionService questionsService;




    //문의 작성
    @PostMapping("/add")
    public ResponseEntity<Map<String, String>> addQuestion(@RequestBody QuestionDTO questionDTO) {
        // JWT 파싱
//        Long userId = Jwts.parser()
//                .setSigningKey("your-secret-key") // 비밀키로 서명 검증
//                .parseClaimsJws(token)
//                .getBody()
//                .get("userId", Long.class); // userId 추출
//        System.out.println("로그인한 userId" + userId);
        questionsService.addQuestion(questionDTO);
        Map<String, String> response = new HashMap<>();
        response.put("message", "200ok");
        return ResponseEntity.ok(response);
//        return ResponseEntity.ok("200 Ok");
    }

    //문의 수정
    @PutMapping("/update")
    public ResponseEntity<String> updateQuestion(@RequestBody QuestionDTO questionDTO) {
        questionsService.updateQuestion(questionDTO);
        return ResponseEntity.ok("200 Ok");
    }

    // 문의 삭제
    @DeleteMapping("/delete") //게시글 id
    public ResponseEntity<String> deleteQuestion(@RequestBody QuestionDTO questionDTO) {
        questionsService.deleteQuestion(questionDTO);
        return ResponseEntity.ok("200 Ok");
    }

    //문의 리스트 출력, 페이징처리, 최신순 정렬, 검색 완료 12/12 11:00 tang 
    @GetMapping("")
    public ResponseEntity<?> searchQuestion(
            @PageableDefault(page = 0, size = 6, sort = "id", direction = Sort.Direction.DESC) Pageable pageable,
            @RequestParam(name = "block", required = false, defaultValue = "10") int block,
            @RequestParam(name = "title", required = false) String title,
            @RequestParam(name = "sortby", required = false, defaultValue = "questiondate")String sortby) {
        Map<String, Object> datamap = new HashMap<>();
        datamap.put("pageable", pageable);
        datamap.put("block", block);
        datamap.put("sortby",sortby);
        datamap.put("title", title);

        Map<String, Object> map = questionsService.getQuestionList(datamap);

        // 값 존재 X
        if (map == null || map.isEmpty()) {
            return ResponseEntity.status(HttpStatus.SC_NOT_FOUND).body(null);
        }

        // 값 존재 O
        return ResponseEntity.ok(map);
    }



}
