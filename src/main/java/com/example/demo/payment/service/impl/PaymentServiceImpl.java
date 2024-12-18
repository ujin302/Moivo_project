package com.example.demo.payment.service.impl;

import java.util.List;
import java.util.Map;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import com.example.demo.coupon.entity.UserCouponEntity;
import com.example.demo.coupon.repository.UserCouponRepository;
import com.example.demo.payment.dto.PaymentDTO;
import com.example.demo.payment.dto.PaymentDetailDTO;
import com.example.demo.payment.entity.PaymentDetailEntity;
import com.example.demo.payment.entity.PaymentEntity;
import com.example.demo.payment.repository.PaymentDetailRepository;
import com.example.demo.payment.repository.PaymentRepository;
import com.example.demo.payment.service.PaymentService;
import com.example.demo.store.entity.ProductEntity;
import com.example.demo.store.entity.ProductStockEntity;
import com.example.demo.store.repository.ProductRepository;
import com.example.demo.user.entity.CartEntity;
import com.example.demo.user.entity.UserEntity;
import com.example.demo.user.repository.CartRepository;
import com.example.demo.user.repository.UserRepository;
import com.fasterxml.jackson.core.type.TypeReference;
import com.fasterxml.jackson.databind.ObjectMapper;

import jakarta.persistence.EntityManager;
import jakarta.persistence.PersistenceContext;

@Service
public class PaymentServiceImpl implements PaymentService {

    @PersistenceContext
    private EntityManager entityManager;

    @Autowired
    private PaymentRepository paymentRepository;

    @Autowired
    private PaymentDetailRepository detailRepository;

    @Autowired
    private UserRepository userRepository;

    @Autowired
    private CartRepository cartRepository;

    @Autowired
    private ProductRepository productRepository;

    @Autowired
    private UserCouponRepository userCouponRepository;

    // 24.12.12 - uj
    // 결제 정보 저장
    @Override
    @Transactional
    public void savePaymentInfo(Map<String, Object> map) {

        // 0. Data 추출
        // 0-1. Json -> PaymentDTO 변환
        System.out.println(map.get("payment"));
        PaymentDTO paymentDTO = convertToPaymentDTO(
                map.get("payment").toString(),
                map.get("tosscode").toString(),
                map.get("userId").toString());

        // 0-2. Json -> List<PaymentDetailDTO> 변환
        System.out.println(map.get("paymentDetail").toString());
        List<PaymentDetailDTO> detailDTOList = convertToPaymentDetailDTOList(map.get("paymentDetail").toString());

        // 0-3. Json -> isCartItem 변환
        Boolean isCartItem = Boolean.parseBoolean(map.get("isCartItem").toString());
        System.out.println("Json -> isCartItem: " + isCartItem);

        // 1, 필요한 Entity 추출
        UserEntity userEntity = userRepository.findById(paymentDTO.getUserId()).orElseThrow();
        CartEntity cartEntity = cartRepository.findByUserEntity_Id(userEntity.getId()).orElseThrow();

        // 2. payment 저장
        paymentDTO.setCount(detailDTOList.size());
        PaymentEntity paymentEntity = paymentRepository.save(PaymentEntity.toSavePaymentEntity(paymentDTO,
                userEntity));

        // 3. paymentDetail 저장 & 장바구니에서 아이템 삭제 & 재고 수정
        for (PaymentDetailDTO detailDTO : detailDTOList) {
            // 3-1. paymentDetail 저장
            ProductEntity productEntity = productRepository.findById(detailDTO.getProductId()).orElseThrow();
            PaymentDetailEntity detailEntity = PaymentDetailEntity.toSavePaymentEntity(
                    detailDTO,
                    paymentEntity,
                    productEntity);
            detailRepository.save(detailEntity);

            // 3-2. 재고 수정
            List<ProductStockEntity> stockEntiyList = productEntity.getStockList();
            for (ProductStockEntity stockEntity : stockEntiyList) {
                if (stockEntity.getSize() == detailDTO.getSize()) {
                    stockEntity.setCount(stockEntity.getCount() - detailDTO.getCount()); // 재고 수정
                }
            }
            // 3-3. 재고 DB 반영
            productRepository.save(productEntity);
        }

        // 4. 장바구니에서 상품 삭제
        if (isCartItem) {
            cartEntity.getUserCartList() // 상품 리스트 가져오기
                    // removeIf : True인 원소 제거
                    .removeIf(userCartEntity -> detailDTOList.stream() // Stream : 데이터 읽기만 함.
                            // List에서 원소가 제거되어도 끝까지 읽음.
                            // anyMatch(조건) : 조건에 해당하면 True
                            .anyMatch(detailDTO -> userCartEntity.getId() == detailDTO.getUsercartId()));
        }

        // 4-1. 장바구니 DB에 반영
        cartRepository.save(cartEntity);

        // 5. 쿠폰 사용 여부 저장
        if (paymentDTO.getDiscount() > 0) {
            List<UserCouponEntity> couponEntityList = userCouponRepository.findByUserEntity_Id(paymentDTO.getUserId());
            couponEntityList.get(0).setUsed(true);
            userCouponRepository.save(couponEntityList.get(0));
        }

    }

    // Json -> PaymentDTO
    public PaymentDTO convertToPaymentDTO(String json, String tossCode, String userId) {
        ObjectMapper objectMapper = new ObjectMapper();

        try {
            // JSON 문자열을 PaymentDTO로 변환
            PaymentDTO paymentDTO = objectMapper.readValue(json, PaymentDTO.class);

            paymentDTO.setTosscode(tossCode);
            paymentDTO.setUserId(Integer.parseInt(userId));

            // 결과 확인
            System.out.println("Json -> paymentDTO: " + paymentDTO);

            return paymentDTO; // 변환된 객체 반환
        } catch (Exception e) {
            e.printStackTrace();
            throw new RuntimeException("PaymentDTO 변환 중 오류 발생: ", e);
        }
    }

    // Json -> List<PaymentDetailDTO>
    public List<PaymentDetailDTO> convertToPaymentDetailDTOList(String paymentDetailJson) {
        ObjectMapper objectMapper = new ObjectMapper();

        try {
            // JSON 문자열을 List<PaymentDetailDTO>로 변환
            List<PaymentDetailDTO> paymentDetailList = objectMapper.readValue(
                    paymentDetailJson,
                    new TypeReference<List<PaymentDetailDTO>>() {
                    });

            // 결과 확인
            System.out.println(
                    "Json -> List<PaymentDetailDTO>: " + paymentDetailList + "\n Size: " + paymentDetailList.size());

            return paymentDetailList; // 변환된 리스트 반환
        } catch (Exception e) {
            e.printStackTrace();
            throw new RuntimeException("PaymentDetailDTO 변환 중 오류 발생", e);
        }
    }

}
