package com.example.demo.payment.repository;

import java.time.LocalDateTime;
import java.util.List;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import com.example.demo.payment.entity.PaymentEntity;

@Repository
public interface PaymentRepository extends JpaRepository<PaymentEntity, Integer> {
    // 특정 User의 orders를 조회
    public List<PaymentEntity> findByUserEntity_Id(Integer userId);

    // 특정 User의 Payment 조회 (특정 월에 대한 데이터)
    List<PaymentEntity> findByUserEntity_IdAndPaymentDateBetween(int userId, LocalDateTime startDate, LocalDateTime endDate);
}
