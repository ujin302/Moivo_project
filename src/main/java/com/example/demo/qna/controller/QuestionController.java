package com.example.demo.qna.controller;

import com.example.demo.qna.dto.QuestionDTO;
import com.example.demo.user.entity.UserEntity;
import com.example.demo.user.repository.UserRepository;
import org.apache.http.HttpStatus;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.domain.Pageable;
import org.springframework.data.domain.Sort;
import org.springframework.data.web.PageableDefault;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.*;

import com.example.demo.qna.service.QuestionService;

import java.util.HashMap;
import java.util.Map;

@RestController
@RequestMapping("/api/user/question")
public class QuestionController {
    @Autowired
    private QuestionService questionsService;
    @Autowired
    private UserRepository userRepository;

    //문의 작성 로그인한 사용자 정보 받아오기 필요
    @PostMapping("/add")
    public ResponseEntity<String> createQuestion(@RequestBody QuestionDTO questionDTO) {
        //JWT로 로그인한 사용자 정보 어떻게 받아와?
//        String username = auth.getName();
//        UserEntity user = userRepository.findByUserId(username);
//        questionDTO.setUserId(user.getId());
//        System.out.println("user.getId() =" + user.getId());
        questionsService.addQuestion(questionDTO);
        return ResponseEntity.ok("200 Ok");
    }

    //문의 수정
    @PutMapping("/update/{id}")
    public ResponseEntity<String> updateQuestion(@RequestBody QuestionDTO questionDTO, @PathVariable int id) {
        questionsService.updateQuestion(id, questionDTO);
        return ResponseEntity.ok("200 Ok");
    }

    //문의 리스트 출력, 페이징처리, 최신순 정렬, 검색 완료 12/12 11:00 tang
    @GetMapping("")
    public ResponseEntity<?> searchQuestion(
            @PageableDefault(page = 0, size = 10, sort = "id", direction = Sort.Direction.DESC) Pageable pageable,
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

    // 문의 삭제
//    @DeleteMapping("/delete/{id}") //게시글 id
//    public ResponseEntity<String> deleteQuestion(@PathVariable int id, @PathVariable int userId) {
//     questionsService.deleteQuestion(id, userId);
//     return ResponseEntity.ok("200 Ok");
//    }

    @DeleteMapping("/delete/{id}")
    public ResponseEntity<String> deleteQuestion(@PathVariable int id, Authentication authentication) {
        // 로그인한 사용자 정보 가져오기
        String userid = authentication.getName();
        UserEntity user = userRepository.findByUserId(userid)
                .orElseThrow(() -> new IllegalArgumentException("유저를 찾을 수 없습니다."));

        // 삭제 서비스 호출
        questionsService.deleteQuestion(id, user.getId());
        return ResponseEntity.ok("200 Ok");
    }

}
