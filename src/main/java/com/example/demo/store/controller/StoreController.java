package com.example.demo.store.controller;

import java.util.Map;
import java.util.stream.Collectors;

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
@RequestMapping("/api/store")
public class StoreController {

    @Autowired
    private ProductService productService;
    
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

    //  개별 상품 상세 정보 요청_241127-sc
    @GetMapping("/product-detail/{productId}")
    public ResponseEntity<?> getProductDetail(@PathVariable int productId) {
        try {
            Map<String, Object> productData = productService.getProduct(productId);
            if (productData == null) {
                return ResponseEntity.status(HttpStatus.SC_NOT_FOUND).body(null);
            }
            return ResponseEntity.ok(productData);
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.SC_INTERNAL_SERVER_ERROR).body(e.getMessage());
        }
    }

}