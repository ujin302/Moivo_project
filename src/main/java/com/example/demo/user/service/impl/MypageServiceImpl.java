package com.example.demo.user.service.impl;

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
    private UserCouponRepository userCouponRepository;

    // @Autowired
    // private AttendanceRepository attendanceRepository; // 출석

    @Autowired
    private PaymentRepository paymentRepository;

    @Autowired
    private PaymentDetailRepository paymentDetailRepository;

    // 마이페이지 사용자 정보 가져오기
    @Override
    public UserDTO getUserInfo(int id) {
        System.out.println("유저 아이디 = " + id);
        UserEntity userEntity = userRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("User not found")); // Optional 처리

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
                            coupon.getActive());
                })
                .collect(Collectors.toList());

        // UserDTO로 변환
        UserDTO userDTO = UserDTO.toGetUserDTO(userEntity);
        userDTO.setCoupons(userCoupons); // 쿠폰 정보 설정
        System.out.println("쿠폰 : " + userDTO.getCoupons());
        return userDTO;
    }

    // 성별에따른 상품 추천 리스트 가져오기
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