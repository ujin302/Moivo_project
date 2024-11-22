package com.example.demo.store.controller;

import java.util.HashMap;
import java.util.List;
import java.util.Map;

import org.apache.http.HttpStatus;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.stereotype.Controller;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.multipart.MultipartFile;

import com.example.demo.store.dto.ProductDTO;
import com.example.demo.store.service.ProductService;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;

@Controller
@RequestMapping("/api/store")

public class StoreController {

    @Autowired
    private ProductService productService;

    // 상품 등록
    @PostMapping("/admin/product")
    public ResponseEntity<String> saveProduct(
            // 1. 카테고리 관련 매개변수 필요 >> int형
            // 2. 재고 관련 매개 변수 필요 >>
            @RequestBody ProductDTO productDTO,
            @RequestParam("layer1") List<MultipartFile> layer1Files,
            @RequestParam("layer2") List<MultipartFile> layer2Files,
            @RequestParam("layer3") List<MultipartFile> layer3Files,
            @RequestParam(name = "S", defaultValue = "0") int SCount,
            @RequestParam(name = "M", defaultValue = "0") int MCount,
            @RequestParam(name = "L", defaultValue = "0") int LCount,
            @RequestParam("CategorySeq") int categorySeq) {

        // 받을 값
        // 1. ProductDTO 객체 (Category 설정)
        // 2. imgDTO 객체
        // 3. stock 객체

        Map<String, Object> map = new HashMap<>();

        map.put("ProductDTO", productDTO);
        map.put("layer1", layer1Files);
        map.put("layer2", layer2Files);
        map.put("layer3", layer3Files);
        map.put("S", SCount);
        map.put("M", MCount);
        map.put("L", LCount);
        map.put("CategorySeq", categorySeq);

        productService.saveProduct(map);
        return ResponseEntity.ok(null);
    }

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
    public ResponseEntity<Map<String, Object>> getProductAll(){
        Map<String, Object> map = new HashMap<>();
        if(map == null){
            map.put("ProductDTO", new ProductDTO());
        } else{
            map.put("ProductDTO", map);
        }
        return ResponseEntity.ok(productService.getProductList());
    }

}