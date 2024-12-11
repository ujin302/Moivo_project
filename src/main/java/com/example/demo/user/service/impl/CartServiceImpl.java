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
import java.util.stream.Collectors;

import jakarta.transaction.Transactional;

import java.util.ArrayList;
import java.util.HashMap;
import java.util.List;
import java.util.Map;


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
    
        // 입력된 사이즈를 Enum으로 변환
        ProductStockEntity.Size sizeEnum = ProductStockEntity.Size.valueOf(size.toUpperCase());
    
        // 재고 확인
        ProductStockEntity stockEntity = productStockRepository.findByProductEntityAndSize(productEntity, sizeEnum);
        if (stockEntity == null || stockEntity.getCount() < count) {
            throw new RuntimeException("해당 사이즈의 재고가 부족합니다.");
        }
    
        // 장바구니에 추가
        UserCartEntity userCartEntity = new UserCartEntity();
        userCartEntity.setCartEntity(cartEntity);
        userCartEntity.setProductEntity(productEntity);
        userCartEntity.setCount(count);
        userCartEntity.setSize(sizeEnum);
    
        userCartEntity = userCartRepository.save(userCartEntity);
    
        // 재고 수량 계산
        int stockCount = 0;
        for (ProductStockEntity stock : productEntity.getStockList()) {
            if (stock.getSize().equals(sizeEnum)) {
                stockCount = stock.getCount();
                break;
            }
        }
    
        // DTO 반환
        ProductDTO productDTO = ProductDTO.toGetProductDTO(productEntity);
        return new UserCartDTO(
                userCartEntity.getId(),
                cartEntity.getId(),
                productDTO,
                sizeEnum.name(),
                count,
                stockCount,
                stockCount <= 0 // 품절 여부
        );
    }

    @Override
    public Map<String, Object> printCart(int userId) {
        System.out.println("CartService - printCart 호출됨. userId: " + userId);
        
        Map<String, Object> cartMap = new HashMap<>();
        
        try {
            // 사용자의 장바구니 조회
            CartEntity cartEntity = cartRepository.findByUserEntity_Id(userId)
                    .orElseThrow(() -> new RuntimeException("사용자의 장바구니가 없습니다."));
            
            System.out.println("CartEntity 조회됨: " + cartEntity.getId());
            
            // 장바구니에 담긴 상품 목록 조회
            List<UserCartEntity> userCartList = cartEntity.getUserCartList();
            System.out.println("장바구니 상품 수: " + userCartList.size());
            
            List<UserCartDTO> cartList = userCartList.stream()
                .map(userCart -> {
                    ProductEntity product = userCart.getProductEntity();
                    ProductDTO productDTO = ProductDTO.toGetProductDTO(product);
                    
                    // 재고 확인
                    ProductStockEntity stock = productStockRepository.findByProductEntityAndSize(
                        product, 
                        userCart.getSize()
                    );
                    
                    int stockCount = (stock != null) ? stock.getCount() : 0;
                    
                    return new UserCartDTO(
                        userCart.getId(),
                        cartEntity.getId(),
                        productDTO,
                        userCart.getSize().name(),
                        userCart.getCount(),
                        stockCount,
                        stockCount <= 0
                    );
                })
                .collect(Collectors.toList());
            
            cartMap.put("cartItems", cartList);
            cartMap.put("totalItems", cartList.size());
            
            System.out.println("반환되는 장바구니 아이템 수: " + cartList.size());
            
        } catch (Exception e) {
            System.err.println("장바구니 조회 중 에러 발생: " + e.getMessage());
            e.printStackTrace();
            throw new RuntimeException("장바구니 조회 중 오류가 발생했습니다.", e);
        }
        
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

    // 장바구니 상품 업데이트 11.28 sumin
    @Override
    public UserCartDTO updateCartItem(int userCartId, Integer count, String size) {
        // 장바구니 항목 확인
        UserCartEntity userCartEntity = userCartRepository.findById(userCartId)
                .orElseThrow(() -> new RuntimeException("해당 장바구니 항목이 없습니다."));
    
        // 사이즈 업데이트
        if (size != null) {
            ProductStockEntity.Size sizeEnum = ProductStockEntity.Size.valueOf(size.toUpperCase());
            ProductStockEntity stockEntity = productStockRepository.findByProductEntityAndSize(
                    userCartEntity.getProductEntity(), sizeEnum);
    
            if (stockEntity == null || stockEntity.getCount() < (count != null ? count : userCartEntity.getCount())) {
                throw new RuntimeException("해당 사이즈의 재고가 부족합니다.");
            }
            userCartEntity.setSize(sizeEnum);
        }
    
        // 수량 업데이트
        if (count != null) {
            if (userCartEntity.getSize() != null) {
                ProductStockEntity stockEntity = productStockRepository.findByProductEntityAndSize(
                        userCartEntity.getProductEntity(), userCartEntity.getSize());
                if (stockEntity.getCount() < count) {
                    throw new RuntimeException("재고가 부족합니다.");
                }
            }
            userCartEntity.setCount(count);
        }
    
        // 업데이트된 데이터 저장
        userCartRepository.save(userCartEntity);
    
        // 재고 수량 계산
        int stockCount = 0;
        for (ProductStockEntity stock : userCartEntity.getProductEntity().getStockList()) {
            if (stock.getSize().equals(userCartEntity.getSize())) {
                stockCount = stock.getCount();
                break;
            }
        }
    
        // DTO 생성
        ProductDTO productDTO = ProductDTO.toGetProductDTO(userCartEntity.getProductEntity());
        return new UserCartDTO(
                userCartEntity.getId(),
                userCartEntity.getCartEntity().getId(),
                productDTO,
                userCartEntity.getSize().name(),
                userCartEntity.getCount(),
                stockCount,
                stockCount <= 0 // 품절 여부
        );
    }
}