package com.example.demo.user.controller;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import com.example.demo.user.service.CartService;

import java.util.Map;

@RestController
@RequestMapping("/api/user/cart")
public class CartController {
    @Autowired
    private CartService cartService;

    // 장바구니에 상품 추가  11.26 - yjy    (포스트맨 성공)
    @PostMapping("/add/{productId}")
    public ResponseEntity<?> addProductCart(@PathVariable int productId,
                                            @RequestParam(name = "userid") int userId,
                                            @RequestParam(name = "count") int count,
                                            @RequestParam(name = "size") String size) {
        cartService.addProductCart(productId, userId, count, size);
        return ResponseEntity.ok(null);
    }

    //장바구니 출력 11.26 - yjy    (포스트맨 성공)
    @GetMapping("/list")   
    public ResponseEntity<?> printCart(@RequestParam(name = "userid") int userId) {  //userid는 유저 아이디 그 int형
        Map<String, Object> cartInfo = cartService.printCart(userId);
        return ResponseEntity.ok(cartInfo);
    }


    // 장바구니에서 상품 삭제   11.26 - yjy   (포스트맨 성공)
    @DeleteMapping("/delete/{productId}")
    public ResponseEntity<?> deleteProduct(
            @PathVariable int productId,
            @RequestParam(name = "userid") int userId) {

        cartService.deleteProduct(productId, userId);
        return ResponseEntity.ok(null);
    }
}