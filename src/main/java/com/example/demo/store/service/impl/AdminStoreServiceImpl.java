package com.example.demo.store.service.impl;

import java.util.HashMap;
import java.util.Map;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import com.example.demo.store.repository.ProductRepository;
import com.example.demo.store.repository.ProductStockRepository;
import com.example.demo.store.service.AdminStoreService;
import com.example.demo.store.entity.ProductEntity;
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
        
        // 품절 상품 수 (재고가 0인 상품, 사이즈별로 체크)
        long soldOutProducts = 0;
        
        // 판매 중인 상품을 가져와서 사이즈별 재고를 체크
        for (ProductEntity product : productRepository.findAll()) {
            boolean isSoldOut = false;
            
            // 해당 상품의 모든 사이즈별 재고를 가져와서 체크
            for (ProductStockEntity.Size size : ProductStockEntity.Size.values()) {
                ProductStockEntity stock = stockRepository.findByProductEntityAndSize(product, size);
                if (stock != null && stock.getCount() == 0) {
                    isSoldOut = true; // 하나라도 품절이면 품절로 처리
                    break;
                }
            }
            if (isSoldOut) {
                soldOutProducts++;
            }
        }

        // 재고 10개 이하 상품 수
        long lowStockProducts = stockRepository.countByCountLessThanEqual(10);

        // 삭제 상품 수 - sumin 12.18
        long inactiveProducts = productRepository.countByDeleteTrue();

        result.put("전체 상품", totalProducts);
        result.put("판매 상품", activeProducts);
        result.put("품절 상품", soldOutProducts);
        result.put("재고 10 이하", lowStockProducts);
        result.put("삭제된 상품", inactiveProducts);

        return result;
    }
}
