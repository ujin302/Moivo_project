package com.example.demo.store.service.impl;

import java.util.ArrayList;
import java.util.HashMap;
import java.util.List;
import java.util.Map;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.web.multipart.MultipartFile;

import com.example.demo.ncp.service.NCPObjectStorageService;
import com.example.demo.store.dto.ProductDTO;
import com.example.demo.store.dto.ProductImgDTO;
import com.example.demo.store.dto.ProductStockDTO;
import com.example.demo.store.dto.ReviewDTO;
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
        System.out.println("saveProduct: " + productEntity);
        System.out.println("saveProduct: " + productId);
        productEntity.setId(productId);
        System.out.println("saveProduct: " + productEntity);

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
                product.setImg(fileName);
                productRepository.save(product);

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

    //상품 전체 리스트 뿌리기
    @Override
    public Map<String, Object> getProductList() {
        Map<String, Object> map = new HashMap<>();

        //1 DB 전체 상품 추출
        List<ProductEntity> list = productRepository.findAll();

        List<ProductDTO> dtoList = new ArrayList<>();
        List<ProductImgDTO> imgList = new ArrayList<>();

        for (ProductEntity productEntity : list) {
            ProductDTO productDTO = ProductDTO.toGetProductDTO(productEntity);
            dtoList.add(productDTO);

            //전체 상품에서 layer1 이미지 추출
//            for (ProductImgEntity imgEntity : productEntity.getImgList()) {
//                if (imgEntity.getLayer() == 1) {
//                    ProductImgDTO imgDTO = ProductImgDTO.toGetProductImgDTO(imgEntity);
//                    imgList.add(imgDTO);
//                }
//            }
        }
        //결과를 map에 저장
        map.put("productList", dtoList);
       // map.put("imgList", imgList);
        System.out.println("getProductList: " + dtoList);
        //System.out.println("getProductList: " + imgList);
        return map;
    }

}