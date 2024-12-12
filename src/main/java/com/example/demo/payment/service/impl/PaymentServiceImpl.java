package com.example.demo.payment.service.impl;

import java.util.ArrayList;
import java.util.List;
import java.util.Map;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import com.example.demo.payment.dto.PaymentDTO;
import com.example.demo.payment.dto.PaymentDetailDTO;
import com.example.demo.payment.entity.PaymentDetailEntity;
import com.example.demo.payment.entity.PaymentEntity;
import com.example.demo.payment.repository.PaymentDetailRepository;
import com.example.demo.payment.repository.PaymentRepository;
import com.example.demo.payment.service.PaymentService;
import com.example.demo.user.entity.UserCartEntity;
import com.example.demo.user.entity.UserEntity;
import com.example.demo.user.repository.UserCartRepository;
import com.example.demo.user.repository.UserRepository;
import com.fasterxml.jackson.core.type.TypeReference;
import com.fasterxml.jackson.databind.ObjectMapper;

@Service
public class PaymentServiceImpl implements PaymentService {

    @Autowired
    private PaymentRepository paymentRepository;

    @Autowired
    private PaymentDetailRepository detailRepository;

    @Autowired
    private UserRepository userRepository;

    @Autowired
    private UserCartRepository cartRepository;

    // 24.12.12 - uj
    // 결제 정보 저장
    @Override
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

        // 1. payment 저장
        UserEntity userEntity = userRepository.findById(paymentDTO.getUserId()).orElseThrow();
        paymentDTO.setCount(detailDTOList.size());
        PaymentEntity paymentEntity = paymentRepository.save(PaymentEntity.toSavePaymentEntity(paymentDTO,
                userEntity));

        // 2. paymentDetail 저장 & 장바구니에서 아이템 삭제
        for (PaymentDetailDTO detailDTO : detailDTOList) {
            // 2-1. paymentDetail 저장
            PaymentDetailEntity detailEntity = PaymentDetailEntity.toSavePaymentEntity(detailDTO, paymentEntity);
            detailRepository.save(detailEntity);

            // 2-2. 장바구니에서 아이템 삭제
            if (isCartItem) {
                UserCartEntity cartEntity = cartRepository.findById(detailDTO.getUsercartId()).orElseThrow();
                cartRepository.delete(cartEntity);
            }
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
