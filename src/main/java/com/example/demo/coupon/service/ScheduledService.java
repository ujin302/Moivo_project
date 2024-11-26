package com.example.demo.coupon.service;

import com.example.demo.user.dto.UserDTO;
import com.example.demo.user.service.UserService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.scheduling.annotation.Scheduled;
import org.springframework.stereotype.Service;

import java.time.LocalDateTime;
import java.util.List;

@Service
public class ScheduledService {

    @Autowired
    private UserService userService;

    @Autowired
    private UserCouponService userCouponService;

    // 매월 1일 0시 0분에 자동 실행
    @Scheduled(cron = "0 0 0 1 * ?")
    // 매 분마다 실행
    //@Scheduled(cron = "0 * * * * ?") // 매 분 0초에 실행
    public void issueCouponsToUsers() {
        System.out.println("스케줄러 실행됨: " + LocalDateTime.now()); // 실행 확인 로그
    
        // 모든 사용자 조회
        List<UserDTO> users = userService.findAllUsers();
        for (UserDTO user : users) {
            String grade = user.getGrade().name();
            // 사용자의 쿠폰을 업데이트하거나 새로 발급
            userCouponService.updateCouponByUserAndGrade(user.getId(), grade);
        }
    }

    /* 추후 결제 시스템 도입 후에 등급도 매월 반영으로 바꾸기
    매월 1일 0시 0분에 자동 실행
    @Scheduled(cron = "0 0 0 1 * ?")
    public void issueCouponsToUsers() {
        System.out.println("스케줄러 실행됨: " + LocalDateTime.now()); 
        // 1. 모든 사용자 조회
        List<UserDTO> users = userService.findAllUsers();

        for (UserDTO user : users) {
            // 2. 결제 금액에 따라 등급 업데이트
            userService.updateUserGradeBasedOnPurchase(user.getId());

            // 3. 업데이트된 등급에 따라 쿠폰 발급
            String updatedGrade = userService.findUserById(user.getId()).getGrade().name(); // 최신 등급 조회
            userCouponService.updateCouponByUserAndGrade(user.getId(), updatedGrade);
        }
    }
    */

    // 이 메서드를 직접 호출하여 바로 쿠폰 발급을 테스트할 수 있음
    public void issueCouponsImmediately() {
        List<UserDTO> users = userService.findAllUsers();

        for (UserDTO user : users) {
            // 해당 등급에 맞는 쿠폰을 발급
            userCouponService.updateCouponByUserAndGrade(user.getId(), user.getGrade().name());
        }
    }

    // 쿠폰 발급을 트리거하는 메서드를 추가
    public void triggerCouponIssueForUser(Integer userId) {
        System.out.println("오냐!?!?!??!??!!?");
        UserDTO user = userService.findUserById(userId);  // userId에 해당하는 유저 찾기
        System.out.println("user는 !!!" + user);
        userCouponService.updateCouponByUserAndGrade(user.getId(), user.getGrade().name());
    }
    
}
