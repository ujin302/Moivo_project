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
                                        userCart.getCount());

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
                CartEntity cartEntity = cartRepository.findByUserEntity_Id(userId)
                                .orElseThrow(() -> new RuntimeException("사용자의 장바구니가 없습니다."));

                UserCartEntity userCartEntity = cartEntity.getUserCartList().stream()
                                .filter(userCart -> userCart.getProductEntity().getId() == productId)
                                .findFirst()
                                .orElseThrow(() -> new RuntimeException("해당 상품이 장바구니에 없습니다."));

                cartEntity.getUserCartList().remove(userCartEntity);
                userCartRepository.delete(userCartEntity);
        }

        // 장바구니 수정
        @Override
        public void updateCartItem(int cartid, Integer count, String size) {
        UserCartEntity userCartEntity = userCartRepository.findByCartEntity_Id(cartid)
                .orElseThrow(() -> new RuntimeException("해당 장바구니 항목을 찾을 수 없습니다."));
                System.out.println("여긴 안와??");
                System.out.println("cartid 찍어 " + cartid);
                System.out.println("count 찍어 " + count);
                System.out.println("size 찍어 " + size);
                // 수량 업데이트
                if (count != null) {
                        if (count <= 0) {
                        throw new RuntimeException("수량은 1 이상이어야 합니다.");
                        }
                        userCartEntity.setCount(count);
                        System.out.println("수량 업데이트 성공 !!!!!!!!!!!");
                }

                // 사이즈 업데이트
                if (size != null) {
                        try {
                                userCartEntity.setSize(Size.valueOf(size.toUpperCase())); // "S" -> Size.S
                                System.out.println("사이즈 업데이트 성공 !!!!!!!!!!!!");
                        } catch (IllegalArgumentException e) {
                                throw new RuntimeException("유효하지 않은 사이즈 값입니다: " + size);
                        }
                }

                // 변경 사항 저장
                userCartRepository.save(userCartEntity);
                System.out.println("업데이트 모두 성공 !!!!!!!!!!!");
        }
}