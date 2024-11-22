package com.example.demo.user.dto;

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


    // Entity -> DTO 변환 메서드
    public static WishDTO toGetWishDTO(WishEntity entity) {
        WishDTO dto = new WishDTO();
        dto.setId(entity.getId());
        dto.setUserId(entity.getUserEntity().getId());
        return dto;
    }
}
