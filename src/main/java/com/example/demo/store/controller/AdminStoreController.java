package com.example.demo.store.controller;

import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RequestPart;
import org.springframework.web.bind.annotation.RestController;
import org.springframework.web.multipart.MultipartFile;

import com.example.demo.store.dto.ProductCategoryDTO;
import com.example.demo.store.dto.ProductDTO;
import com.example.demo.store.service.ProductService;

import java.util.HashMap;
import java.util.List;
import java.util.Map;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.ModelAttribute;
import org.springframework.web.bind.annotation.PostMapping;

@RestController
@RequestMapping("/api/admin/store")
public class AdminStoreController {

    @Autowired
    private ProductService productService;

    // 상품 등록
    @PostMapping("/product")
    public ResponseEntity<String> saveProduct(
            // 1. 카테고리 관련 매개변수 필요 >> int형
            // 2. 재고 관련 매개 변수 필요 >>
            @ModelAttribute ProductDTO productDTO,
            @RequestPart("layer1") List<MultipartFile> layer1Files,
            @RequestPart("layer2") List<MultipartFile> layer2Files,
            @RequestPart("layer3") List<MultipartFile> layer3Files,
            @RequestParam(name = "S", defaultValue = "0") int SCount,
            @RequestParam(name = "M", defaultValue = "0") int MCount,
            @RequestParam(name = "L", defaultValue = "0") int LCount,
            @RequestParam(name = "CategorySeq", defaultValue = "1") int categorySeq) {

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

    // 카테고리 출력
    @GetMapping("/category")
    public ResponseEntity<List<ProductCategoryDTO>> getCategory() {
        List<ProductCategoryDTO> list = productService.getCategory();
        return ResponseEntity.ok(list);
    }
}
