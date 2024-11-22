package com.example.demo.payment.dto;

import java.time.LocalDateTime;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@AllArgsConstructor
@NoArgsConstructor
public class PaymentDTO {
    private Integer id; // 결제 고유 키
    private Integer userId; // 결제 사용자 PK
    private int totalPrice; // 총 결제 금액
    private String paymentType = "카드"; // 결제 방식 (기본값: 카드)
    private String recipientName; // 수령인 이름
    private String recipientTel; // 수령인 전화번호 010-0000-0000
    private String recipientAddr1; // 수령인 주소 1
    private String recipientAddr2; // 수령인 주소 2
    private String recipientAddrZipcode; // 수령인 우편번호
    private String deliveryMsg; // 배송 메시지
    private int productCount; // 총 주문 상품 개수
    private LocalDateTime paymentDate; // 결제 요청 일시
}
