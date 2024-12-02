package com.example.demo.user.dto;

import com.example.demo.store.dto.ProductDTO;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@NoArgsConstructor
@AllArgsConstructor
public class UserCartDTO {
    private Integer id; // PK
    private Integer cartId; // 장바구니 PK
    private ProductDTO productDTO; // Product 정보
    private String size; // 상품 사이즈 (S, M, L)
    private int count; // 상품 수량
    private int stockCount; // ProductStock에서 가져온 재고 수량
    private boolean isSoldOut;  // 품절 여부
}

