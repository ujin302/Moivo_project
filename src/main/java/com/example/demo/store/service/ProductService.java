package com.example.demo.store.service;

import java.util.List;
import org.springframework.data.domain.Pageable;
import java.util.Map;

import com.example.demo.store.dto.ProductCategoryDTO;

public interface ProductService {

    public Map<String, Object> getProduct(int productId);

    public void saveProduct(Map<String, Object> map);

    public Map<String, Object> getProductList(Pageable pageable, String sortby, int categoryid, String keyword);

    public List<ProductCategoryDTO> getCategory();

    // 상품 수정 - 24.11.25 - 이유진
    public void putProduct(Map<String, Object> map);

    public void deleteProduct(int productId);

    // 상품 상세 정보 가져오기 - 24.11.28 - 김성찬
    public Map<String, Object> getProductDetail(int productId);

}