package com.example.demo.store.dto;

import com.example.demo.configuration.NCPStorageConfig;
import com.example.demo.ncp.dto.NCPObjectStorageDTO;
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
    private int categoryId;

    // entity => dto 변환

    // 상품 데이터 출력
    public static ProductDTO toGetProductDTO(ProductEntity entity) {
        ProductDTO dto = new ProductDTO();
        NCPObjectStorageDTO ncpDTO = new NCPObjectStorageDTO();

        dto.setId(entity.getId());
        dto.setName(entity.getName());
        dto.setContent(entity.getContent());
        dto.setPrice(entity.getPrice());
        dto.setCategoryId(entity.getCategoryEntity().getId());
        dto.setImg(ncpDTO.getURL() + entity.getImg());
        return dto;
    }
}
