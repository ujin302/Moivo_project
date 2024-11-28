package com.example.demo.user.controller;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
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
    public ResponseEntity<?> printCart(@RequestParam(name = "userid") int userId) {
        try {
            Map<String, Object> cartInfo = cartService.printCart(userId);
    
            if (cartInfo == null || cartInfo.isEmpty()) {
                return ResponseEntity.status(HttpStatus.NO_CONTENT).build(); // 본문 없이 204 응답
            }
    
            return ResponseEntity.ok(cartInfo); // 200 응답과 함께 데이터 반환
        } catch (RuntimeException e) {
            return ResponseEntity.status(HttpStatus.BAD_REQUEST).build(); // 400 응답
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).build(); // 500 응답
        }
    }
    


    // 장바구니에서 상품 삭제   11.26 - yjy   (포스트맨 성공)
    @DeleteMapping("/delete/{id}")
    public ResponseEntity<?> deleteProduct(
            @PathVariable(name = "id") int productId,
            @RequestParam(name = "userid") int userId) {
        try {
            System.out.println("productId = " + productId);
            System.out.println("userId = " + userId);
    
            // 장바구니에서 삭제 요청 처리
            cartService.deleteProduct(productId, userId);
    
            // 성공적으로 삭제된 경우
            return ResponseEntity.ok().build();
        } catch (RuntimeException e) {
            // 리소스가 없거나 잘못된 요청일 때
            return ResponseEntity.status(HttpStatus.NOT_FOUND).build();
        } catch (Exception e) {
            // 기타 서버 오류
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).build();
        }
    }

    @PutMapping("/update/{cartId}")
    public ResponseEntity<Void> updateCartItem(
            @PathVariable(name = "cartId") int cartid, 
            @RequestBody Map<String, Object> updates) {
        
        // Authorization 헤더에서 "Bearer <token>" 추출
        System.out.println(cartid);
        System.out.println(updates);
            
        try {
            Integer count = (Integer) updates.get("count");
            String size = (String) updates.get("size");
            System.out.println("여기 와?");
            cartService.updateCartItem(cartid, count, size);
    
            return ResponseEntity.ok().build(); // 200 
        } catch (RuntimeException e) {
            return ResponseEntity.status(HttpStatus.BAD_REQUEST).build(); // 400 
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).build(); // 500 
        }
    }
}
