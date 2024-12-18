package com.example.demo.store.service.impl;

import java.util.ArrayList;
import java.util.HashMap;
import java.util.List;
import java.util.Map;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.stereotype.Service;

import com.example.demo.store.repository.ProductRepository;
import com.example.demo.store.repository.ProductStockRepository;
import com.example.demo.store.service.AdminStoreService;
import com.example.demo.store.service.ProductService;
import com.example.demo.store.dto.AdminProductDTO;
import com.example.demo.store.entity.ProductEntity;
import com.example.demo.store.entity.ProductStockEntity;
import com.example.demo.store.entity.ProductStockEntity.Size;

// 24.12.13 파일 생성 - yjy
@Service
public class AdminStoreServiceImpl implements AdminStoreService {

    @Autowired
    private ProductRepository productRepository;

    @Autowired
    private ProductStockRepository stockRepository;

    @Autowired
    private ProductService productService;

    // 24.12.13 - 상품 현황 조회 - yjy
    @Override
    public Map<String, Object> getProductStatus() {
        Map<String, Object> result = new HashMap<>();

        // 전체 상품 수
        long totalProducts = productRepository.count();

        // 판매 중인 상품 수 (삭제되지 않은 상품)
        long activeProducts = productRepository.countByDeleteFalse();

        // 품절 상품 수 (재고가 0인 상품)
        long soldOutProducts = stockRepository.countByCountEquals(0);

        // 재고 10개 이하 상품 수
        long lowStockProducts = stockRepository.countByCountLessThanEqual(10);

        result.put("전체 상품", totalProducts);
        result.put("판매 상품", activeProducts);
        result.put("품절 상품", soldOutProducts);
        result.put("재고 10 이하", lowStockProducts);

        return result;
    }

    // 관리자 상품목록 가져오기, 카테고리 or 키워드별 검색 후 페이징처리 - 12/16 17:31 tang
    // 24.12.18 - 반환 데이터 수정 - uj
    @Override
    public Map<String, Object> getAllProductList(Map<String, Object> dataMap) {
        Map<String, Object> products = new HashMap<>();
        List<AdminProductDTO> productList = new ArrayList<>();

        // 데이터 추출
        Pageable pageable = (Pageable) dataMap.get("pageable"); // 페이지 처리
        int block = Integer.parseInt(dataMap.get("block").toString()); // 한 페이지당 보여줄 숫자
        int sortby = Integer.parseInt(dataMap.get("sortby").toString()); // 정렬 기준 현재 없음
        int categoryid = Integer.parseInt(dataMap.get("categoryid").toString());

        String keyword = null; // 검색어
        if (dataMap.get("keyword") != null) {
            keyword = dataMap.get("keyword").toString();
        }

        // 조건별 상품 목록 가져오기
        Page<ProductEntity> pageProductList = null;
        List<ProductEntity.ProductStatus> statusList = new ArrayList<>();
        if (sortby == 1) {
            pageProductList = productRepository.findByDeleteFalse(pageable);
            System.out.println("delete = false 상품 추출 >> " + pageProductList.getSize() + "개");
        } else if (sortby == 2) {
            statusList.add(ProductEntity.ProductStatus.SOLDOUT);
            statusList.add(ProductEntity.ProductStatus.SOMESOLDOUT);
            pageProductList = productRepository.findByStatuses(statusList, pageable);
            System.out.println("일부 품절 & 전체 품절 상품 추출 >> " + pageProductList.getSize() + "개");
        } else if (sortby == 3) {
            pageProductList = productRepository.findByDeleteTrue(pageable);
            System.out.println("임시 삭제(복구 대상) 상품 추출 >> " + pageProductList.getSize() + "개");
        }

        // Entity -> DTO & 상품 재고 추출
        for (ProductEntity entity : pageProductList) {
            // List<ProductStockEntity> stockEntityList =
            // stockRepository.findByProductEntity(entity);

            // 사이즈에 따른 재고 추출
            Map<Size, Integer> stockMap = new HashMap<>();
            for (ProductStockEntity stock : entity.getStockList()) {
                stockMap.put(stock.getSize(), stock.getCount());
            }
            productList.add(AdminProductDTO.toGetAdminProductDTO(entity, stockMap));
        }

        int currentBlock = pageProductList.getNumber() / block;
        int startPage = currentBlock * block;
        int engPage = Math.min(startPage + block, pageProductList.getTotalPages());

        // 페이징 정보 결과 담기
        products.put("startPage", startPage); // 블럭 첫번째 페이지
        products.put("engPage", engPage); // 블럭 마지막 페이지
        products.put("isFirst", pageProductList.isFirst()); // 1페이지 여부
        products.put("isLast", pageProductList.isLast()); // 마지막 페이지 여부
        products.put("hasPrevious", pageProductList.hasPrevious()); // 이전 페이지 여부
        products.put("hasNext", pageProductList.hasNext()); // 다음 페이지 여부
        products.put("totalPages", pageProductList.getTotalPages()); // 페이지 개수

        // 상품 관련 정보 담기
        products.put("productList", productList);
        // products.put("category", productService.getCategory());

        return products;
    }
}
