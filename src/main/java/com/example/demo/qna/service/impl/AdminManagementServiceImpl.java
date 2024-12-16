package com.example.demo.qna.service.impl;

import com.example.demo.store.dto.ProductCategoryDTO;
import com.example.demo.store.dto.ProductDTO;
import com.example.demo.store.dto.ProductStockDTO;
import com.example.demo.store.entity.ProductCategoryEntity;
import com.example.demo.store.entity.ProductEntity;
import com.example.demo.store.entity.ProductStockEntity;
import com.example.demo.store.repository.ProductCategoryRepository;
import com.example.demo.store.repository.ProductRepository;
import com.example.demo.store.repository.ProductStockRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Pageable;
import org.springframework.data.domain.Sort;
import org.springframework.stereotype.Service;

import com.example.demo.qna.dto.QuestionCategoryDTO;
import com.example.demo.qna.dto.QuestionDTO;
import com.example.demo.qna.entity.QuestionEntity;
import com.example.demo.qna.repository.QuestionRepository;
import com.example.demo.qna.service.AdminManagementService;
import com.example.demo.user.repository.UserRepository;

import jakarta.transaction.Transactional;

import com.example.demo.qna.repository.QuestionCategoryRepository;


import java.time.LocalDateTime;
import java.util.*;
import java.util.stream.Collectors;

@Service
public class AdminManagementServiceImpl implements AdminManagementService {

    @Autowired
    private QuestionRepository questionRepository;

    @Autowired
    private QuestionCategoryRepository questionCategoryRepository;

    @Autowired
    private UserRepository userRepository;
    @Autowired
    private ProductRepository productRepository;

    @Autowired
    private ProductCategoryRepository productCategoryRepository;

    @Autowired
    private ProductStockRepository productStockRepository;

    @Override
    public void addFAQ(QuestionDTO questionDTO) {
        QuestionEntity questionEntity = new QuestionEntity();
        questionEntity.setTitle(questionDTO.getTitle());
        questionEntity.setContent(questionDTO.getContent());
        questionEntity.setCategoryEntity(questionCategoryRepository.findById(questionDTO.getCategoryId())
                .orElseThrow(() -> new RuntimeException("카테고리가 존재하지 않습니다.")));
        questionEntity.setUserEntity(userRepository.findById(questionDTO.getUserId())
                .orElseThrow(() -> new RuntimeException("사용자가 존재하지 않습니다.")));
        questionRepository.save(questionEntity);
    }

    @Override
    public List<QuestionDTO> getAllQuestions() {
        try {
            List<QuestionEntity> entities = questionRepository.findAll();
            if (entities.isEmpty()) {
                System.out.println("No questions found in database");
                return new ArrayList<>();
            }
            return entities.stream()
                    .filter(entity -> entity != null && entity.getUserEntity() != null && entity.getCategoryEntity() != null)
                    .map(entity -> {
                        try {
                            return QuestionDTO.toGetQuestionDTO(entity);
                        } catch (Exception e) {
                            System.out.println("Error mapping entity: " + entity.getId() + ", Error: " + e.getMessage());
                            e.printStackTrace();
                            return null;
                        }
                    })
                    .filter(Objects::nonNull)
                    .collect(Collectors.toList());
        } catch (Exception e) {
            System.out.println("Error fetching questions: " + e.getMessage());
            e.printStackTrace();
            throw new RuntimeException("Failed to fetch questions", e);
        }
    }


    @Override
    public List<QuestionDTO> getAllQuestionsIncludingSecret() {
        return questionRepository.findAll().stream()
                .map(question -> new QuestionDTO(
                        question.getId(),
                        question.getCategoryEntity().getId(),
                        question.getUserEntity().getId(),
                        question.getTitle(),
                        question.getContent(),
                        question.getQuestionDate(),
                        question.getResponse(),
                        question.getResponseDate(),
                        question.getSecret(),
                        question.getFixQuestion()
                ))
                .collect(Collectors.toList());
    }


    @Override
    @Transactional
    public void respondToQuestion(Integer questionId, String response) {
        try {
            QuestionEntity question = questionRepository.findById(questionId)
                    .orElseThrow(() -> new RuntimeException("문의를 찾을 수 없습니다."));

            System.out.println("Question found: " + question.getId());
            System.out.println("Setting response: " + response);

            question.setResponse(response);
            question.setResponseDate(LocalDateTime.now());

            QuestionEntity savedQuestion = questionRepository.save(question);
            System.out.println("Response saved: " + savedQuestion.getResponse());
        } catch (Exception e) {
            System.err.println("Error in respondToQuestion: " + e.getMessage());
            e.printStackTrace();
            throw e;
        }
    }

    @Override
    public void updateResponse(Integer questionId, String response) {
        QuestionEntity question = questionRepository.findById(questionId)
                .orElseThrow(() -> new RuntimeException("Question not found"));

        question.setResponse(response);
        question.setResponseDate(LocalDateTime.now());
        questionRepository.save(question);
    }

    @Override
    public void deleteResponse(Integer questionId) {
        QuestionEntity question = questionRepository.findById(questionId)
                .orElseThrow(() -> new RuntimeException("Question not found"));

        question.setResponse(null);
        question.setResponseDate(null);
        questionRepository.save(question);
    }

    @Override
    public List<QuestionCategoryDTO> getAllCategories() {
        return questionCategoryRepository.findAll().stream()
                .map(category -> new QuestionCategoryDTO(category.getId(), category.getName().toString()))
                .collect(Collectors.toList());
    }

    @Override
    public List<QuestionDTO> getAnsweredQuestions() {
        return questionRepository.findAllWithResponse().stream()
                .map(QuestionDTO::toGetQuestionDTO)
                .collect(Collectors.toList());
    }

    @Override
    public List<QuestionDTO> getUnansweredQuestions() {
        return questionRepository.findAllWithoutResponse().stream()
                .map(QuestionDTO::toGetQuestionDTO)
                .collect(Collectors.toList());
    }

    //관리자 상품목록 가져오기, 카테고리 or 키워드별 검색 후 페이징처리
    @Override
    public Map<String, Object> getAllProductList(Map<String, Object> dataMap) {
        Map<String, Object> products = new HashMap<>();

        Pageable pageable = (Pageable) dataMap.get("pageable"); // 페이지 처리
        int block = Integer.parseInt(dataMap.get("block").toString()); //한 페이지당 보여줄 숫자
        String sortby = dataMap.get("sortby").toString(); //정렬 기준 현재 없음
        int categoryid = Integer.parseInt(dataMap.get("categoryid").toString());
        String keyword = null; //검색어

        if (dataMap.get("keyword") != null) {
            keyword = dataMap.get("keyword").toString();
        }

        // default 최신순 정렬 (가격순)
        Sort sort = pageable.getSort();
        //아래 재고조회 하는 레포지토리 때문에 안됌
        /*
        if (sortby.equals("priceHigh")) {
            //가격 높은 순
            sort = Sort.by(Sort.Direction.DESC, "price");
        } else if (sortby.equals("priceLow")) {
            //가격 낮은 순 
            sort = Sort.by(Sort.Direction.ASC, "price");
        }
        */

        pageable = PageRequest.of(pageable.getPageNumber(), pageable.getPageSize(), sort);

        //조건별 상품 목록 가져오기
        Page<ProductEntity> pageProductList = null;
        Page<ProductStockEntity> productStock = null;
        if (categoryid == 0 && keyword == null) {
            //전체 상품 중 delete = false 인 상품 검색
            pageProductList = productRepository.findByDeleteFalse(pageable);
            productStock = productStockRepository.findAll(pageable);
        } else if (categoryid != 0 && keyword == null){
            System.out.println("categoryid 검색");
            pageProductList = productRepository.findBycategoryid(categoryid, pageable);
            productStock = productRepository.findProductStockBycategoryid(categoryid, pageable);
        } else if (categoryid == 0 && keyword != null){
            System.out.println("keyword 검색"); //오전 이거하나
            pageProductList = productRepository.findByNameContainingIgnoreCase(keyword, pageable);
            productStock = productRepository.findProductStockByKeyword(keyword, pageable); //상품 재고

        } else if(categoryid != 0 && keyword != null){
            System.out.println("둘다 검색할때");
            pageProductList = productRepository.findByNameContainingIgnoreCaseAndCategoryEntity_id(keyword, categoryid, pageable);
            productStock = productRepository.findProductStockByCategoryidAndKeyword(keyword, categoryid, pageable);
        }

        // Entity -> DTO 변환
        List<ProductDTO> dtoList = pageProductList.getContent()
                .stream()
                .map(productEntity -> {
                    System.out.println(productEntity.getId());
                    System.out.println(productEntity.getImg());
                    return ProductDTO.toGetProductDTO(productEntity);
                })
                .collect(Collectors.toList());

        //상품재고 Entity -> DTO 변환
        List<ProductStockDTO> getStock = productStock.getContent()
                .stream()
                .map(productStockEntity -> {
                    System.out.println(productStockEntity.getCount());
                    System.out.println(productStockEntity.getSize());
                    return ProductStockDTO.toGetProductStockDTO(productStockEntity);
                })
                .collect(Collectors.toList());

        int currentBlock = pageProductList.getNumber() / block;
        int startPage = currentBlock * block;
        int engPage = Math.min(startPage + block, pageProductList.getTotalPages());

        //페이징 정보 결과 담기
        products.put("startPage", startPage); //블럭 첫번째 페이지
        products.put("engPage", engPage); //블럭 마지막 페이지
        products.put("isFirst", pageProductList.isFirst()); //1페이지 여부
        products.put("isLast", pageProductList.isLast()); //마지막 페이지 여부
        products.put("hasPrevious", pageProductList.hasPrevious()); //이전 페이지 여부
        products.put("hasNext", pageProductList.hasNext()); //다음 페이지 여부
        products.put("totalPages", pageProductList.getTotalPages()); //페이지 개수

        //상품 관련 정보 담기
        products.put("dtoList", dtoList);
        products.put("category", getCategory());
        products.put("getStock", getStock); //검색한 상품 재고

        return products;
    }

    @Override
    public List<ProductCategoryDTO> getCategory() {
        List<ProductCategoryDTO> list = new ArrayList<>();
        Iterable<ProductCategoryEntity> categoryEntityList = productCategoryRepository.findAll();

        for (ProductCategoryEntity categoryEntity : categoryEntityList) {
            ProductCategoryDTO categoryDTO = ProductCategoryDTO.getCategoryDTO(categoryEntity);
            System.out.println(categoryDTO);
            list.add(categoryDTO);
        }

        return list;
    }

}