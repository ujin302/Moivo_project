package com.example.demo.store.repository;

import com.example.demo.store.entity.ProductEntity;
import com.example.demo.store.entity.ProductImgEntity;

import java.util.List;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

@Repository
public interface ProductImgRepository extends JpaRepository<ProductImgEntity, Integer> {

    public void deleteByProductEntity(ProductEntity productEntity);

    // 24.11.28 - 상품 상세 정보 추출 - sc
    public List<ProductImgEntity> findByProductEntity(ProductEntity productEntity);

}
