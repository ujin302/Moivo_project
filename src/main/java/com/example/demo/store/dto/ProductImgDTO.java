package com.example.demo.store.dto;

import com.example.demo.store.entity.ProductImgEntity;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@NoArgsConstructor
@AllArgsConstructor
public class ProductImgDTO {
    private Integer id;
    private String fileName; // 이미지 파일 이름
    private String originalFileName; // 원본 이미지 파일 이름
    private int layer; // 이미지 계층

    // 1: 메인
    // 2: 상세 1
    // 3: 상세 2
    // 4: 주문 이미지

    // entity => dto 변환

    // 이미지 출력
    public static ProductImgDTO toGetProductImgDTO(ProductImgEntity entity) {
        ProductImgDTO dto = new ProductImgDTO();
        dto.setId(entity.getId());
        dto.setFileName(entity.getFileName());
        dto.setOriginalFileName(entity.getOriginalFileName());
        dto.setLayer(entity.getLayer());

        return dto;
    }

}
