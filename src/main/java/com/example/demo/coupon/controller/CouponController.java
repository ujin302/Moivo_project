package com.example.demo.coupon.controller;

import com.example.demo.coupon.dto.CouponDTO;
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

    // 쿠폰 목록 조회
    @GetMapping
    public List<CouponDTO> getAllCoupons() {
        return couponService.getAllCoupons();
    }

    // 쿠폰 ID로 조회
    @GetMapping("/{id}")
    public CouponDTO getCouponById(@PathVariable Long id) {
        return couponService.getCouponById(id);
    }

    // 특정 사용자의 쿠폰 조회
    @GetMapping("/user/{userid}")
    public List<UserCouponDTO> getUserCoupons(@PathVariable int userid) {
        return couponService.getUserCoupons(userid);
    }
}
