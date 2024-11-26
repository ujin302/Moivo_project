package com.example.demo.coupon.controller;

import com.example.demo.coupon.dto.CouponDTO;
import com.example.demo.coupon.service.CouponService;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/user/coupon")
public class CouponController {

    @Autowired
    private CouponService couponService;

    // 특정 사용자의 쿠폰 조회
    @GetMapping("/{id}")
    public ResponseEntity<List<CouponDTO>> getUserCoupons(@PathVariable("id") int id) {
        System.out.println(id);
        List<CouponDTO> coupons = couponService.getUserCoupons(id);
        if (coupons.isEmpty()) {
            // 사용자가 쿠폰이 없는 경우 204 상태 코드 반환
            return ResponseEntity.noContent().build();
        }
        // 쿠폰이 있는 경우 200 상태 코드와 데이터를 반환
        return ResponseEntity.ok(coupons);
}

}
