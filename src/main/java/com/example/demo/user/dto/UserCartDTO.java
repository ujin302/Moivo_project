package com.example.demo.user.dto;

import com.example.demo.store.dto.ProductDTO;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@AllArgsConstructor
@NoArgsConstructor
public class UserCartDTO {
    private Integer id; // PK
    private Integer cartId; // 장바구니 PK
    private ProductDTO productDTO; //
    private String size; // 상품 사이즈 : S, M, L
    private int count; // 상품 수량

    public UserCartDTO(Integer id, Integer cartId, int productId, String size, int count) {
        this.id = id;
        this.cartId = cartId;
        this.productDTO = new ProductDTO();
        this.productDTO.setId(productId);
        this.size = size;
        this.count = count;
    }
}
