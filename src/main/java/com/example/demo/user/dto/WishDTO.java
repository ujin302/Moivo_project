package com.example.demo.user.dto;

import com.example.demo.store.dto.ProductDTO;
import com.example.demo.user.entity.WishEntity;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@AllArgsConstructor
@NoArgsConstructor
public class WishDTO {
    private Integer id; // 찜 고유 키
    private Integer userId; // 고객 고유 키
    private ProductDTO product; // 찜한 상품 정보 (ProductDTO로 변환)

    // Entity -> DTO 변환 메서드
    public static WishDTO toGetWishDTO(WishEntity entity) {
        WishDTO dto = new WishDTO();
        dto.setId(entity.getId());
        dto.setUserId(entity.getUserEntity().getId());

        // UserWishEntity에서 상품 정보 가져와서 ProductDTO로 변환
        if (!entity.getUserWishList().isEmpty()) {
            // 첫 번째 UserWishEntity의 ProductEntity를 가져옵니다
            dto.setProduct(ProductDTO.toGetProductDTO(entity.getUserWishList().get(0).getProductEntity()));
        }

        return dto;
    }
}
