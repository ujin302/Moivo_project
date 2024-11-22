package com.example.demo.payment.repository;

import java.util.List;
import java.util.Optional;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import com.example.demo.payment.entity.PaymentEntity;
import com.example.demo.user.entity.WishEntity;

@Repository
public interface PaymentRepository extends JpaRepository<PaymentEntity, Integer> {
    // 특정 User의 Wish를 조회
    List<PaymentEntity> findByUserEntity_Id(Integer userId);

}
