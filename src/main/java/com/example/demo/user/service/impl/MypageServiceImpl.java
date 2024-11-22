package com.example.demo.user.service.impl;

import java.util.ArrayList;
import java.util.List;
import java.util.Optional;
import java.util.stream.Collectors;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

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

    // @Autowired
    //private AttendanceRepository attendanceRepository; // 출석

    @Override
    public UserDTO getUserInfo(int userseq) {
        UserEntity userEntity = userRepository.findById(userseq)
                                              .orElseThrow(() -> new RuntimeException("User not found")); // Optional 처리
        
        return UserDTO.toGetUserDTO(userEntity);
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
    public List<WishDTO> getWishlist(int userseq) {
        List<WishEntity> wishEntities = wishRepository.findByUserEntity_Id(userseq);
        if (wishEntities.isEmpty()) {
            throw new RuntimeException("No wishlist items found for the user.");
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
