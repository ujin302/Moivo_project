package com.example.demo.coupon.repository;

import org.springframework.data.jpa.repository.JpaRepository;

import com.example.demo.coupon.entity.CouponEntity;
import com.example.demo.user.entity.UserEntity.Grade;

public interface CouponRepository extends JpaRepository<CouponEntity, Long> {
    public CouponEntity findByGrade(Grade currentGrade);

}
