package com.example.demo.user.service;

import com.example.demo.user.dto.UserCartDTO;

import java.util.Map;

public interface CartService {

    // 장바구니에 상품 추가
    public boolean addProductCart(int productId, int userId, int count, String size);

    // 장바구니 출력
    public Map<String, Object> printCart(int userId);

    // 장바구니에서 상품 삭제
    public void deleteProduct(int userCartId, int userId);

    public UserCartDTO updateCartItem(int userCartId, Integer count, String size);
}