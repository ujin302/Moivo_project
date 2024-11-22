package com.example.demo.store.dto;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@NoArgsConstructor
@AllArgsConstructor
public class ProductStockDTO {
    private Integer id; // 재고 고유 키
    private Integer productId; // 상품 고유 키 (Product 테이블과 연관)
    private String size; // 상품 사이즈 (S, M, L)
    private int count; // 재고 수량

}
