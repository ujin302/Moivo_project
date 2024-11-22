package com.example.demo.store.entity;

import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.GenerationType;
import jakarta.persistence.Id;
import jakarta.persistence.JoinColumn;
import jakarta.persistence.ManyToOne;
import jakarta.persistence.Table;
import lombok.Data;

@Data
@Entity
@Table(name = "productimg")
public class ProductImgEntity {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Integer id;

    // 이미지 n개 : 상품 1개
    @ManyToOne
    @JoinColumn(name = "productid", nullable = false)
    private ProductEntity productEntity; // 상품

    @Column(name = "filename", length = 100, nullable = false)
    private String fileName; // 이미지 파일 이름

    @Column(name = "originalfilename", length = 100, nullable = false)
    private String originalFileName; // 원본 이미지 파일 이름

    @Column(nullable = false)
    private int layer; // 이미지 계층
    // 1: 메인
    // 2: 상세 1
    // 3: 상세 2
    // 4: 주문 이미지

}
