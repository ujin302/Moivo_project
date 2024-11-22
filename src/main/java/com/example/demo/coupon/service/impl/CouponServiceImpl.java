package com.example.demo.coupon.service.impl;

import com.example.demo.coupon.dto.CouponDTO;
import com.example.demo.coupon.dto.UserCouponDTO;
import com.example.demo.coupon.entity.CouponEntity;
import com.example.demo.coupon.entity.UserCouponEntity;
import com.example.demo.coupon.repository.CouponRepository;
import com.example.demo.coupon.repository.UserCouponRepository;
import com.example.demo.coupon.service.CouponService;
import com.example.demo.user.dto.UserDTO;
import com.example.demo.user.entity.UserEntity;

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

        @Override
        public List<UserCouponDTO> getUserCoupons(int userId) {
                List<UserCouponEntity> userCoupons = userCouponRepository.findByUserEntity_Id(userId);

                return userCoupons.stream().map(userCoupon -> {
                        CouponEntity coupon = userCoupon.getCouponEntity(); // 쿠폰 엔티티 가져오기
                        UserEntity user = userCoupon.getUserEntity(); // 사용자 엔티티 가져오기

                        return new UserCouponDTO(
                                        userCoupon.getId(),
                                        UserDTO.toGetUserDTO(user), // UserEntity를 UserDTO로 변환
                                        new CouponDTO( // CouponEntity를 CouponDTO로 변환
                                                        coupon.getId(),
                                                        coupon.getName(),
                                                        coupon.getGrade(),
                                                        coupon.getDiscountType(),
                                                        coupon.getDiscountValue(),
                                                        coupon.getMinOrderPrice(),
                                                        coupon.getActive()),
                                        userCoupon.getStartDate(),
                                        userCoupon.getEndDate(),
                                        userCoupon.getUsed());
                }).collect(Collectors.toList());
        }

}
