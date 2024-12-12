package com.example.demo.payment.repository;

import org.springframework.data.jpa.repository.JpaRepository;

import com.example.demo.payment.entity.PaymentDetailEntity;

public interface PaymentDetailRepository extends JpaRepository<PaymentDetailEntity, Integer> {

}
