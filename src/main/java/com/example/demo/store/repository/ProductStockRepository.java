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
}
