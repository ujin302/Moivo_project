package com.example.demo.store.repository;

import com.example.demo.store.entity.ProductImgEntity;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

@Repository
public interface ProductImgRepository extends JpaRepository<ProductImgEntity, Integer> {

}
