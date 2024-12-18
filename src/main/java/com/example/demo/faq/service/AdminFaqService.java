package com.example.demo.faq.service;

import com.example.demo.qna.dto.QuestionDTO;

import java.util.List;

public interface AdminFaqService {

    // FAQ 추가
    public boolean addFaq(QuestionDTO questionDTO);

    // FAQ 목록 조회
    public List<QuestionDTO> getFaqList();

    // FAQ 수정
    public boolean updateFaq(Integer id, QuestionDTO questionDTO);

    // FAQ 삭제
    public boolean deleteFaq(Integer id);

    
}
