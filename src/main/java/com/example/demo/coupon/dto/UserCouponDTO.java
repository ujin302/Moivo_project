package com.example.demo.coupon.dto;

import java.time.LocalDateTime;

import com.example.demo.user.dto.UserDTO;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@NoArgsConstructor
@AllArgsConstructor
public class UserCouponDTO {

    private Integer id; // 사용자 쿠폰 고유 ID
    private UserDTO user; // 사용자 정보
    private CouponDTO coupon; // 쿠폰 정보
    private LocalDateTime startDate; // 쿠폰 발급 시작 일자
    private LocalDateTime endDate; // 쿠폰 발급 종료 일자
    private Boolean used; // 쿠폰 사용 여부
}