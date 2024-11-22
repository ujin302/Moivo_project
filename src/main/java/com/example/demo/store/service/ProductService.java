package com.example.demo.store.service;

import java.util.Map;

public interface ProductService {

    public Map<String, Object> getProduct(int productSeq);

    public void saveProduct(Map<String, Object> map);

    public Map<String, Object> getProductList();

}