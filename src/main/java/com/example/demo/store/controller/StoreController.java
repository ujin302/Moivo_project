package com.example.demo.store.controller;

import java.util.Map;

import org.apache.http.HttpStatus;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.domain.Pageable;
import org.springframework.data.domain.Sort;
import org.springframework.data.web.PageableDefault;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;

import com.example.demo.store.service.ProductService;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;

@RestController
@RequestMapping("/api/user/store")

public class StoreController {

    @Autowired
    private ProductService productService;

    // 상품 페이징 처리
    // 상품 검색
    // 상품 상세 화면 (리뷰 포함)
    @GetMapping("/{productSeq}")
    public ResponseEntity<?> getProductDetail(@PathVariable int productSeq) {
        System.out.println(productSeq);
        Map<String, Object> map = productService.getProduct(productSeq);
        // 값 존재 X
        if (map == null)
            return ResponseEntity.status(HttpStatus.SC_NOT_FOUND).body(null);

        // 값 존재 O
        return ResponseEntity.ok(map);
    }

    @GetMapping("")
    public ResponseEntity<?> getProductAll(
            @PageableDefault(page = 0, size = 9, sort = "id", direction = Sort.Direction.DESC) Pageable pageable,
            @RequestParam(required = false, defaultValue = "newest") String sortby,
            @RequestParam(defaultValue = "0") int categoryid) {

        Map<String, Object> map = productService.getProductList(pageable, sortby, categoryid);
        // 값 존재 X
        if (map == null)
            return ResponseEntity.status(HttpStatus.SC_NOT_FOUND).body(null);

        // 값 존재 O
        return ResponseEntity.ok(map);
    }

    //검색 매핑주소 확인필요
    @GetMapping("/{keyword}")
    public ResponseEntity<?> getProductSearchList(
            @PageableDefault(page = 0, size = 9, sort = "id", direction = Sort.Direction.DESC) Pageable pageable,
            @RequestParam(required = false, defaultValue = "newest") String sortby,
            @PathVariable String keyword) {
        //키워드 검증 추가
        if (keyword == null || keyword.trim().isEmpty()) {
            return ResponseEntity.badRequest().body("검색 키워드를 입력해주세요.");
        }

        Map<String, Object> map = productService.getProductSearchList(pageable, sortby, keyword);
        //값 존재 X
        if (map == null)
            return ResponseEntity.status(HttpStatus.SC_NOT_FOUND).body(null);

        //값 존재 O
        return ResponseEntity.ok(map);
    }
}