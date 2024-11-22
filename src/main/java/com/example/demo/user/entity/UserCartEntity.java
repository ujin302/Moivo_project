package com.example.demo.user.entity;

import com.example.demo.store.entity.ProductEntity;

import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.FetchType;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.GenerationType;
import jakarta.persistence.Id;
import jakarta.persistence.JoinColumn;
import jakarta.persistence.ManyToOne;
import jakarta.persistence.Table;
import lombok.Data;
import com.example.demo.store.entity.ProductStockEntity.Size;

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

    // 상품 사이즈
    @Column(length = 10)
    private Size size;
}
