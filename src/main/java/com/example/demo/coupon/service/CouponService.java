package com.example.demo.coupon.service;


import java.util.List;

import com.example.demo.coupon.dto.CouponDTO;
import com.example.demo.coupon.dto.UserCouponDTO;

public interface CouponService {
    List<CouponDTO> getAllCoupons();
    CouponDTO getCouponById(Long id);
    List<UserCouponDTO> getUserCoupons(int userId);
}
