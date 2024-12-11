package com.example.demo.payment.controller;

import java.util.HashMap;
import java.util.List;
import java.util.Map;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import com.example.demo.payment.dto.PaymentDTO;
import com.example.demo.payment.dto.PaymentDetailDTO;
import com.example.demo.payment.service.PaymentService;

import org.springframework.web.bind.annotation.ModelAttribute;
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
    public ResponseEntity<?> savePaymentInfo(
            @ModelAttribute PaymentDTO paymentDTO,
            @ModelAttribute List<PaymentDetailDTO> detailDTOList) {

        Map<String, Object> map = new HashMap<>();
        map.put("paymentDTO", paymentDTO);
        map.put("detailDTOList", detailDTOList);
        paymentService.savePaymentInfo(map);
        return ResponseEntity.ok(null);
    }

}
