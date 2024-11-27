package com.example.demo.user.service.impl;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import com.example.demo.store.dto.ProductDTO;
import com.example.demo.store.entity.ProductEntity;
import com.example.demo.store.repository.ProductRepository;
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

    // 장바구니에 상품 추가  
    @Override
    public UserCartDTO addProductCart(int productId, int userId, int count, String size) {
        CartEntity cartEntity = cartRepository.findByUserEntity_Id(userId)
                .orElseThrow(() -> new RuntimeException("사용자의 장바구니가 없습니다."));

        ProductEntity productEntity = productRepository.findById(productId)
                .orElseThrow(() -> new RuntimeException("해당 상품이 없습니다."));

        UserCartEntity userCartEntity = new UserCartEntity();
        userCartEntity.setCartEntity(cartEntity);
        userCartEntity.setProductEntity(productEntity);
        userCartEntity.setCount(count);

        // 문자열 -> Enum 변환
        try {
            userCartEntity.setSize(Size.valueOf(size.toUpperCase())); // "S" -> Size.S
        } catch (IllegalArgumentException e) {
            throw new RuntimeException("유효하지 않은 사이즈 값입니다: " + size);
        }

        userCartEntity = userCartRepository.save(userCartEntity);
        return new UserCartDTO(userCartEntity.getId(), cartEntity.getId(), productId, size, count);
    
    }

    // 장바구니 출력 
    /*
    @Override
    public Map<String, Object> printCart(int userId) {
            // cartEntity 가져오기
            CartEntity cartEntity = cartRepository.findByUserEntity_Id(userId)
                            .orElseThrow(() -> new RuntimeException("사용자의 장바구니가 없습니다."));

            // userCartList 직접 가져오기
            List<UserCartEntity> userCartEntities = userCartRepository.findByCartEntity_Id(cartEntity.getId());
            // userCartEntities for문 돌리기
            // for문에서 수행해야 할 작업
            // 1. userCartEntity -> UserCartDTO 변환
            // 2. userCartEntity 안의 ProductEntity -> ProductDTO 변환
            // 3. ProductDTO 객체를 UserCartDTO 객체에 저장 (UserCartDTO 수정 필요)
            

            // for문 밖에서 작업
            // map에 for문 작업 후, 떨어지는 userCartDTO 리스트 저장

            

            // DTO로 변환
            List<UserCartDTO> cartList = userCartEntities.stream()
                            .map(userCart -> new UserCartDTO(
                                            userCart.getId(),
                                            cartEntity.getId(),
                                            userCart.getProductEntity().getId(),
                                            userCart.getSize().name(), // Enum -> String 변환
                                            userCart.getCount()))
                            .collect(Collectors.toList());

            // Map으로 데이터 반환
            Map<String, Object> cartMap = new HashMap<>();
            cartMap.put("cartItems", cartList);
            cartMap.put("totalItems", cartList.size());

            return cartMap;
    }  */

        @Override
        public Map<String, Object> printCart(int userId) {
        // cartEntity 가져오기
        CartEntity cartEntity = cartRepository.findByUserEntity_Id(userId)
                .orElseThrow(() -> new RuntimeException("사용자의 장바구니가 없습니다."));

        // userCartList 가져오기
        List<UserCartEntity> userCartEntities = userCartRepository.findByCartEntity_Id(cartEntity.getId());

        // UserCartDTO 리스트 생성
        List<UserCartDTO> cartList = new ArrayList<>();
        for (UserCartEntity userCart : userCartEntities) {
                // ProductEntity -> ProductDTO 변환
                ProductDTO productDTO = ProductDTO.toGetProductDTO(userCart.getProductEntity());
                
                // UserCartDTO 생성
                UserCartDTO userCartDTO = new UserCartDTO(
                        userCart.getId(),
                        cartEntity.getId(),
                        productDTO, // ProductDTO 객체 추가
                        userCart.getSize().name(), // Enum -> String 변환
                        userCart.getCount()
                );

                // 리스트에 추가
                cartList.add(userCartDTO);
        }

        // Map으로 데이터 반환
        Map<String, Object> cartMap = new HashMap<>();
        cartMap.put("cartItems", cartList); // 장바구니 아이템 리스트
        cartMap.put("totalItems", cartList.size()); // 장바구니 총 상품 개수

        return cartMap;
        }




    // 장바구니에서 상품 삭제 
    @Override
    public void deleteProduct(int productId, int userId) {
        System.out.println("userid = " + userId);
        System.out.println("productId = " + productId);
        CartEntity cartEntity = cartRepository.findByUserEntity_Id(userId)
                .orElseThrow(() -> new RuntimeException("사용자의 장바구니가 없습니다."));

        UserCartEntity userCartEntity = cartEntity.getUserCartList().stream()
                .filter(userCart -> userCart.getProductEntity().getId() == productId)
                .findFirst()
                .orElseThrow(() -> new RuntimeException("해당 상품이 장바구니에 없습니다."));

        cartEntity.getUserCartList().remove(userCartEntity);
        userCartRepository.delete(userCartEntity);
    }
}
