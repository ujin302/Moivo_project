package com.example.demo.user.controller;

import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;

import com.example.demo.user.service.WishService;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
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

}
