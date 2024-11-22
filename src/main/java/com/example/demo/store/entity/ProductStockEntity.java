package com.example.demo.store.entity;

import com.example.demo.store.dto.ProductStockDTO;

import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.EnumType;
import jakarta.persistence.Enumerated;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.GenerationType;
import jakarta.persistence.Id;
import jakarta.persistence.JoinColumn;
import jakarta.persistence.ManyToOne;
import jakarta.persistence.Table;
import lombok.Data;

@Data
@Entity
@Table(name = "productstock")
public class ProductStockEntity {

    public enum Size {
        S, M, L
    }

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Integer id; // 재고 고유 키

    // 사이즈 3개 : 상품 1개
    @ManyToOne
    @JoinColumn(name = "productid", nullable = false)
    private ProductEntity productEntity; // 상품 고유 키 (Product 테이블과 연관)

    @Enumerated(EnumType.STRING)
    @Column(nullable = false)
    private Size size; // 상품 사이즈 (S, M, L)

    @Column(nullable = false)
    private int count; // 재고 수량

    // DTO => Entity 변환

    // 상품 데이터 저장
    public static ProductStockEntity toSaveStockEntity(ProductStockDTO stockDTO, ProductEntity productEntity) {
        ProductStockEntity entity = new ProductStockEntity();
        entity.setProductEntity(productEntity);
        entity.setCount(stockDTO.getCount());
        switch (stockDTO.getSize()) {
            case "S":
                entity.setSize(Size.S);
                break;
            case "M":
                entity.setSize(Size.M);
                break;
            case "L":
                entity.setSize(Size.L);
                break;
            default:
                entity.setSize(Size.S);
                break;
        }

        return entity;
    }
}
