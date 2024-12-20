package com.example.demo.coupon.service.impl;

import java.time.LocalDateTime;
import java.util.List;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import com.example.demo.coupon.entity.CouponEntity;
import com.example.demo.coupon.entity.UserCouponEntity;
import com.example.demo.coupon.repository.CouponRepository;
import com.example.demo.coupon.repository.UserCouponRepository;
import com.example.demo.coupon.service.UserCouponService;

import jakarta.transaction.Transactional;

@Transactional
@Service
public class UserCouponServiceImpl implements UserCouponService {
    @Autowired
    private UserCouponRepository userCouponRepository;

    @Autowired
    private CouponRepository couponRepository;

    // 사용자의 쿠폰을 업데이트하거나 새로 발급하는 메서드
    @Override
    public void updateCouponByUserAndGrade(int userId, String grade) {
        System.out.println("쿠폰 업데이트 시작 - userId: " + userId + ", grade: " + grade);
        // userId: 사용자 PK, grade: 변경한 등급

        // 1. 쿠폰 등급에 해당하는 쿠폰 조회
        CouponEntity coupon = couponRepository.findByGrade(grade)
                .orElseThrow(() -> new RuntimeException("해당 등급의 쿠폰을 찾을 수 없습니다."));

        // 2. 기존에 해당 사용자가 보유한 쿠폰을 조회
        List<UserCouponEntity> userCoupons = userCouponRepository.findByUserEntity_Id(userId);

        // 3. 동일 등급의 쿠폰이 이미 있는지 확인
        UserCouponEntity existingCoupon = userCoupons.stream()
                .filter(uc -> uc.getCouponEntity().getGrade().equals(grade))
                .findFirst()
                .orElse(null);

        // 3-1. 동일 등급의 쿠폰이 이미 있는 경우
        if (existingCoupon != null) {
            if (!existingCoupon.getUsed()) {
                // 사용 가능한 쿠폰이 이미 존재한다면 처리 종료
                System.out.println("사용 가능한 쿠폰이 이미 존재합니다. 추가 작업이 필요 없습니다.");
                return; // 추가 작업 없이 종료
            }

            // 쿠폰이 사용된 상태라면 사용 여부를 초기화
            existingCoupon.setUsed(false);
            userCouponRepository.save(existingCoupon);
            System.out.println("기존 쿠폰의 사용 상태를 초기화했습니다.");
            return; // 추가 작업 없이 종료
        }

        // 5. 기존 쿠폰이 다른 등급이라면 삭제
        // userCoupons.forEach(userCoupon -> {
        // if (!userCoupon.getCouponEntity().getGrade().equals(grade)) {
        // // userCouponRepository.delete(userCoupon);

        // System.out.println("기존 쿠폰(" + userCoupon.getCouponEntity().getGrade() + ")을
        // 삭제했습니다.");
        // }
        // });

        // 4. 기존 쿠폰이 다른 등급이라면 쿠폰 변경
        for (UserCouponEntity userCoupon : userCoupons) {
            if (!userCoupon.getCouponEntity().getGrade().equals(grade)) {
                // 현재 달의 첫날 00:00:00
                userCoupon.setStartDate(LocalDateTime.now()
                        .withDayOfMonth(1) // 현재 달의 첫날
                        .withHour(0) // 0시
                        .withMinute(0) // 0분
                        .withSecond(0) // 0초
                        .withNano(0)); // 0 나노초

                // 현재 달의 마지막 날 00:00:00
                userCoupon.setEndDate(LocalDateTime.now()
                        .withDayOfMonth(1) // 현재 달의 첫날
                        .plusMonths(1) // 다음 달
                        .minusDays(1) // 하루 전 (현재 달의 마지막 날)
                        .withHour(0) // 0시
                        .withMinute(0) // 0분
                        .withSecond(0) // 0초
                        .withNano(0)); // 0 나노초

                userCoupon.setUsed(false); // 기본값: 미사용
                userCoupon.setCouponEntity(coupon); // 등급에 따른 쿠폰 변경
                userCouponRepository.save(userCoupon);
                System.out.println("새 쿠폰(" + coupon.getGrade() + ")이 발급되었습니다.");
            }
        }

    }
}
