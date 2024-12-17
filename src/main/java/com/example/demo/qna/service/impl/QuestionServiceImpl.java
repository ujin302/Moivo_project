package com.example.demo.qna.service.impl;

import com.example.demo.qna.dto.QuestionDTO;
import com.example.demo.qna.entity.QuestionEntity;
import com.example.demo.qna.repository.QuestionCategoryRepository;
import com.example.demo.qna.repository.QuestionRepository;
import com.example.demo.user.repository.UserRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Pageable;
import org.springframework.data.domain.Sort;
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
    public QuestionEntity addQuestion(QuestionDTO questionDTO) {

        QuestionEntity questionEntity = new QuestionEntity();
        //여기서 로그인한 아이디를 받아오는 방법? 재영이가 jwt 사용시 다른방법으로 가능. 현재는 프론트에서 id 를 받아옴
//        questionEntity.setQuestionDate(questionDTO.getQuestionDate()); //시간은 자동으로 등록되므로 필요 X
        System.out.println("프론트에서 받아온 questionDTO = " +questionDTO);
        System.out.println("프론트에서 받아온 id = " + questionDTO.getUserId()); // QuestionDTO의 userid는 user 테이블 id 값임
        questionEntity.setTitle(questionDTO.getTitle()); //제목
        questionEntity.setContent(questionDTO.getContent()); //내용
        questionEntity.setSecret(questionDTO.getSecret()); //비밀글 여부
        questionEntity.setCategoryEntity(questionCategoryRepository.findById(questionDTO.getCategoryId()).get()); //문의 카테고리
        questionEntity.setUserEntity(userRepository.findById(questionDTO.getUserId()).get()); //userId 받아온거로 userRepository에서 찾아서 questionEntity의 UserEntity에 셋팅
        System.out.println("questionEntity Id 저장 전 = " + questionEntity);
        questionRepository.save(questionEntity);
        System.out.println("questionEntity Id 저장 후 = " + questionEntity);
        return questionEntity;
    }

    //문의사항 수정
    @Override
    public void updateQuestion(QuestionDTO questionDTO) {
//        QuestionEntity questionEntity = questionRepository.findById(questionDTO.getUserId()).get(); //Question 레포지토리에서 Question 유저 Id로 등록한 글 찾기
        QuestionEntity questionEntity = questionRepository.findById(questionDTO.getId()).get(); //Question 레포지토리에서 Question Id(글 번호)로 등록한 글 찾기

        System.out.println("프론트에서 받아온 questionDTO = " +questionDTO);
        System.out.println("프론트에서 받아온 id = " + questionDTO.getUserId()); // QuestionDTO의 userid는 user 테이블 id 값임
        System.out.println("수정한 글 번호 questionEntity.getId() = " + questionEntity.getId());
        questionEntity.setTitle(questionDTO.getTitle()); //제목
        questionEntity.setContent(questionDTO.getContent()); //내용
        questionEntity.setSecret(questionDTO.getSecret()); //비밀글 여부
        questionEntity.setCategoryEntity(questionCategoryRepository.findById(questionDTO.getCategoryId()).get()); //문의 카테고리
        questionEntity.setUserEntity(userRepository.findById(questionDTO.getUserId()).get()); //UserEntity 셋팅
        System.out.println("수정한 questionEntity = " + questionEntity);
        questionRepository.save(questionEntity);
    }

    //문의사항 삭제
    @Override
    public void deleteQuestion(QuestionDTO questionDTO) {
        QuestionEntity questionEntity = questionRepository.findById(questionDTO.getId()).get(); //Question 레포지토리에서 Question Id(글 번호)로 등록한 글 찾기

        questionRepository.delete(questionEntity);
    }


    //문의 리스트, 검색, 정렬
    @Override
    public Map<String, Object> getQuestionList(Map<String, Object> datemap) {
        Map<String, Object> map = new HashMap<>();

        Pageable pageable = (Pageable) datemap.get("pageable");
        int block = Integer.parseInt(datemap.get("block").toString());
        String sortby = datemap.get("sortby").toString();
        int categoryid = 0;
        String title = null;

        if (datemap.get("title") != null) {
            title = datemap.get("title").toString();
        }

        if (datemap.get("categoryid") != null){
            categoryid = (int) datemap.get("categoryid");
        }

        Sort sort = pageable.getSort();
        if (sortby.equals("questiondate")) {
            sort = Sort.by(Sort.Direction.DESC, "questionDate");
        } else if (sortby.equals("title")) {
            sort = Sort.by(Sort.Direction.DESC, "title");
        }
        pageable = PageRequest.of(pageable.getPageNumber(), pageable.getPageSize(), sort);

        Page<QuestionEntity> pageQuestionList = null;

        //문의 리스트 출력부분
        //title이 null이고 문의카테고리 0일때 전체문의 출력
        //title이 null이고 문의카테고리 1일때 문의카테고리가 1인 문의 출력
        //title이 null이고 문의카테고리 2일때 문의카테고리가 2인 문의 출력
        //title이 null이고 문의카테고리 3일때 문의카테고리가 3인 문의 출력
        //title이 null이고 문의카테고리 4일때 문의카테고리가 4인 문의 출력

        //title이 null이 아니고 문의카테고리 0일때 전체문의중 title에 맞는 문의 출력
        //title이 null이 아니고 문의카테고리 1일때 title이 들어가고 문의카테고리가 1인 문의 출력
        //title이 null이 아니고 문의카테고리 2일때 title이 들어가고 문의카테고리가 2인 문의 출력
        //title이 null이 아니고 문의카테고리 3일때 title이 들어가고 문의카테고리가 3인 문의 출력
        //title이 null이 아니고 문의카테고리 4일때 title이 들어가고 문의카테고리가 4인 문의 출력
        if ((title == null || title.isEmpty()) && categoryid == 0) { //전체검색
            System.out.println("title X = " + " categoryid X = 전체검색");
            pageQuestionList = questionRepository.findAll(pageable); //전체 DB추출 확인완료 12/17 17:10
        }
        else if(((title == null || title.isEmpty())) && categoryid != 0) {
            System.out.println("title X = " + " categoryid = " + categoryid );
            pageQuestionList = questionRepository.findByCategoryEntityId(categoryid, pageable);  //categoryid로 DB추출 확인완료 12/17 17:10
        }
        else if (title != null && categoryid == 0) {
            System.out.println("title = " + title + " categoryid X = ");
            pageQuestionList = questionRepository.findByTitleContainingIgnoreCase(title, pageable); //title DB추출 확인완료 12/17 17:37
        }
        else if (title != null && categoryid != 0) {
            System.out.println("title = " + title + " categoryid = " + categoryid );
            pageQuestionList = questionRepository.findByTitleContainingIgnoreCaseAndCategoryEntityId(title, categoryid, pageable); //title,categoryid로 DB추출 확인완료 12/17 17:37
        }


        // 4. Entity -> DTO 변환
        List<QuestionDTO> dtoList = pageQuestionList.getContent() // Java8 이상 사용시 Entity -> DTO 변환하는 방법
                .stream()
                .map(questionEntity -> {
                    //if(로그인한 id == question.userid 같으면 다 보여주고 boolean값 true로 바뀌고)
                    //else if(question category가 비밀글이 아닌거 boolean값 true로 (다 보여줌)
                    //else  나머지는 boolean 값 false 안보여줌
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
        return map;
    }


}