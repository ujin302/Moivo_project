package com.example.demo.payment.repository;

import java.util.List;

import org.springframework.data.jpa.repository.JpaRepository;

import com.example.demo.payment.entity.PaymentDetailEntity;

public interface PaymentDetailRepository extends JpaRepository<PaymentDetailEntity, Integer> {
    // 12/17 paymentId 값을 기준으로 PaymentEntity 조회 - km
    public List<PaymentDetailEntity> findByPaymentEntityId(int paymentId);
}
