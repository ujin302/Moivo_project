package com.example.demo.store.dto;

import com.example.demo.store.entity.ProductStockEntity;

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

    // entity -> dto 변환
    // 재고 출력
    public static ProductStockDTO toGetProductStockDTO(ProductStockEntity entity) {
        ProductStockDTO dto = new ProductStockDTO();

        dto.setId(entity.getId());
        dto.setProductId(entity.getProductEntity().getId());
        dto.setSize(entity.getSize().toString());
        dto.setCount(entity.getCount());

        return dto;
    }
}
