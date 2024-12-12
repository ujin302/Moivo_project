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
import org.springframework.data.domain.Sort;
import org.springframework.stereotype.Service;

import com.example.demo.qna.service.QuestionService;

import java.util.HashMap;
import java.util.List;
import java.util.Map;
import java.util.NoSuchElementException;
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

        QuestionEntity questionEntity = new QuestionEntity();
        //여기서 로그인한 아이디를 받아오는 방법?
        //아이디, 제목, 내용, 작성일시, 비밀글 여부, 관리자 응답여부
//        QuestionEntity questionEntity = new QuestionEntity();
        questionEntity.setContent(questionDTO.getContent()); //내용
        questionEntity.setQuestionDate(questionDTO.getQuestionDate()); //시간
        questionEntity.setTitle(questionDTO.getTitle()); //제목
        questionEntity.setSecret(questionDTO.getSecret()); //비밀글 여부
        questionEntity.setCategoryEntity(questionCategoryRepository.findById(questionDTO.getCategoryId()).get()); //문의 카테고리
        questionEntity.setUserEntity(userRepository.findById(questionDTO.getUserId()).get()); //userId 받아온거로 userRepository에서 찾아서 questionEntity의 UserEntity에 셋팅
        System.out.println("questionEntity = " + questionEntity);
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

    //문의사항 삭제
    @Override
    public void deleteQuestion(int id, int userId) {
        QuestionEntity questionEntity = questionRepository.findById(id).orElseThrow(() ->
                new NoSuchElementException("해당 번호의 문의가 없습니다" + id));

        // 게시글 작성자와 로그인한 사용자 비교
        if (!questionEntity.getUserEntity().getId().equals(userId)) {
            throw new IllegalArgumentException("작성자가 아닙니다.");
        }
        questionRepository.delete(questionEntity);
        System.out.println("문의사항 삭제 완료");
    }


    //문의 리스트, 검색, 정렬
    @Override
    public Map<String, Object> getQuestionList(Map<String, Object> datemap) {
        Map<String, Object> map = new HashMap<>();

        Pageable pageable = (Pageable) datemap.get("pageable");
        int block = Integer.parseInt(datemap.get("block").toString());
        String sortby = datemap.get("sortby").toString();
        String title = null;

        if (datemap.get("title") != null) {
            title = datemap.get("title").toString();
        }

        Sort sort = pageable.getSort();
        if (sortby.equals("questiondate")) {
            sort = Sort.by(Sort.Direction.DESC, "questionDate");
        } else if (sortby.equals("title")) {
            sort = Sort.by(Sort.Direction.DESC, "title");
        }

        Page<QuestionEntity> pageQuestionList = null;

        if (title == null || title.isEmpty()) { //전체검색
            System.out.println("여기 안와?");
            pageQuestionList = questionRepository.findAll(pageable); //전체 DB 추출
        }
        if (title != null) {
            System.out.println("title" + title);
            pageQuestionList = questionRepository.findByTitleContainingIgnoreCase(title, pageable);
        }
        System.out.println("어딜 들어가?");
//        else if (title == null && keyword != null) {
//            pageQuestionList = questionRepository.findByNameContainingIgnoreCase(keyword, pageable);
//        }


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

        System.out.println("sortby" + sortby);
        System.out.println("검색 내역 : " + title);
//        System.out.println("dtoList = " + dtoList);
        return map;
    }

    //문의사항 검색

}