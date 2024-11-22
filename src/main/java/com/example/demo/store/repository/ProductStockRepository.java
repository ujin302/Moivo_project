package com.example.demo.store.repository;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import com.example.demo.store.entity.ProductStockEntity;

@Repository
public interface ProductStockRepository extends JpaRepository<ProductStockEntity, Integer> {

}
