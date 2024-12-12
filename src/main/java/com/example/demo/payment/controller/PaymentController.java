package com.example.demo.payment.controller;

import java.util.Map;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import com.example.demo.payment.service.PaymentService;

import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;

@RestController
@RequestMapping("/api/user/payment")
public class PaymentController {
    @Autowired
    private PaymentService paymentService;

    // 24.12.11 - uj
    // Toss 결제 후, 테이블에 주문 내역 저장
    @PostMapping("")
    public ResponseEntity<?> savePaymentInfo(@RequestBody Map<String, Object> requestData) {
        paymentService.savePaymentInfo(requestData);
        return ResponseEntity.ok(null);
    }

}
