package com.example.demo.user.controller;

import java.util.List;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.stereotype.Controller;
import org.springframework.web.bind.annotation.RequestMapping;

import com.example.demo.user.dto.CartDTO;
import com.example.demo.user.dto.UserDTO;
import com.example.demo.user.dto.WishDTO;
import com.example.demo.user.service.MypageService;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;

@Controller
@RequestMapping("/api/mypage")
public class MypageController {

    @Autowired
    private MypageService mypageService;

    // 회원 정보
    @GetMapping("/info/{userseq}")
    public ResponseEntity<UserDTO> getUserInfo(@PathVariable int userseq) {
        UserDTO userInfo = mypageService.getUserInfo(userseq);

        return ResponseEntity.ok(userInfo);
    }

    // // 쿠폰 정보 조회
    // @GetMapping("/coupons/{userSeq}")
    // public ResponseEntity<List<CouponDTO>> getCoupons(@PathVariable int userSeq) {
    //     List<CouponDTO> coupons = mypageService.getCoupons(userSeq);
    //     return ResponseEntity.ok(coupons);
        
    // }

    // 위시리스트 조회
    @GetMapping("/wishlist/{userSeq}")
    public ResponseEntity<List<WishDTO>> getWishlist(@PathVariable int userSeq) {

            List<WishDTO> wishlist = mypageService.getWishlist(userSeq);
            return ResponseEntity.ok(wishlist);
        
    }
/*
    // 주문 내역 조회
    @GetMapping("/orders/{userSeq}")
    public ResponseEntity<List<OrderDTO>> getOrders(@PathVariable int userSeq) {
        try {
            List<OrderDTO> orders = mypageService.getOrders(userSeq);
            return ResponseEntity.ok(orders);
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body(null);
        }
    }

    // 주문 상세 조회
    @GetMapping("/orders/details/{orderId}")
    public ResponseEntity<OrderDTO> getOrderDetails(@PathVariable int orderId) {
        try {
            OrderDTO orderDetails = mypageService.getOrderDetails(orderId);
            return ResponseEntity.ok(orderDetails);
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body(null);
        }
    }
 */



    // 주문내역 조회
    // 주문 내역 상세 조회
    // 회원정보 수정
    // 회원 탈퇴
    // 출석
    // 찜
}
