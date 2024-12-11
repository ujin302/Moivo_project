package com.example.demo.store.dto;

import com.example.demo.configuration.NCPStorageConfig;
import com.example.demo.ncp.dto.NCPObjectStorageDTO;
import com.example.demo.store.entity.ProductEntity;
import com.example.demo.store.entity.ProductEntity.Gender;

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
    private Gender gender; // 성별 F or M
    private int categoryId;

    // entity => dto 변환

    // 상품 데이터 출력
    public static ProductDTO toGetProductDTO(ProductEntity entity) {
        ProductDTO dto = new ProductDTO();
        NCPObjectStorageDTO ncpDTO = new NCPObjectStorageDTO();

        dto.setId(entity.getId());
        dto.setName(entity.getName());
        dto.setImg(ncpDTO.getURL() + entity.getImg());
        dto.setContent(entity.getContent());
        dto.setPrice(entity.getPrice());
        dto.setGender(entity.getGender());
        dto.setCategoryId(entity.getCategoryEntity().getId());

        return dto;
    }

    // ProductEntity -> ProductDTO 변환
    public ProductDTO(ProductEntity entity) {
        NCPObjectStorageDTO ncpDTO = new NCPObjectStorageDTO();

        this.id = entity.getId();
        this.name = entity.getName();
        this.img = ncpDTO.getURL() + entity.getImg();
        this.content = entity.getContent();
        this.price = entity.getPrice();
        this.gender = entity.getGender();
        this.categoryId = entity.getCategoryEntity().getId();
    }
}
