package com.example.demo.user.dto;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@NoArgsConstructor
@AllArgsConstructor
public class CartDTO { // 장바구니
    private Integer id; // 장바구니 PK
    private Integer userId; // 사용자 PK
}
