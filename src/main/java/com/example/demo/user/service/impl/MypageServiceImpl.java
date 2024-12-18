package com.example.demo.user.service.impl;

import java.time.LocalDateTime;
import java.time.YearMonth;
import java.util.ArrayList;
import java.util.List;
import java.util.stream.Collectors;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import com.example.demo.coupon.dto.CouponDTO;
import com.example.demo.coupon.entity.CouponEntity;
import com.example.demo.coupon.repository.UserCouponRepository;
import com.example.demo.ncp.dto.NCPObjectStorageDTO;
import com.example.demo.payment.dto.PaymentDTO;
import com.example.demo.payment.dto.PaymentDetailDTO;
import com.example.demo.payment.entity.PaymentDetailEntity;
import com.example.demo.payment.entity.PaymentEntity;
import com.example.demo.payment.repository.PaymentDetailRepository;
import com.example.demo.payment.repository.PaymentRepository;
import com.example.demo.store.dto.ProductDTO;
import com.example.demo.store.entity.ProductEntity;
import com.example.demo.store.repository.ProductRepository;
import com.example.demo.user.dto.UserDTO;
import com.example.demo.user.dto.WishDTO;
import com.example.demo.user.entity.UserEntity;
import com.example.demo.user.entity.WishEntity;
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
    private ProductRepository productRepository;

    @Autowired
    private PaymentRepository paymentRepository;

    @Autowired
    private PaymentDetailRepository paymentDetailRepository;

    @Autowired
    private UserCouponRepository userCouponRepository;

    // @Autowired
    // private AttendanceRepository attendanceRepository; // 출석

    // 마이페이지 사용자 정보 가져오기 - sumin
    @Override
    public UserDTO getUserInfo(int userId) {
        UserEntity userEntity = userRepository.findById(userId)
                                              .orElseThrow(() -> new RuntimeException("User not found"));

        // 현재 날짜를 기준으로 해당 월의 결제 금액을 계산
        LocalDateTime now = LocalDateTime.now();
        YearMonth yearMonth = YearMonth.from(now);
        LocalDateTime startDate = yearMonth.atDay(1).atStartOfDay();  // 해당 월의 첫날 00:00
        LocalDateTime endDate = yearMonth.atEndOfMonth().atTime(23, 59, 59);  // 해당 월의 마지막날 23:59
    
        // 해당 월에 해당하는 결제 금액 계산
        List<PaymentEntity> payments = paymentRepository.findByUserEntity_IdAndPaymentDateBetween(userId, startDate, endDate);
        int totalSpent = payments.stream()
                .mapToInt(payment -> (int) payment.getTotalPrice())
                .sum();
        System.out.println(totalSpent);

        // 등급 계산 로직 
        UserEntity.Grade grade;
        int nextLevelTarget;
        if (totalSpent >= 700000) {
            grade = UserEntity.Grade.LV5;
            nextLevelTarget = 0; // 최고 등급
        } else if (totalSpent >= 500000) {
            grade = UserEntity.Grade.LV4;
            nextLevelTarget = 700000 - totalSpent;
        } else if (totalSpent >= 300000) {
            grade = UserEntity.Grade.LV3;
            nextLevelTarget = 500000 - totalSpent;
        } else if (totalSpent >= 100000) {
            grade = UserEntity.Grade.LV2;
            nextLevelTarget = 300000 - totalSpent;
        } else {
            grade = UserEntity.Grade.LV1;
            nextLevelTarget = 100000 - totalSpent;
        }

        // UserDTO 변환
        UserDTO userDTO = UserDTO.toGetUserDTO(userEntity);
        userDTO.setTotalSpent(totalSpent);
        userDTO.setGrade(grade);
        userDTO.setNextLevelTarget(nextLevelTarget);

        System.out.println(userDTO.getTotalSpent());
        System.out.println(userDTO.getGrade());
        System.out.println(userDTO.getNextLevelTarget());

        // 쿠폰 정보 가져오기
        List<CouponDTO> userCoupons = userCouponRepository.findByUserEntity_Id(userId)
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


        userDTO.setCoupons(userCoupons); // 쿠폰 정보 설정

        System.out.println("쿠폰 : " + userDTO.getCoupons());
        System.out.println("누적 구매 금액: " + totalSpent);
        System.out.println("등급: " + grade);
        System.out.println("다음 등급까지 남은 금액: " + nextLevelTarget);
        return userDTO;
    }
    
    // 성별에따른 상품 추천 리스트 가져오기 - sumin
    @Override
    public List<ProductDTO> getProductList(int userId) {
        UserEntity userEntity = userRepository.findById(userId)
                .orElseThrow(() -> new RuntimeException("User not found"));

        String gender = userEntity.getGender(); // 사용자 성별 정보

        ProductEntity.Gender productGender;
        if ("M".equals(gender)) {
            productGender = ProductEntity.Gender.MAN; // 성별이 MAN인 경우
        } else if ("F".equals(gender)) {
            productGender = ProductEntity.Gender.WOMAN; // 성별이 WOMAN인 경우
        } else {
            productGender = ProductEntity.Gender.ALL; // 성별이 없거나 ALL인 경우
        }

        List<ProductEntity> productEntity;

        // 성별에 맞는 상품 목록을 가져오기 (삭제되지 않은 상품만 조회)
        if (productGender == ProductEntity.Gender.ALL) {
            productEntity = productRepository.findTop6ByGenderNotAndDeleteFalseOrderByIdDesc(ProductEntity.Gender.ALL); // 최신
                                                                                                                        // 상품
                                                                                                                        // 6개
        } else {
            productEntity = productRepository.findTop6ByGenderAndDeleteFalseOrderByIdDesc(productGender); // 성별에 맞는 최신
                                                                                                          // 상품 6개
        }

        // ProductEntity -> ProductDTO 변환
        List<ProductDTO> productDTOList = productEntity.stream()
                .map(ProductDTO::new) // ProductEntity를 ProductDTO로 변환
                .collect(Collectors.toList());

        return productDTOList;
    }

    // @Override
    // public List<CouponDTO> getCouponList(int userseq) {
    // List<CouponEntity> couponEntities = couponRepository.findByUserId(userseq);
    // if (couponEntities.isEmpty()) {
    // throw new RuntimeException("No coupons found for the user.");
    // }
    // // map 내부에서 명시적으로 변환 메서드를 호출
    // return couponEntities.stream()
    // .map(entity -> CouponDTO.toGetCouponDTO(entity))
    // .collect(Collectors.toList());
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

    @Transactional
    @Override
    public List<PaymentDTO> getOrders(int id) {
        List<PaymentEntity> orderEntities = paymentRepository.findByUserEntity_Id(id);
        List<PaymentDTO> list = new ArrayList<>();
        NCPObjectStorageDTO ncpDTO = new NCPObjectStorageDTO();
        if (orderEntities == null || orderEntities.isEmpty()) {
            throw new RuntimeException("해당 사용자에 대한 주문 내역이 존재하지 않습니다.");
        }

        for (PaymentEntity paymentEntity : orderEntities) {
            ProductEntity productEntity = paymentEntity.getPaymentDetailList().get(0).getProductEntity();
            PaymentDTO paymentDTO = PaymentDTO.toGetOrderDTO(paymentEntity);
            paymentDTO.setProductImg(ncpDTO.getURL() + productEntity.getImg());
            paymentDTO.setProductName(productEntity.getName());
            list.add(paymentDTO);
        }

        // PaymentEntity를 PaymentDTO로 변환
        return list;
    }

    //mypage order detail info 가지고 오기 - 12/17 강민
    @Transactional
    @Override
    public List<PaymentDTO> getOrderInfo(String tosscode) {
        List<PaymentEntity> orderEntities = paymentRepository.findByTossCode(tosscode);
        if (orderEntities == null || orderEntities.isEmpty()) {
            throw new RuntimeException("해당 사용자에 대한 주문 내역이 존재하지 않습니다.");
        }
        
        // PaymentEntity를 PaymentDTO로 변환
        return orderEntities.stream()
        .map(PaymentDTO::toGetOrderDTO)
        .collect(Collectors.toList());
    }

    //mypage order detail list 가지고 오기 - 12/17 강민
    @Transactional
    @Override
    public List<PaymentDetailDTO> getOrderDetails(int paymentId) {
        List<PaymentDetailEntity> orderDetailEntities = paymentDetailRepository.findByPaymentEntityId(paymentId);
        if (orderDetailEntities == null || orderDetailEntities.isEmpty()) {
            throw new RuntimeException("해당 사용자에 대한 주문 내역이 존재하지 않습니다.");
        }

        // PaymentEntity를 PaymentDTO로 변환
        List<PaymentDetailDTO> paymentDetailDTOList = new ArrayList<>();
        for (PaymentDetailEntity paymentDetailEntity : orderDetailEntities) {
            PaymentDetailDTO paymentDetailDTO = PaymentDetailDTO.toGetOrderDetailDTO(paymentDetailEntity);
            paymentDetailDTOList.add(paymentDetailDTO);
        }
        
        return paymentDetailDTOList;
    }

    
}