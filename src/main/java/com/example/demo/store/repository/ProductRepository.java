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

    // 카테고리id로 검색 (delete가 false인 것만)
    @Query("SELECT p FROM ProductEntity p WHERE p.categoryEntity.id =:categoryid AND p.delete = false")
    public Page<ProductEntity> findBycategoryid(@Param("categoryid") int categoryid, Pageable pageable);

    // 상품 검색 (keyword) (delete가 false인 것만)
    @Query("SELECT p FROM ProductEntity p WHERE LOWER(p.name) LIKE LOWER(CONCAT('%', :keyword, '%')) AND p.delete = false")
    Page<ProductEntity> findByNameContainingIgnoreCase(@Param("keyword") String keyword, Pageable pageable);

    public int countByNameContaining(String keyword);

    // 상품 검색 (keyword + categoryid) (delete가 false인 것만)
    @Query("SELECT p FROM ProductEntity p WHERE LOWER(p.name) LIKE LOWER(CONCAT('%', :keyword, '%')) AND p.categoryEntity.id = :categoryid AND p.delete = false")
    Page<ProductEntity> findByNameContainingIgnoreCaseAndCategoryEntity_id(@Param("keyword") String name, @Param("categoryid") int categoryid, Pageable pageable);

    public int countByNameContainingIgnoreCaseAndCategoryEntity_id(String keyword, int categoryid);

    // 최신순으로 특정 성별 상품 6개 가져오기 (delete가 false인 것만)
    public List<ProductEntity> findTop6ByGenderAndDeleteFalseOrderByIdDesc(ProductEntity.Gender gender);
    public List<ProductEntity> findTop6ByGenderNotAndDeleteFalseOrderByIdDesc(ProductEntity.Gender gender);

    // 삭제되지 않은 전체 상품만 검색
    Page<ProductEntity> findByDeleteFalse(Pageable pageable);
    
    // 삭제된 상품만 가져오기
    List<ProductEntity> findByDeleteTrue();
    
    // 삭제되지 않은 상품(판매 중인 상품) 수 조회 - 24.12.13 - yjy
    public long countByDeleteFalse();
}
