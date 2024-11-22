package com.example.demo.coupon.service;


import java.util.List;

import com.example.demo.coupon.dto.UserCouponDTO;

public interface CouponService {
    List<UserCouponDTO> getUserCoupons(int userId);
}
