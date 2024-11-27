package com.example.demo.user.entity;

import com.example.demo.store.entity.ProductEntity;

import jakarta.persistence.Column;
import jakarta.persistence.Convert;
import jakarta.persistence.Entity;
import jakarta.persistence.FetchType;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.GenerationType;
import jakarta.persistence.Id;
import jakarta.persistence.JoinColumn;
import jakarta.persistence.ManyToOne;
import jakarta.persistence.Table;
import lombok.Data;

@Data
@Entity
@Table(name = "usercart")
public class UserCartEntity {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Integer id;

    // 장바구니 참조
    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "cartid", nullable = false)
    private CartEntity cartEntity;

    // 상품 참조
    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "productid", nullable = false)
    private ProductEntity productEntity;

    // 상품 수량
    @Column(nullable = false)
    private int count;

    // 상품 사이즈 (TINYINT로 저장)  //11.26 - yjy (이거 DB에는 타입이 TINYINT로 되어있어서 숫자로 변환할려고 한거긴 해요~)
    @Column(nullable = false)
    @Convert(converter = SizeConverter.class)
    private com.example.demo.user.entity.Size size; // Enum 사용
}
