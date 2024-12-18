package com.example.demo.payment.service.impl;

import java.time.LocalDateTime;
import java.util.List;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.scheduling.annotation.Scheduled;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import com.example.demo.payment.entity.PaymentEntity;
import com.example.demo.payment.entity.PaymentEntity.DeliveryStatus;
import com.example.demo.payment.repository.PaymentRepository;

@Service
public class PaymentScheduler {

    @Autowired
    private PaymentRepository paymentRepository;

    /**
     * 스케줄러는 5분마다 실행된다. DeliveryStatus가 CONFIRMED가 아닌 데이터 중
     * 결제 후 30분이 지난 데이터를 업데이트하기기
     */
    @Transactional
    @Scheduled(fixedRate = 300000) // 5분마다 실행
    public void updateDeliveryStatus() {
        // 현재 시간 기준으로 30분 이상 경과한 데이터만 조회
        LocalDateTime cutoffTime = LocalDateTime.now().minusMinutes(30);

        //LocalDateTime cutoffTime = LocalDateTime.now().minusMinutes(5); 테스트용으로 5분마다 바뀌게 해보기

        List<PaymentEntity> payments = paymentRepository.findByDeliveryStatusNotAndPaymentDateBefore(
            DeliveryStatus.CONFIRMED, cutoffTime
        );

        // 상태 변경하고 저장하기기
        for (PaymentEntity payment : payments) {
            DeliveryStatus currentStatus = payment.getDeliveryStatus();
            DeliveryStatus newStatus = getNextDeliveryStatus(currentStatus);
            System.out.println("현재 배송상태 : " + currentStatus);
            System.out.println("다음 배송상태 : " + newStatus);

            if (newStatus != null && newStatus != currentStatus) {
                payment.setDeliveryStatus(newStatus);
                paymentRepository.save(payment); // 상태가 변경된 경우만 저장
                System.out.println("Payment ID " + payment.getId() + " 상태 변경: " 
                    + currentStatus + " → " + newStatus);
            }
        }
    }

    // 현재 상태에 따라 다음 상태 반환
    private DeliveryStatus getNextDeliveryStatus(DeliveryStatus currentStatus) {
        switch (currentStatus) {
            case PAYMENT_COMPLETED:
                return DeliveryStatus.READY;
            case READY:
                return DeliveryStatus.DELIVERY;
            case DELIVERY:
                return DeliveryStatus.CONFIRMED;
            default:
                return null; // CONFIRMED 상태는 더 이상 변경하지 않음
        }
    }
}
