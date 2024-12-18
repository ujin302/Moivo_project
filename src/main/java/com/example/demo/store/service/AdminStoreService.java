package com.example.demo.store.service;

import java.util.Map;

public interface AdminStoreService {

    public Map<String, Object> getProductStatus();

    public Map<String, Object> getAllProductList(Map<String, Object> datamap);

}
