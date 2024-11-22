package com.example.demo.store.repository;

import org.springframework.data.repository.CrudRepository;
import org.springframework.stereotype.Repository;

import com.example.demo.store.entity.ProductCategoryEntity;

@Repository
public interface ProductCategoryRepository extends CrudRepository<ProductCategoryEntity, Integer> {

}