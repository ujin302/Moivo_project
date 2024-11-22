package com.example.demo.payment.entity;

import java.time.LocalDateTime;
import java.util.List;

import com.example.demo.store.dto.ProductDTO;
import com.example.demo.user.entity.UserEntity;

import jakarta.persistence.CascadeType;
import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.GenerationType;
import jakarta.persistence.Id;
import jakarta.persistence.JoinColumn;
import jakarta.persistence.ManyToOne;
import jakarta.persistence.OneToMany;
import jakarta.persistence.Table;
import lombok.Data;

@Data
@Entity
@Table(name = "payment")
public class PaymentEntity {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Integer id; // 결제 고유 키

    // 주문 n건 : 사용자 1명
    @ManyToOne
    @JoinColumn(name = "userid", nullable = false)
    private UserEntity userEntity; // 결제 사용자

    @Column(name = "totalprice", nullable = false)
    private int totalPrice; // 총 결제 금액

    @Column(name = "paymenttype", length = 10, nullable = false, columnDefinition = "VARCHAR(10) DEFAULT '카드'")
    private String paymentType = "카드"; // 결제 방식 (기본값: 카드)

    @Column(name = "recipientname", length = 30, nullable = false)
    private String recipientName; // 수령인 이름

    @Column(name = "recipienttel", length = 13, nullable = false)
    private String recipientTel; // 수령인 전화번호 010-0000-0000

    @Column(name = "recipientaddr1", length = 100, nullable = false)
    private String recipientAddr1; // 수령인 주소 1

    @Column(name = "recipientaddr2", length = 100, nullable = false)
    private String recipientAddr2; // 수령인 주소 2

    @Column(name = "recipientaddrzipcode", length = 100)
    private String recipientAddrZipcode; // 수령인 우편번호

    @Column(name = "deliverymsg", length = 100)
    private String deliveryMsg; // 배송 메시지

    @Column(name = "productcount", nullable = false)
    private int productCount; // 총 주문 상품 개수

    @Column(name = "paymentdate", columnDefinition = "TIMESTAMP DEFAULT CURRENT_TIMESTAMP")
    private LocalDateTime paymentDate; // 결제 요청 일시

    // 주문 1건 : 상품 n개
    @OneToMany(mappedBy = "paymentEntity", cascade = CascadeType.ALL, orphanRemoval = true)
    private List<PaymentDetailEntity> paymentDetailList; // 결제 상세
}
