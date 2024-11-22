package com.example.demo.coupon.service.impl;

import com.example.demo.coupon.dto.CouponDTO;
import com.example.demo.coupon.dto.UserCouponDTO;
import com.example.demo.coupon.entity.CouponEntity;
import com.example.demo.coupon.entity.UserCouponEntity;
import com.example.demo.coupon.repository.CouponRepository;
import com.example.demo.coupon.repository.UserCouponRepository;
import com.example.demo.coupon.service.CouponService;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.stream.Collectors;

@Service
public class CouponServiceImpl implements CouponService {

    @Autowired
    private CouponRepository couponRepository;

    @Autowired
    private UserCouponRepository userCouponRepository;

    // 특정 사용자의 쿠폰을 조회하는 메서드
    @Override
    public List<UserCouponDTO> getUserCoupons(int userId) {
        List<UserCouponEntity> userCoupons = userCouponRepository.findByUserEntityId(userId);

        return userCoupons.stream().map(userCoupon -> {
            CouponEntity coupon = userCoupon.getCouponEntity();
            return new UserCouponDTO(
                    userCoupon.getId(),  
                    userCoupon.getUserEntity().getId(),  
                    coupon.getId(),  
                    userCoupon.getStartDate(),
                    userCoupon.getEndDate(),
                    userCoupon.getUsed()
            );
        }).collect(Collectors.toList());
    }

    // 모든 쿠폰 정보를 가져옴
    @Override
    public List<CouponDTO> getAllCoupons() {
        return couponRepository.findAll().stream() // 모든 쿠폰 가져오기
                .map(coupon -> new CouponDTO(
                        coupon.getId(),  
                        coupon.getName(),
                        coupon.getGrade(),
                        coupon.getDiscountType(),
                        coupon.getDiscountValue(),
                        coupon.getMinOrderPrice(),
                        coupon.getActive()
                ))
                .collect(Collectors.toList()); // 변환된 DTO를 List에 담아서 반환
    }

        // 특정 쿠폰 정보를 id로 가져오기
        @Override
        public CouponDTO getCouponById(Long id) {  // id를 Long 타입으로 변경
        CouponEntity coupon = couponRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Coupon not found"));

        return new CouponDTO(
                coupon.getId(),  // ID는 Integer로 유지
                coupon.getName(),
                coupon.getGrade(),
                coupon.getDiscountType(),
                coupon.getDiscountValue(),
                coupon.getMinOrderPrice(),
                coupon.getActive()
        );
        }
}
