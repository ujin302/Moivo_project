package com.example.demo.store.service;

import java.util.List;
import org.springframework.data.domain.Pageable;
import java.util.Map;

import com.example.demo.store.dto.ProductCategoryDTO;

public interface ProductService {

    public Map<String, Object> getProduct(int productSeq);

    public void saveProduct(Map<String, Object> map);

    public Map<String, Object> getProductList(Pageable pageable, String sortby, int categoryid);

    public Map<String, Object> getProductSearchList(Pageable pageable, String sortby, String keyword);
}