package com.example.demo.payment.entity;

import com.example.demo.store.entity.ProductEntity;

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
@Table(name = "paymentdetail")
public class PaymentDetailEntity {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Integer id; // 결제 상세 고유 키

    // 주문상품 n개 : 주문 1개
    @ManyToOne
    @JoinColumn(name = "paymentid", nullable = false)
    private PaymentEntity paymentEntity; // 결제와 연관된 결제 정보

    // 주문상품 n건 : 상품 1개
    @ManyToOne
    @JoinColumn(name = "productid", nullable = false)
    private ProductEntity productEntity; // 상품과 연관된 상품 정보

    @Column(name = "price", nullable = false)
    private int price; // 상품 가격: 1개 상품 가격 * 상품 수량

    @Column(name = "count", nullable = false)
    private int count; // 상품 수량
}
