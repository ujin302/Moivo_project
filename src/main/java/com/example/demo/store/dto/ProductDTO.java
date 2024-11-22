package com.example.demo.store.dto;

import com.example.demo.store.entity.ProductEntity;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@NoArgsConstructor
@AllArgsConstructor
public class ProductDTO { // 상품
    private Integer id;
    private String name;
    private String img;
    private String content;
    private int price;

    // entity => dto 변환

    // 상품 데이터 출력
    public static ProductDTO toGetProductDTO(ProductEntity entity) {
        ProductDTO dto = new ProductDTO();
        dto.setId(entity.getId());
        dto.setName(entity.getName());
        dto.setImg(entity.getImg());
        dto.setContent(entity.getContent());
        dto.setPrice(entity.getPrice());

        return dto;
    }
}
