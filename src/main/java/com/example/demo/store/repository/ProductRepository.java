package com.example.demo.store.repository;

import java.util.List;

import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import com.example.demo.store.entity.ProductEntity;

@Repository
public interface ProductRepository extends JpaRepository<ProductEntity, Integer> {

    // 카테고리id로 검색
    @Query("SELECT p FROM ProductEntity p WHERE p.categoryEntity.id =:categoryid")
    public Page<ProductEntity> findBycategoryid(@Param("categoryid") int categoryid, Pageable pageable);

    // 상품 검색 (keyword)
    // Containing = 부분검색, IgnoreCase = 대소문자 무시
    Page<ProductEntity> findByNameContainingIgnoreCase(String keyword, Pageable pageable);

    public int countByNameContaining(String keyword);

    // 상품 검색 (keyword + categoryid)
    Page<ProductEntity> findByNameContainingIgnoreCaseAndCategoryEntity_id(String name, int categoryid,
            Pageable pageable);

    public int countByNameContainingIgnoreCaseAndCategoryEntity_id(String keyword, int categoryid);

    public List<ProductEntity> findTop6ByGenderOrderByIdDesc(ProductEntity.Gender gender);
    public List<ProductEntity> findTop6ByGenderNotOrderByIdDesc(ProductEntity.Gender gender);
}
