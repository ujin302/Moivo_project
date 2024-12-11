package com.example.demo.qna.repository;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;
import java.util.List;
import com.example.demo.qna.entity.QuestionEntity;

@Repository
public interface QuestionRepository extends JpaRepository<QuestionEntity, Integer> {
    // 특정 카테고리의 문의 조회
    List<QuestionEntity> findByCategoryEntityId(Integer categoryId);

    // 특정 사용자의 문의 조회
    List<QuestionEntity> findByUserEntityId(Integer userId);
}
