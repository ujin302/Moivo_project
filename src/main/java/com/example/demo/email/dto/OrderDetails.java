package com.example.demo.email.dto;

import lombok.Data;

@Data
public class OrderDetails {
    private String toAddress; // 받을 고객 이메일
    private String customerName; // 고객 이름
    private String orderId;      // 주문 번호
    private String orderName;    // 상품 이름
    private int amount;          // 결제 금액
    private String addr;         // 배송지
    private String deliverystatus; //배송현황
}
