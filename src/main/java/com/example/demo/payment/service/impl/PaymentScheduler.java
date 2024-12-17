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

    @Transactional
    @Scheduled(fixedRate = 60000) // 1분마다 실행
    public void updateDeliveryStatus() {
        // 전체 결제 내역 가져오기
        List<PaymentEntity> payments = paymentRepository.findAll();

        LocalDateTime now = LocalDateTime.now(); // 현재 시간

        for (PaymentEntity payment : payments) {
            // CONFIRMED 상태는 더 이상 변경하지 않음
            if (payment.getDeliveryStatus() == DeliveryStatus.CONFIRMED) {
                continue;
            }

            // 결제 후 30분이 지났는지 확인
            LocalDateTime paymentDate = payment.getPaymentDate();
            long minutesPassed = java.time.Duration.between(paymentDate, now).toMinutes();

            if (minutesPassed >= 30) { // 30분이 지난 경우 상태 업데이트
                DeliveryStatus currentStatus = payment.getDeliveryStatus();

                switch (currentStatus) {
                    case PAYMENT_COMPLETED:
                        payment.setDeliveryStatus(DeliveryStatus.READY);
                        break;
                    case READY:
                        payment.setDeliveryStatus(DeliveryStatus.DELIVERY);
                        break;
                    case DELIVERY:
                        payment.setDeliveryStatus(DeliveryStatus.CONFIRMED);
                        break;
                    default:
                        break;
                }

                // 상태가 변경되었으므로 저장
                paymentRepository.save(payment);
            }
        }
    }
}
