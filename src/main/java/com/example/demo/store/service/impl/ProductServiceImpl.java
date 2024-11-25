package com.example.demo.store.service.impl;

import java.util.ArrayList;
import java.util.HashMap;
import java.util.List;
import java.util.Map;

import com.example.demo.store.dto.*;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Pageable;
import org.springframework.data.domain.Sort;
import org.springframework.stereotype.Service;
import org.springframework.web.multipart.MultipartFile;

import com.amazonaws.services.kms.model.NotFoundException;
import com.example.demo.ncp.service.NCPObjectStorageService;
import com.example.demo.store.entity.ProductCategoryEntity;
import com.example.demo.store.entity.ProductEntity;
import com.example.demo.store.entity.ProductImgEntity;
import com.example.demo.store.entity.ProductStockEntity;
import com.example.demo.store.entity.ReviewEntity;
import com.example.demo.store.repository.ProductCategoryRepository;
import com.example.demo.store.repository.ProductImgRepository;
import com.example.demo.store.repository.ProductRepository;
import com.example.demo.store.repository.ProductStockRepository;
import com.example.demo.store.service.ProductService;

@Service
public class ProductServiceImpl implements ProductService {
    @Autowired
    private ProductRepository productRepository;

    @Autowired
    private ProductImgRepository imgRepository;

    @Autowired
    private ProductCategoryRepository categoryRepository;

    @Autowired
    private ProductStockRepository stockRepository;

    @Autowired
    private NCPObjectStorageService ncpObjectStorageService;

    @Autowired
    private ProductPaging productPaging;

    @Override
    public Map<String, Object> getProduct(int productId) {
        Map<String, Object> map = new HashMap<>();

        // 1. 상품 정보 추출
        ProductEntity productEntity = productRepository.findById(productId).orElseThrow(null);
        map.put("Product", ProductDTO.toGetProductDTO(productEntity));

        // 2. 이미지 추출
        List<ProductImgDTO> imgList = new ArrayList<>();
        for (ProductImgEntity imgEntity : productEntity.getImgList()) {
            ProductImgDTO imgDTO = ProductImgDTO.toGetProductImgDTO(imgEntity);
            imgList.add(imgDTO);
            System.out.println(imgDTO);
        }
        map.put("ImgList", imgList);

        // 3. 리뷰 추출
        List<ReviewDTO> reviewList = new ArrayList<>();
        for (ReviewEntity reviewEntity : productEntity.getReviewList()) {
            ReviewDTO reviewDTO = ReviewDTO.toGetReviewDTO(reviewEntity);
            reviewList.add(reviewDTO);
            System.out.println(reviewDTO);
        }
        map.put("ReviewList", reviewList);

        // 4. 재고 추출
        Map<String, Integer> stockMap = new HashMap<>();
        for (ProductStockEntity stockEntity : productEntity.getStockList()) {
            stockMap.put(stockEntity.getSize().toString(), stockEntity.getCount());
        }

        map.put("Stock", stockMap);
        return map;
    }

    @Override
    @SuppressWarnings("unchecked")
    public void saveProduct(Map<String, Object> map) { // 재고 관련 매개 변수 필요

        // 1. 상품 DTO => Entity
        ProductEntity productEntity = ProductEntity.toSaveProductEntity((ProductDTO) map.get("ProductDTO"));
        // 1-1. 카테고리 Entity 가져와서 저장
        ProductCategoryEntity categoryEntity = categoryRepository
                .findById(Integer.parseInt(map.get("CategorySeq").toString())).orElse(null);
        productEntity.setCategoryEntity(categoryEntity);

        // 1-2. 상품 테이블에 저장
        int productId = productRepository.save(productEntity).getId(); // DB에 저장된 기본키 반환
        System.out.println("saveProduct: " + productId);

        // 2. NCP & DB에 이미지 저장
        for (int i = 1; i < 4; i++) {
            List<MultipartFile> files = (List<MultipartFile>) map.get("layer" + i);
            saveImgFiles(files, productEntity, i);
        }

        // 3. 재고 저장
        // 사이즈 S, M, L
        for (String size : new String[] { "S", "M", "L" }) {
            ProductStockDTO stockDTO = new ProductStockDTO();
            stockDTO.setSize(size);
            stockDTO.setCount(Integer.parseInt(map.get(size).toString()));
            ProductStockEntity stockEntity = ProductStockEntity.toSaveStockEntity(stockDTO, productEntity);

            stockRepository.save(stockEntity);
        }

    }

    // NCP 업로드 & 이미지 테이블에 Data 저장
    private void saveImgFiles(List<MultipartFile> files, ProductEntity product, int layer) {
        for (MultipartFile file : files) {
            try {
                // NCP Object Storage 업로드
                String fileName = ncpObjectStorageService.uploadFile("moivo", "products/", file);

                // ProductEntity에 메인 이미지 저장
                if (layer == 1) {
                    product.setImg(fileName);
                    productRepository.save(product);
                }

                // 데이터베이스에 저장할 ProductImgEntity 생성
                ProductImgEntity imgEntity = new ProductImgEntity();
                imgEntity.setProductEntity(product);
                imgEntity.setFileName(fileName);
                imgEntity.setOriginalFileName(file.getOriginalFilename());
                imgEntity.setLayer(layer); // 레이어 값 설정

                // ProductImgRepository에 저장
                imgRepository.save(imgEntity);

                // 로그 출력
                System.out.println("Saved image for layer " + layer + ": " + fileName);
            } catch (Exception e) {
                System.err.println("File upload failed for layer " + layer + ": " + e.getMessage());
            }
        }
    }

    // 상품 전체 리스트 뿌리기
    @Override
    public Map<String, Object> getProductList(Pageable pageable, String sortby) {
        Map<String, Object> map = new HashMap<>();

        // 1 DB 전체 상품 개수 추출
        int productCount = productRepository.findAll().size();

        // 페이징 설정
        productPaging.setTotalA(productCount);
        productPaging.setCurrentPage(pageable.getPageNumber() + 1); // 0이면 1페이지
        productPaging.setPageSize(pageable.getPageSize());
        productPaging.setPageBlock(3);
        productPaging.makePaging();

        // 정렬
        // 최신순
        Sort sort = pageable.getSort();
        if (sortby.equals("priceHigh")) {
            // 가격 높은 순
            sort = Sort.by(Sort.Direction.DESC, "price");
        } else if (sortby.equals("priceLow")) {
            // 가격 낮은 순
            sort = Sort.by(Sort.Direction.ASC, "price");
        }
        pageable = PageRequest.of(pageable.getPageNumber(), pageable.getPageSize(), sort);
        // 페이징처리한 상품 들고오기 컨트롤러에서 설정한 개수 9개
        Page<ProductEntity> pageProductList = null;

        int id = 0;
        if (id == 0) {
            pageProductList = productRepository.findAll(pageable);
        } else {
            categoryRepository.findById(id).orElseThrow().getProductList();
        }

        List<ProductDTO> dtoList = new ArrayList<>();

        for (ProductEntity productEntity : pageProductList) {
            ProductDTO productDTO = ProductDTO.toGetProductDTO(productEntity);
            dtoList.add(productDTO);
        }

        // 결과를 map에 저장 맵애 4개 또 찾아야지~
        map.put("productList", dtoList);
        map.put("startNum", productPaging.getStartNum());
        map.put("endNum", productPaging.getEndNum());
        map.put("pre", productPaging.isPre());
        map.put("next", productPaging.isNext());

        System.out.println("getProductList: " + dtoList);
        return map;
    }

    @Override
    public List<ProductCategoryDTO> getCategory() {
        List<ProductCategoryDTO> list = new ArrayList<>();
        Iterable<ProductCategoryEntity> categoryEntityList = categoryRepository.findAll();

        for (ProductCategoryEntity categoryEntity : categoryEntityList) {
            ProductCategoryDTO categoryDTO = ProductCategoryDTO.getCategoryDTO(categoryEntity);
            System.out.println(categoryDTO);
            list.add(categoryDTO);
        }

        return list;
    }

    // 상품 수정 - 24.11.25 - uj
    @Override
    @SuppressWarnings("unchecked")
    public void putProduct(Map<String, Object> map) {
        // 1. 상품 조회
        // 사용자 입력 데이터
        ProductDTO productDTO = (ProductDTO) map.get("ProductDTO");
        ProductEntity productEntity = ProductEntity.toGetProductEntity(productDTO);

        // 2. 카테고리 Entity 추출
        ProductCategoryEntity categoryEntity = categoryRepository
                .findById(Integer.parseInt(map.get("CategorySeq").toString()))
                .orElseThrow(
                        () -> new NotFoundException("해당 카테고리(" + map.get("CategorySeq").toString() + ")가 조회되지 않습니다."));
        productEntity.setCategoryEntity(categoryEntity);

        // 3. 이미지(NCP) 수정
        // 3-1. 이미지 삭제
        List<ProductImgEntity> imgEntityList = productRepository.findById(productEntity.getId()).orElseThrow()
                .getImgList();
        for (ProductImgEntity imgEntity : imgEntityList) {
            ncpObjectStorageService.deleteFile("moivo", "products/", imgEntity.getFileName());
        }
        imgRepository.deleteByProductEntity(productEntity);

        // 3-2. 이미지 업로드
        for (int i = 1; i < 4; i++) {
            List<MultipartFile> files = (List<MultipartFile>) map.get("layer" + i);
            saveImgFiles(files, productEntity, i);
        }

        // 4. 재고 수정
        List<ProductStockEntity> stockEntityList = stockRepository.findByProductEntity(productEntity);
        for (ProductStockEntity stockEntity : stockEntityList) {
            switch (stockEntity.getSize()) {
                case S:
                    stockEntity.setCount(Integer.parseInt(map.get("S").toString()));
                    break;
                case M:
                    stockEntity.setCount(Integer.parseInt(map.get("M").toString()));
                    break;
                case L:
                    stockEntity.setCount(Integer.parseInt(map.get("L").toString()));
                    break;
                default:
                    break;
            }
            stockRepository.save(stockEntity);
        }

        productRepository.save(productEntity);
    }

}