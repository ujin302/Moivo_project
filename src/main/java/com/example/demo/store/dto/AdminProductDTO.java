package com.example.demo.store.dto;

import java.util.Map;

import com.example.demo.store.entity.ProductEntity;
import com.example.demo.store.entity.ProductEntity.ProductStatus;
import com.example.demo.store.entity.ProductStockEntity.Size;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

// 24.12.18 - uj
// 관리자 화면에서 상품 목록 출력 시, 사용 
@Data
@NoArgsConstructor
@AllArgsConstructor
public class AdminProductDTO {
    private Integer id;
    private String name;
    private int price;
    private int allcount;
    private ProductStatus status; // "" or 일부 품절 or 전체 품절
    private Map<Size, Integer> stock; // 사이즈별 재고

    // entity => dto 변환

    // 상품 데이터 출력
    public static AdminProductDTO toGetAdminProductDTO(ProductEntity entity, Map<Size, Integer> stock) {
        AdminProductDTO dto = new AdminProductDTO();

        dto.setId(entity.getId());
        dto.setName(entity.getName());
        dto.setPrice(entity.getPrice());
        dto.setStatus(entity.getStatus());
        dto.setStock(stock);

        int allcount = stock.get(Size.S) + stock.get(Size.M) + stock.get(Size.L);
        dto.setAllcount(allcount);

        return dto;
    }

}
