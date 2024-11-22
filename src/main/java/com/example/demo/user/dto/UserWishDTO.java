package com.example.demo.user.dto;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@AllArgsConstructor
@NoArgsConstructor
public class UserWishDTO {
    private Integer id; // 찜 목록 고유 키
    private Integer wishid; // 찜 참조
    private Integer productid; // 상품 참조
}
