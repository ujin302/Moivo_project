package com.example.demo.qna.service.impl;

import com.example.demo.qna.dto.QuestionDTO;
import com.example.demo.qna.entity.QuestionEntity;
import com.example.demo.qna.repository.QuestionCategoryRepository;
import com.example.demo.qna.repository.QuestionRepository;
import com.example.demo.store.dto.ProductDTO;
import com.example.demo.user.repository.UserRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.stereotype.Service;

import com.example.demo.qna.service.QuestionService;

import java.util.HashMap;
import java.util.List;
import java.util.Map;
import java.util.stream.Collectors;

@Service
public class QuestionServiceImpl implements QuestionService {

    @Autowired
    QuestionRepository questionRepository;

    @Autowired
    QuestionCategoryRepository questionCategoryRepository;

    @Autowired
    UserRepository userRepository;
    
    //문의사항 추가
    @Override
    public void addQuestion(QuestionDTO questionDTO) {

        //아이디, 제목, 내용, 작성일시, 비밀글 여부, 관리자 응답여부
        QuestionEntity questionEntity = new QuestionEntity();

        questionEntity.setContent(questionDTO.getContent()); //내용
        questionEntity.setQuestionDate(questionDTO.getQuestionDate()); //시간
        questionEntity.setTitle(questionDTO.getTitle()); //제목
        questionEntity.setSecret(questionDTO.getSecret()); //비밀글 여부
        questionEntity.setCategoryEntity(questionCategoryRepository.findById(questionDTO.getCategoryId()).get());
        questionEntity.setUserEntity(userRepository.findById(questionDTO.getUserId()).get());
        System.out.println(questionEntity);
        questionRepository.save(questionEntity);
    }
    
    //문의사항 수정
    @Override
    public void updateQuestion(int id, QuestionDTO questionDTO) {
        QuestionEntity questionEntity = questionRepository.findById(id).get();

        questionEntity.setContent(questionDTO.getContent());
        questionEntity.setQuestionDate(questionDTO.getQuestionDate());
        questionEntity.setTitle(questionDTO.getTitle()); //제목
        questionEntity.setSecret(questionDTO.getSecret()); //비밀글 여부
        questionEntity.setCategoryEntity(questionCategoryRepository.findById(questionDTO.getCategoryId()).get());
        questionEntity.setUserEntity(userRepository.findById(questionDTO.getUserId()).get());
        System.out.println(questionEntity);
        questionRepository.save(questionEntity);
    }

    //문의 리스트
    @Override
    public Map<String, Object> getQuestionList(Map<String, Object> datemap) {
        Map<String, Object> map = new HashMap<>();

        Pageable pageable = (Pageable) datemap.get("pageable");
        int block = Integer.parseInt(datemap.get("block").toString());
        //리스트, 검색 한번에 하려면 다시
        //Integer categoryid = Integer.parseInt(datemap.get("categoryid").toString());

//        if (categoryid != null) {
//            pageQuestionList = questionRepository.findByCategoryEntityId(categoryid, pageable);
//        } else {
//            pageQuestionList = questionRepository.findAll(pageable);
//        }


        Page<QuestionEntity> pageQuestionList = null;
        pageQuestionList = questionRepository.findAll(pageable); //전체 DB 추출

        // 4. Entity -> DTO 변환
        List<QuestionDTO> dtoList = pageQuestionList.getContent() // Java8 이상 사용시 Entity -> DTO 변환하는 방법
                .stream()
                .map(questionEntity -> {
                    System.out.println("Title = " + questionEntity.getTitle());
                    System.out.println("Content = " + questionEntity.getContent());
                    return QuestionDTO.toGetQuestionDTO(questionEntity); // DTO로 변환
                })
                .collect(Collectors.toList());

        // 5. 페이징 숫자 처리
        int currentBlock = pageQuestionList.getNumber() / block;
        int startPage = currentBlock * block;
        int endPage = Math.min(startPage + block, pageQuestionList.getTotalPages());

        // 6. 결과 담기
        // 페이징 정보
        map.put("startPage", startPage); // 블럭 첫번째 페이지
        map.put("endPage", endPage); // 블럭 마지막 페이지
        map.put("isFirst", pageQuestionList.isFirst()); // 1 페이지 여부
        map.put("isLast", pageQuestionList.isLast()); // 마지막 페이지 여부
        map.put("hasPrevious", pageQuestionList.hasPrevious()); // 이전 페이지 여부
        map.put("hasNext", pageQuestionList.hasNext()); // 다음 페이지 여부
        map.put("totalPages", pageQuestionList.getTotalPages()); // 페이지 개수

        //문의 관련 정보
        map.put("QuestionList", dtoList);

        System.out.println("dtoList = " + dtoList);
        return map;
    }
    
    //문의사항 검색

}
