package com.example.demo.payment.dto;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@AllArgsConstructor
@NoArgsConstructor
public class PaymentDetailDTO {
    private Integer id; // 결제 상세 고유 키
    private Integer paymentId; // 결제와 연관된 결제 정보
    private Integer productId; // 상품과 연관된 상품 정보
    private int price; // 상품 가격: 1개 상품 가격 * 상품 수량
    private int count; // 상품 수량
}
