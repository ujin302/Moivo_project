package com.example.demo.store.service;

import java.util.List;
import java.util.Map;

import com.example.demo.store.dto.ProductCategoryDTO;
import com.example.demo.store.entity.ProductEntity.Gender;

public interface ProductService {

    public Map<String, Object> getProduct(int productId);

    public void saveProduct(Map<String, Object> map);

    public Map<String, Object> getProductList(Map<String, Object> dataMap);

    public List<ProductCategoryDTO> getCategory();

    // 상품 수정 - 24.11.25 - 이유진
    public void putProduct(Map<String, Object> map);

    public List<Gender> getGenders();

    public void deleteProduct(int productId);

}