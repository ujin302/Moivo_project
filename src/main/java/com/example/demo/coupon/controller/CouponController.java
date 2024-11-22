package com.example.demo.coupon.controller;

import com.example.demo.coupon.dto.UserCouponDTO;
import com.example.demo.coupon.service.CouponService;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/coupons")
public class CouponController {

    @Autowired
    private CouponService couponService;

    // 특정 사용자의 쿠폰 조회
    @GetMapping("/user/{id}")
    public List<UserCouponDTO> getUserCoupons(@PathVariable int id) {
        return couponService.getUserCoupons(id);
    }
}
