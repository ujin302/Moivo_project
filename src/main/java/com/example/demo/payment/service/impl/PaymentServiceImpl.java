package com.example.demo.payment.service.impl;

import java.util.Map;

import org.springframework.stereotype.Service;

import com.example.demo.payment.service.PaymentService;

@Service
public class PaymentServiceImpl implements PaymentService {

    // 24.12.11 - uj
    @Override
    public void savePaymentInfo(Map<String, Object> map) {
        System.out.println("savePaymentInfo");
    }

}
