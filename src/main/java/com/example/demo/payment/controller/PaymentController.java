package com.example.demo.payment.controller;

import java.util.List;
import java.util.Map;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import com.example.demo.payment.dto.PaymentDTO;
import com.example.demo.payment.dto.PaymentDetailDTO;
import com.example.demo.payment.service.PaymentService;
import com.fasterxml.jackson.core.type.TypeReference;
import com.fasterxml.jackson.databind.ObjectMapper;

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
        System.out.println(requestData);
        ObjectMapper objectMapper = new ObjectMapper();
        try {
            // 1. Json 데이터 추출
            // params 맵 추출
            Map<String, Object> params = (Map<String, Object>) requestData.get("params");

            // 2. 결제 데이터 저장
            paymentService.savePaymentInfo(params);

            return ResponseEntity.ok(null);
        } catch (Exception e) {
            e.printStackTrace();
            return ResponseEntity.badRequest().body("데이터 처리 중 오류가 발생했습니다.");
        }

    }

}
