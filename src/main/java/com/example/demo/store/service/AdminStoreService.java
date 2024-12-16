package com.example.demo.store.service;

import java.util.Map;

import org.springframework.stereotype.Service;

@Service
public interface AdminStoreService {

    Map<String, Object> getProductStatus();
    
}
