package com.example.demo.user.dto;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@AllArgsConstructor
@NoArgsConstructor
public class UserCartDTO {
    private Integer id; // PK
    private Integer cartId; // 장바구니 PK
    private Integer productId; // 상품 PK
    private String size; // 상품 사이즈 : S, M, L
    private int count; // 상품 수량
}
