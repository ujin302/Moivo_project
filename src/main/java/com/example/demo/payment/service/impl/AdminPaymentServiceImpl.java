package com.example.demo.payment.service.impl;

import java.time.LocalDate;
import java.time.LocalDateTime;
import java.time.LocalTime;
import java.util.HashMap;
import java.util.Map;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import com.example.demo.payment.entity.PaymentEntity;
import com.example.demo.payment.repository.PaymentRepository;
import com.example.demo.payment.service.AdminPaymentService;

@Service
public class AdminPaymentServiceImpl implements AdminPaymentService {

    @Autowired
    private PaymentRepository paymentRepository;

    // 24.12.13 - uj
    // 판매 현황
    @Override
    public Map<String, Object> paymentStatus() {
        Map<String, Object> map = new HashMap<>();

        // 1. 결제 완료 건수
        long completedCount = paymentRepository.countByDeliveryStatus(PaymentEntity.DeliveryStatus.PAYMENT_COMPLETED);
        System.out.println("결제 완료 건수: " + completedCount);
        map.put("completedCount", completedCount);

        // 2. 오늘 하루 매출액
        LocalDateTime startOfDay = LocalDate.now().atStartOfDay(); // 오늘 00:00:00
        LocalDateTime endOfDay = LocalDate.now().atTime(LocalTime.MAX); // 오늘 23:59:59
        long todayPrice = paymentRepository.sumTotalPriceByPaymentDate(startOfDay, endOfDay);
        System.out.println("하루 매출액: " + todayPrice);
        map.put("todayPrice", todayPrice);

        // 3. 총 결제 금액
        long totalPrice = paymentRepository.sumTotalPrice();
        System.out.println("총 매출액: " + totalPrice);
        map.put("totalPrice", totalPrice);

        return map;
    }

    // 24.12.13 - 재영
    // 배송 현황
    @Override
    public Map<String, Object> deliveryStatus() {
        // TODO Auto-generated method stub
        throw new UnsupportedOperationException("Unimplemented method 'deliveryStatus'");
    }

}
