package com.example.demo.coupon.entity;

import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.GenerationType;
import jakarta.persistence.Id;
import jakarta.persistence.Table;
import lombok.Data;

import java.math.BigDecimal;

@Data
@Entity
@Table(name = "coupon")  
public class CouponEntity {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Integer id; // 쿠폰 고유 ID
    
    private String name; // 쿠폰 이름 
    private String grade; // 쿠폰 등급

     @Column(name = "discounttype")
    private String discountType; // 할인 타입

    @Column(name = "discountvalue")
    private BigDecimal discountValue; // 할인 금액 

    @Column(name = "minorderprice")
    private BigDecimal minOrderPrice; // 쿠폰 사용을 위한 최소 주문 금액

    @Column(name = "isactive")
    private Boolean active; // 쿠폰 활성화 여부 
}
