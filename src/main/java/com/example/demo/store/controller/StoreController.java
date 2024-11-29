package com.example.demo.store.controller;

import java.util.HashMap;
import java.util.Map;
import java.util.stream.Collectors;

import org.apache.http.HttpStatus;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.domain.Pageable;
import org.springframework.data.domain.Sort;
import org.springframework.data.web.PageableDefault;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;

import com.example.demo.store.service.ProductService;

import org.springframework.web.bind.annotation.CrossOrigin;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;

@RestController
@RequestMapping("/api/store")
@CrossOrigin(origins = "http://localhost:5173", allowCredentials = "true")
public class StoreController {

    private static final Logger logger = LoggerFactory.getLogger(StoreController.class);

    @Autowired
    private ProductService productService;

    // 상품 리스트, 카테고리별 검색 or 키워드별 검색 후 페이징처리-11/25-tang
    @GetMapping("")
    public ResponseEntity<?> getProductAll(
            @PageableDefault(page = 0, size = 15, sort = "id", direction = Sort.Direction.DESC) Pageable pageable,
            @RequestParam(name = "block", required = false, defaultValue = "3") int block,
            @RequestParam(name = "sortby", required = false, defaultValue = "newest") String sortby,
            @RequestParam(name = "categoryid", required = false, defaultValue = "0") int categoryid,
            @RequestParam(name = "keyword", required = false) String keyword) {

        Map<String, Object> dataMap = new HashMap<>();
        dataMap.put("pageable", pageable); // 페이지 처리
        dataMap.put("block", block); // 한 페이지에 보여줄 숫자
        dataMap.put("sortby", sortby); // 정렬 기준
        dataMap.put("categoryid", categoryid); // 카테고리 정렬 기준
        dataMap.put("keyword", keyword); // 검색어

        Map<String, Object> map = productService.getProductList(dataMap);
        // 값 존재 X
        if (map == null)
            return ResponseEntity.status(HttpStatus.SC_NOT_FOUND).body(null);

        // 값 존재 O
        return ResponseEntity.ok(map);
    }

    // 개별 상품 상세 정보 요청_241127-sc
    @GetMapping("/product-detail/{productId}")
    public ResponseEntity<?> getProductDetail(@PathVariable("productId") int productId) {
        logger.info("Fetching product detail for productId: {}", productId);
        try {
            Map<String, Object> productData = productService.getProductDetail(productId);
            if (productData == null || productData.isEmpty()) {
                logger.warn("Product detail not found for productId: {}", productId);
                return ResponseEntity.status(HttpStatus.SC_NOT_FOUND)
                    .body(Map.of("error", "상품을 찾을 수 없습니다."));
            }
            logger.info("Product detail found for productId: {}", productId);
            return ResponseEntity.ok(productData);
        } catch (Exception e) {
            logger.error("Error fetching product detail for productId: " + productId, e);
            return ResponseEntity.status(HttpStatus.SC_INTERNAL_SERVER_ERROR)
                .body(Map.of("error", "상품 정보를 가져오는 중 오류가 발생했습니다."));
        }
    }

}