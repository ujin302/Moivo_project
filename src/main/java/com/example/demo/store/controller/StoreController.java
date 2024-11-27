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
    // 상품 상세 화면 조회 로직 수정_241126-sc
    @GetMapping("/{id}") // id를 사용하여 상품 상세 정보 요청
    public ResponseEntity<?> getProductDetail(@PathVariable int id) {
        Map<String, Object> map = productService.getProduct(id); // 서비스에서 상품 정보 가져오기
        // 값 존재 X
        if (map == null) {
            return ResponseEntity.status(HttpStatus.SC_NOT_FOUND).body(null);
        }

        // 값 존재 O
        return ResponseEntity.ok(map);
    }

    // 상품 리스트, 카테고리별 검색 or 키워드별 검색 후 페이징처리-11/25-tang
    @GetMapping("")
    public ResponseEntity<?> getProductAll(
            @PageableDefault(page = 0, size = 15, sort = "id", direction = Sort.Direction.DESC) Pageable pageable,
            @RequestParam(name = "sortby", required = false, defaultValue = "newest") String sortby,
            @RequestParam(name = "categoryid", required = false, defaultValue = "0") int categoryid,
            @RequestParam(name = "keyword", required = false) String keyword) {

        Map<String, Object> map = productService.getProductList(pageable, sortby, categoryid, keyword);
        // 값 존재 X
        if (map == null)
            return ResponseEntity.status(HttpStatus.SC_NOT_FOUND).body(null);

        // 값 존재 O
        return ResponseEntity.ok(map);
    }

}