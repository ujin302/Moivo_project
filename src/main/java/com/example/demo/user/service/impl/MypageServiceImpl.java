package com.example.demo.user.service.impl;

import java.util.ArrayList;
import java.util.List;
import java.util.Optional;
import java.util.stream.Collectors;

import org.aspectj.internal.lang.annotation.ajcDeclareAnnotation;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import com.example.demo.coupon.dto.CouponDTO;
import com.example.demo.coupon.entity.CouponEntity;
import com.example.demo.coupon.repository.UserCouponRepository;
import com.example.demo.user.dto.UserDTO;
import com.example.demo.user.dto.WishDTO;
import com.example.demo.user.entity.UserEntity;
import com.example.demo.user.entity.WishEntity;
import com.example.demo.user.repository.AttendanceRepository;
import com.example.demo.user.repository.UserRepository;
import com.example.demo.user.repository.WishRepository;
import com.example.demo.user.service.MypageService;

@Service
public class MypageServiceImpl implements MypageService {
    @Autowired
    private UserRepository userRepository; // 사용자
    // @Autowired
    // private CouponRepository couponRepository;
    @Autowired
    private WishRepository wishRepository;

    @Autowired
    private UserCouponRepository userCouponRepository;
    
    // @Autowired
    //private AttendanceRepository attendanceRepository; // 출석

    @Override
    public UserDTO getUserInfo(int id) { 
        UserEntity userEntity = userRepository.findById(id);
        if (userEntity == null) {
            throw new RuntimeException("User not found");
        }
                                              
        /*
    // 쿠폰 정보 가져오기
        List<CouponDTO> userCoupons = userCouponRepository.findByUserEntity_Id(id)
            .stream()
            .map(userCoupon -> {
                CouponEntity coupon = userCoupon.getCouponEntity();
                return new CouponDTO(
                    coupon.getId(),
                    coupon.getName(),
                    coupon.getGrade(),
                    coupon.getDiscountType(),
                    coupon.getDiscountValue(),
                    coupon.getMinOrderPrice(),
                    coupon.getActive()
                );
            })
            .collect(Collectors.toList());
 */
        // UserDTO로 변환
        UserDTO userDTO = UserEntity.toGetUserDTO(userEntity);
        //userDTO.setCoupons(userCoupons); // 쿠폰 정보 설정

        return userDTO;
    }

    // @Override
    // public List<CouponDTO> getCouponList(int userseq) {
    //     List<CouponEntity> couponEntities = couponRepository.findByUserId(userseq);
    //     if (couponEntities.isEmpty()) {
    //         throw new RuntimeException("No coupons found for the user.");
    //     }
    //     // map 내부에서 명시적으로 변환 메서드를 호출
    //     return couponEntities.stream()
    //                          .map(entity -> CouponDTO.toGetCouponDTO(entity))
    //                          .collect(Collectors.toList());
    // }

    @Override
    public List<WishDTO> getWishlist(int id) {
        List<WishEntity> wishEntities = wishRepository.findByUserEntity_Id(id);
        if (wishEntities.isEmpty()) {
            throw new RuntimeException("사용자의 위시리스트가 없습니다.");
        }

        // WishEntity -> WishDTO 변환
        List<WishDTO> wishDTOList = new ArrayList<>();
        for (WishEntity wishEntity : wishEntities) {
            WishDTO wishDTO = WishDTO.toGetWishDTO(wishEntity);
            wishDTOList.add(wishDTO);
        }
        return wishDTOList;
    }
}    
