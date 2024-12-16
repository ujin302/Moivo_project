package com.example.demo.store.service.impl;

import java.util.HashMap;
import java.util.Map;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import com.example.demo.store.repository.ProductRepository;
import com.example.demo.store.repository.ProductStockRepository;
import com.example.demo.store.service.AdminStoreService;
import com.example.demo.store.entity.ProductStockEntity;

// 24.12.13 파일 생성 - yjy
@Service
public class AdminStoreServiceImpl implements AdminStoreService {

    @Autowired
    private ProductRepository productRepository;

    @Autowired
    private ProductStockRepository stockRepository;

    // 24.12.13 - 상품 현황 조회 - yjy
    @Override
    public Map<String, Object> getProductStatus() {
        Map<String, Object> result = new HashMap<>();

        // 전체 상품 수
        long totalProducts = productRepository.count();
        
        // 판매 중인 상품 수 (삭제되지 않은 상품)
        long activeProducts = productRepository.countByDeleteFalse();
        
        // 품절 상품 수 (재고가 0인 상품)
        long soldOutProducts = stockRepository.countByCountEquals(0);
        
        // 재고 10개 이하 상품 수
        long lowStockProducts = stockRepository.countByCountLessThanEqual(10);

        result.put("전체 상품", totalProducts);
        result.put("판매 상품", activeProducts);
        result.put("품절 상품", soldOutProducts);
        result.put("재고 10 이하", lowStockProducts);

        return result;
    }
}
