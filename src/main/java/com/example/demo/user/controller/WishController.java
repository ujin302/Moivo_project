package com.example.demo.user.controller;

import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;

import com.example.demo.store.entity.ProductEntity;
import com.example.demo.user.dto.WishDTO;
import com.example.demo.user.service.WishService;

import java.util.List;
import java.util.Map;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.DeleteMapping;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;

@RestController
@RequestMapping("/api/user/wish")
public class WishController {

    @Autowired
    private WishService wishService;

    // wish에 상품 추가
    @GetMapping("/{productId}")
    public ResponseEntity<?> addProduct(@PathVariable int productId, @RequestParam(name = "userid") int userId) {
        wishService.addProduct(productId, userId);
        return ResponseEntity.ok(null);
    }

    // 찜한거 출력 - 24.11.25 - yjy
    @GetMapping("/list")
    public ResponseEntity<?> printWish(@RequestParam(name = "userid") int userId) {
        Map<String, Object> map = wishService.printWish(userId);
        
        return ResponseEntity.ok(map);

    }

    // 찜한거 삭제 - 24.11.25 - yjy
    @DeleteMapping("/delete/{productId}")
    public ResponseEntity<?> deleteProduct(@PathVariable(name = "productId") int productId,
            @RequestParam(name = "userid") int userId) {
                System.out.println("삭제할 productId: " + productId + ", userId: " + userId);
        wishService.deleteProduct(productId, userId);

        return ResponseEntity.ok("찜 목록에서 삭제되었습니다.");
    }

}