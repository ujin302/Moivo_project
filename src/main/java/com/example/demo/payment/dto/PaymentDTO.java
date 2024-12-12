package com.example.demo.payment.dto;

import java.time.LocalDateTime;

import com.example.demo.payment.entity.PaymentEntity.DeliveryStatus;

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
    private int discount; // 할인 금액
    private String name; // 수령인 이름
    private String email; // 수령인 전화번호 010-0000-0000
    private String tel; // 수령인 전화번호 010-0000-0000
    private String addr1; // 수령인 주소 1
    private String addr2; // 수령인 주소 2
    private String zipcode; // 수령인 우편번호
    private int count; // 총 주문 상품 개수
    private LocalDateTime paymentDate; // 결제 요청 일시
    private String tosscode; // 토스 고유 주문 번호 (예시: MC44MjA2MjI3OTQwNjI5)
    private DeliveryStatus deliveryStatus; // 배송 상태 (READY, IN_TRANSIT, DELIVERED)
}