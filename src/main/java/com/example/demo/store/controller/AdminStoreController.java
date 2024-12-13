package com.example.demo.store.controller;

import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RequestPart;
import org.springframework.web.bind.annotation.RestController;
import org.springframework.web.multipart.MultipartFile;

import com.example.demo.store.dto.ProductCategoryDTO;
import com.example.demo.store.dto.ProductDTO;
import com.example.demo.store.entity.ProductEntity.Gender;
import com.example.demo.store.service.ProductService;

import java.util.HashMap;
import java.util.List;
import java.util.Map;

import org.apache.http.HttpStatus;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.DeleteMapping;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.ModelAttribute;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.PutMapping;

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
            @RequestPart(name = "layer1") List<MultipartFile> layer1Files,
            @RequestPart(name = "layer2") List<MultipartFile> layer2Files,
            @RequestPart(name = "layer3") List<MultipartFile> layer3Files,
            @RequestPart(name = "layer4") List<MultipartFile> layer4Files,
            @RequestParam(name = "S", defaultValue = "0") int SCount,
            @RequestParam(name = "M", defaultValue = "0") int MCount,
            @RequestParam(name = "L", defaultValue = "0") int LCount,
            @RequestParam(name = "categoryId", defaultValue = "1") int categoryId) {

        // 받을 값
        // 1. ProductDTO 객체 (Category 설정)
        // 2. imgDTO 객체
        // 3. stock 객체

        Map<String, Object> map = new HashMap<>();

        map.put("ProductDTO", productDTO);
        map.put("layer1", layer1Files);
        map.put("layer2", layer2Files);
        map.put("layer3", layer3Files);
        map.put("layer4", layer4Files);
        map.put("S", SCount);
        map.put("M", MCount);
        map.put("L", LCount);
        map.put("categoryId", categoryId);

        productService.saveProduct(map);
        return ResponseEntity.ok(null);
    }

    // 상품 등록 화면 카테고리 출력
    @GetMapping("/category")
    public ResponseEntity<List<ProductCategoryDTO>> getCategory() {
        List<ProductCategoryDTO> list = productService.getCategory();
        return ResponseEntity.ok(list);
    }

    // 상품 수정 - 24.11.25, 26, 27 - 이유진
    @PutMapping("/product")
    public ResponseEntity<String> putProduct(
            @ModelAttribute ProductDTO productDTO,
            @RequestParam(name = "selectImgList", required = false) String selectImgList,
            @RequestPart(name = "layer1", required = false) List<MultipartFile> layer1Files,
            @RequestPart(name = "layer2", required = false) List<MultipartFile> layer2Files,
            @RequestPart(name = "layer3", required = false) List<MultipartFile> layer3Files,
            @RequestPart(name = "layer4", required = false) List<MultipartFile> layer4Files,
            @RequestParam(name = "S", defaultValue = "0", required = false) int SCount,
            @RequestParam(name = "M", defaultValue = "0", required = false) int MCount,
            @RequestParam(name = "L", defaultValue = "0", required = false) int LCount,
            @RequestParam(name = "categoryId", defaultValue = "1", required = false) int categoryId) {
        Map<String, Object> map = new HashMap<>();
        String[] selectImgId = selectImgList.replace("[", "").replace("]", "").split(",");
        System.out.println("putProduct" + productDTO);
        map.put("ProductDTO", productDTO);
        map.put("selectImgId", selectImgId);
        map.put("layer1", layer1Files);
        map.put("layer2", layer2Files);
        map.put("layer3", layer3Files);
        map.put("layer4", layer4Files);
        map.put("S", SCount);
        map.put("M", MCount);
        map.put("L", LCount);
        map.put("categoryId", categoryId);

        try {
            productService.putProduct(map);
        } catch (Exception e) {
            e.printStackTrace();
            return ResponseEntity.status(HttpStatus.SC_NOT_FOUND).body(e.getMessage());
        }

        return ResponseEntity.ok(null);
    }

    // 24.11.29 - uj
    // 상품 성별 리스트 추출
    @GetMapping("/gender")
    public ResponseEntity<List<Gender>> getGenders() {
        List<Gender> list = productService.getGenders();
        return ResponseEntity.ok(list);
    }

    // 상품 삭제 - 24.11.27 - uj
    @DeleteMapping("delete/{productId}")
    public ResponseEntity<String> deleteProduct(@PathVariable(name = "productId") int productId) {
        try {
            productService.deleteProduct(productId);
            return ResponseEntity.ok("상품 삭제가 완료되었습니다.");
        } catch (Exception e) {
            e.printStackTrace();
            return ResponseEntity.status(HttpStatus.SC_NOT_FOUND).body(e.getMessage());
        }
    }

    // 삭제된 상품 리스트 가져오기 - 12.11 sumin
    @GetMapping("/trash")
    public ResponseEntity<List<ProductDTO>> getDeletedProducts() {
        List<ProductDTO> deletedProducts = productService.getDeletedProducts();
        System.out.println("deletedProducts = " + deletedProducts);
        return ResponseEntity.ok(deletedProducts);
    }

    //삭제된 상품 복구 - 12.11 sumin
    @PostMapping("/restore/{productId}")
    public ResponseEntity<Void> restoreProduct(@PathVariable(name = "productId") int productId) {
        System.out.println("productId = " + productId);

        boolean result = productService.restoreProduct(productId);
        System.out.println("result = " + result);
        
        if (result) {
            return ResponseEntity.ok().build(); // 성공 시 200 OK
        } else {
            return ResponseEntity.status(HttpStatus.SC_NOT_FOUND).build(); // 실패 시 404 Not Found
        }
    }
}
