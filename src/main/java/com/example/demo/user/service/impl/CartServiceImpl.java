package com.example.demo.user.service.impl;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import com.example.demo.store.dto.ProductDTO;
import com.example.demo.store.entity.ProductEntity;
import com.example.demo.store.entity.ProductStockEntity;
import com.example.demo.store.repository.ProductRepository;
import com.example.demo.store.repository.ProductStockRepository;
import com.example.demo.user.dto.UserCartDTO;
import com.example.demo.user.entity.CartEntity;
import com.example.demo.user.entity.UserCartEntity;
import com.example.demo.user.repository.CartRepository;
import com.example.demo.user.repository.UserCartRepository;
import com.example.demo.user.service.CartService;
import com.example.demo.user.entity.Size;


import jakarta.transaction.Transactional;

import java.util.ArrayList;
import java.util.HashMap;
import java.util.List;
import java.util.Map;
import java.util.stream.Collectors;

@Service
@Transactional
public class CartServiceImpl implements CartService {

    @Autowired
    private CartRepository cartRepository;

    @Autowired
    private UserCartRepository userCartRepository;

    @Autowired
    private ProductRepository productRepository;

    @Autowired
    private ProductStockRepository productStockRepository;

    // 장바구니에 상품 추가
    @Override
    public UserCartDTO addProductCart(int productId, int userId, int count, String size) {
        // 사용자 장바구니 가져오기
        CartEntity cartEntity = cartRepository.findByUserEntity_Id(userId)
                .orElseThrow(() -> new RuntimeException("사용자의 장바구니가 없습니다."));

        // 상품 정보 가져오기
        ProductEntity productEntity = productRepository.findById(productId)
                .orElseThrow(() -> new RuntimeException("해당 상품이 없습니다."));

        // 입력된 사이즈를 `ProductStockEntity.Size`로 변환
        ProductStockEntity.Size sizeEnum;
        try {
            sizeEnum = ProductStockEntity.Size.valueOf(size.toUpperCase());
        } catch (IllegalArgumentException e) {
            throw new RuntimeException("유효하지 않은 사이즈 값입니다: " + size);
        }

        // 상품 재고 확인
        ProductStockEntity stockEntity = productStockRepository.findByProductEntityAndSize(productEntity, sizeEnum);
        if (stockEntity == null || stockEntity.getCount() < count) {
            throw new RuntimeException("해당 사이즈의 재고가 부족합니다.");
        }

        // 장바구니에 추가
        UserCartEntity userCartEntity = new UserCartEntity();
        userCartEntity.setCartEntity(cartEntity);
        userCartEntity.setProductEntity(productEntity);
        userCartEntity.setCount(count);
        userCartEntity.setSize(sizeEnum); // Enum 값으로 설정

        // 저장
        userCartEntity = userCartRepository.save(userCartEntity);

        // DTO 반환
        ProductDTO productDTO = ProductDTO.toGetProductDTO(productEntity);
        return new UserCartDTO(
                userCartEntity.getId(),
                cartEntity.getId(),
                productDTO,
                sizeEnum.name(), // Enum -> String 변환
                count,
                stockEntity.getCount() // 남은 재고 수량
        );
    }

    // 장바구니 출력
    @Override
    public Map<String, Object> printCart(int userId) {
        // 사용자 장바구니 가져오기
        CartEntity cartEntity = cartRepository.findByUserEntity_Id(userId)
                .orElseThrow(() -> new RuntimeException("사용자의 장바구니가 없습니다."));

        // 장바구니 상품 목록 가져오기
        List<UserCartEntity> userCartEntities = userCartRepository.findByCartEntity_Id(cartEntity.getId());

        // DTO 리스트 생성
        List<UserCartDTO> cartList = new ArrayList<>();
        for (UserCartEntity userCart : userCartEntities) {
            ProductDTO productDTO = ProductDTO.toGetProductDTO(userCart.getProductEntity());

            // 상품 재고 확인
            ProductStockEntity stockEntity = productStockRepository.findByProductEntityAndSize(
                    userCart.getProductEntity(),
                    userCart.getSize()
            );
            int stockCount = (stockEntity != null) ? stockEntity.getCount() : 0;

            // DTO 생성
            UserCartDTO userCartDTO = new UserCartDTO(
                    userCart.getId(),
                    cartEntity.getId(),
                    productDTO,
                    userCart.getSize().name(), // Enum -> String 변환
                    userCart.getCount(),
                    stockCount
            );

            cartList.add(userCartDTO);
        }

        // 결과 맵 반환
        Map<String, Object> cartMap = new HashMap<>();
        cartMap.put("cartItems", cartList);
        cartMap.put("totalItems", cartList.size());
        return cartMap;
    }

    // 장바구니에서 상품 삭제
    @Override
    public void deleteProduct(int productId, int userId) {
        CartEntity cartEntity = cartRepository.findByUserEntity_Id(userId)
                .orElseThrow(() -> new RuntimeException("사용자의 장바구니가 없습니다."));

        UserCartEntity userCartEntity = cartEntity.getUserCartList().stream()
                .filter(userCart -> userCart.getProductEntity().getId() == productId)
                .findFirst()
                .orElseThrow(() -> new RuntimeException("해당 상품이 장바구니에 없습니다."));

        // 삭제 처리
        cartEntity.getUserCartList().remove(userCartEntity);
        userCartRepository.delete(userCartEntity);
    }
}
