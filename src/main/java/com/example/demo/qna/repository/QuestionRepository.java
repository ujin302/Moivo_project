package com.example.demo.qna.repository;

import java.time.LocalDateTime;
import java.util.List;
import java.util.Optional;

import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.Modifying;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;
import com.example.demo.qna.entity.QuestionEntity;
import org.springframework.transaction.annotation.Transactional;

@Repository
public interface QuestionRepository extends JpaRepository<QuestionEntity, Integer> {

    // 모든 문의 조회
    @Query("SELECT q FROM QuestionEntity q ORDER BY q.questionDate DESC")
    @Override
    public List<QuestionEntity> findAll();

    // 문의 답변 등록
    @Modifying
    @Query("UPDATE QuestionEntity q SET q.response = :response, q.responseDate = :responseDate WHERE q.id = :id")
    @Transactional
    public int saveResponse(
            @Param("id") Integer id,
            @Param("response") String response,
            @Param("responseDate") LocalDateTime responseDate
    );

    // 선택한 문의 답변 조회
    @Query("SELECT q FROM QuestionEntity q WHERE q.id = :id")
    public Optional<QuestionEntity> findResponseById(@Param("id") Integer id);

    // 문의 답변 수정
    @Modifying
    @Query("UPDATE QuestionEntity q SET q.response = :response, q.responseDate = :responseDate WHERE q.id = :id")
    @Transactional
    public void updateResponse(
            @Param("id") Integer id,
            @Param("response") String response,
            @Param("responseDate") LocalDateTime responseDate
    );

    // 문의 답변 삭제
    @Modifying
    @Query("UPDATE QuestionEntity q SET q.response = NULL, q.responseDate = NULL WHERE q.id = :id")
    @Transactional
    public void deleteResponse(@Param("id") Integer id);

    // 문의 삭제
    public void deleteById(Integer id);

    // 문의 카테고리 검색
    public Page<QuestionEntity> findByTitleContainingIgnoreCase(String title, Pageable pageable);

    // 답변 상태로 문의 조회
    @Query("SELECT q FROM QuestionEntity q WHERE q.response IS NOT NULL")
    public List<QuestionEntity> findAllWithResponse();

    // 미답변 상태 문의 조회
    @Query("SELECT q FROM QuestionEntity q WHERE q.response IS NULL")
    public List<QuestionEntity> findAllWithoutResponse();

    // 24.12.13 - yjy
    // 미답변 문의 수 조회
    int countByResponseIsNull();

    // 24.12.13 - yjy
    // 답변 완료 문의 수 조회
    int countByResponseIsNotNull();


}