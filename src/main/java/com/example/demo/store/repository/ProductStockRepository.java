package com.example.demo.store.repository;

import java.util.List;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import com.example.demo.store.entity.ProductEntity;
import com.example.demo.store.entity.ProductStockEntity;

@Repository
public interface ProductStockRepository extends JpaRepository<ProductStockEntity, Integer> {

    // 상품 기준으로 추출 - 24.11.25 - uj
    public List<ProductStockEntity> findByProductEntity(ProductEntity productEntity);

    // 상품 ID와 사이즈로 재고를 조회
    ProductStockEntity findByProductEntityAndSize(ProductEntity productEntity, ProductStockEntity.Size size);

    // 재고가 0인 상품 수 조회 - 24.12.13 - yjy
    public long countByCountEquals(int count);

    // 재고가 특정 수량 이하인 상품 수 조회
    public long countByCountLessThanEqual(int count);

}
