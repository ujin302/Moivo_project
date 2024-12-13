package com.example.demo.payment.repository;

import java.time.LocalDateTime;
import java.util.List;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.stereotype.Repository;

import com.example.demo.payment.entity.PaymentEntity;

import feign.Param;

@Repository
public interface PaymentRepository extends JpaRepository<PaymentEntity, Integer> {
    // 특정 User의 Wish를 조회
    public List<PaymentEntity> findByUserEntity_Id(Integer userId);

    // 특정 User의 Payment 조회 (특정 월에 대한 데이터)
    public List<PaymentEntity> findByUserEntity_IdAndPaymentDateBetween(int userId, LocalDateTime startDate,
            LocalDateTime endDate);

    // 24.12.13 - 배송 현황에 따른 개수 - uj
    public long countByDeliveryStatus(PaymentEntity.DeliveryStatus paymentCompleted);

    // 24.12.13 - 날짜별 매출액 - uj
    @Query("SELECT SUM(p.totalPrice) FROM PaymentEntity p WHERE p.paymentDate BETWEEN :startOfDay AND :endOfDay")
    Long sumTotalPriceByPaymentDate(
            @Param("startOfDay") LocalDateTime startOfDay,
            @Param("endOfDay") LocalDateTime endOfDay);

    // 24.12.13 - 총 매출액 - uj
    @Query("SELECT SUM(p.totalPrice) FROM PaymentEntity p")
    public long sumTotalPrice();
}
