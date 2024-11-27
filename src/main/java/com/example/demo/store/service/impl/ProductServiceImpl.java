package com.example.demo.store.service.impl;

import java.util.ArrayList;
import java.util.HashMap;
import java.util.List;
import java.util.Map;
import java.util.stream.Collectors;

import com.example.demo.store.dto.*;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Pageable;
import org.springframework.data.domain.Sort;
import org.springframework.stereotype.Service;
import org.springframework.web.multipart.MultipartFile;

import com.amazonaws.services.kms.model.NotFoundException;
import com.example.demo.ncp.dto.NCPObjectStorageDTO;
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

import jakarta.transaction.Transactional;

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

    @Autowired
    private NCPObjectStorageDTO ncpDTO;

    @Override
    public Map<String, Object> getProduct(int productId) {
        Map<String, Object> map = new HashMap<>();

        // 1. 상품 정보 추출
        ProductEntity productEntity = productRepository.findById(productId).orElseThrow(null);
        productEntity.setImg(ncpDTO.getURL() + productEntity.getImg());
        map.put("Product", ProductDTO.toGetProductDTO(productEntity));

        // 2. 이미지 추출
        List<ProductImgDTO> imgList = new ArrayList<>();
        for (ProductImgEntity imgEntity : productEntity.getImgList()) {
            imgEntity.setFileName(ncpDTO.getURL() + imgEntity.getFileName());
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
                .findById(Integer.parseInt(map.get("categoryId").toString())).orElse(null);
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

    // NCP 업로드 & 이미지 테이블에 Data 저장 (메인 Img ProductEntity에 설정)
    private void saveImgFiles(List<MultipartFile> files, ProductEntity product, int layer) {
        for (MultipartFile file : files) {
            try {
                // NCP Object Storage 업로드
                String fileName = ncpObjectStorageService.uploadFile(
                        ncpDTO.getBUCKETNAME(), ncpDTO.getPRODUCTDIRECTORY(), file);

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

    // 상품 리스트, 카테고리별 검색 or 키워드별 검색 후 페이징처리-11/25-tang
    @Override
    public Map<String, Object> getProductList(Pageable pageable, String sortby, int categoryid, String keyword) {
        Map<String, Object> map = new HashMap<>();
        // DB 상품 개수 추출
        // 삼항연산자 사용 categoryid가 0 = 전체 상품, 1 = 아우터, 2 = 상의, 3 = 하의로 상품개수 추출
        // productRepository.count(); = productRepository.findAll().size(); 와 같음
        // count는 SELECT COUNT(*) FROM product;
        // findAll.size()는 SELECT FROM product; 후 Java의 List.size()를 호출하는 방식
        // count() 자료형이 long 이라서 int 로 강제 형변환

        // 조건 별 총 개수
        // 0. 전체
        // 1. 카테고리
        // 2. 키워드
        // 3. 카테고리 + 키워드
        int pCase = 0;
        int productCount = 0;

        if (categoryid == 0 & keyword == null) {
            // categoryid는 all, keyword는 받지 않았을 때, 전체 DB 개수 추출
            pCase = 0;
            productCount = (int) productRepository.count();
        } else if (categoryid != 0 && keyword == null) {
            pCase = 1;
            // categoryid로 검색한 DB 개수 추출
            productCount = categoryRepository.findById(categoryid).orElseThrow().getProductList().size();
        } else if (categoryid == 0 && keyword != null) {
            pCase = 2;
            // keyword로 검색한 DB 개수 추출
            productCount = productRepository.countByNameContaining(keyword);
        } else if (categoryid != 0 && keyword != null) {
            pCase = 3;
            // categoryid + keyword로 검색한 DB 개수 추출
            productCount = productRepository.countByNameContainingIgnoreCaseAndCategoryEntity_id(keyword, categoryid);

        }

        // 페이징 설정
        productPaging.setTotalA(productCount);
        productPaging.setCurrentPage(pageable.getPageNumber());
        productPaging.setPageSize(pageable.getPageSize());
        productPaging.setPageBlock(3);
        productPaging.makePaging();

        // 기본 최신순 정렬
        Sort sort = pageable.getSort();
        if (sortby.equals("priceHigh")) {
            // 가격 높은 순
            sort = Sort.by(Sort.Direction.DESC, "price");
        } else if (sortby.equals("priceLow")) {
            // 가격 낮은 순
            sort = Sort.by(Sort.Direction.ASC, "price");
        }
        pageable = PageRequest.of(pageable.getPageNumber(), pageable.getPageSize(), sort);

        // 상품 목록 가져오기( 컨트롤러에서 설정한 기본 개수는 15개)
        Page<ProductEntity> pageProductList = null;

        if (pCase == 0) {
            // categoryid는 all, keyword는 받지 않았을 때, 전체 DB 개수 추출
            pageProductList = productRepository.findAll(pageable);
        } else if (pCase == 1) {
            // categoryid로 검색한 DB 개수 추출
            pageProductList = productRepository.findBycategoryid(categoryid, pageable);
        } else if (pCase == 2) {

            // keyword로 검색한 DB 개수 추출
            pageProductList = productRepository.findByNameContainingIgnoreCase(keyword, pageable);
        } else {
            // categoryid + keyword로 검색한 DB 개수 추출
            pageProductList = productRepository.findByNameContainingIgnoreCaseAndCategoryEntity_id(keyword, categoryid,
                    pageable);
        }

        // Java8 이상 사용시 Entity -> DTO 변환하는 방법
        List<ProductDTO> dtoList = pageProductList.getContent()
                .stream()
                .map(productEntity -> {
                    productEntity.setImg(ncpDTO.getURL() + productEntity.getImg()); // 이미지 URL 수정
                    return ProductDTO.toGetProductDTO(productEntity); // DTO로 변환
                })
                .collect(Collectors.toList());

        // 결과를 map에 저장
        map.put("productList", dtoList);
        map.put("startNum", productPaging.getStartNum());
        map.put("endNum", productPaging.getEndNum());
        map.put("pre", productPaging.isPre());
        map.put("next", productPaging.isNext());
        map.put("category", getCategory());
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

    // 상품 수정 - 24.11.25, 26, 27 - uj
    @Override
    @Transactional
    @SuppressWarnings("unchecked")
    public void putProduct(Map<String, Object> map) {
        // 1. DB에서 상품 조회
        ProductDTO productDTO = (ProductDTO) map.get("ProductDTO");
        ProductEntity productEntity = productRepository.findById(productDTO.getId()).orElseThrow(
                () -> new NotFoundException("해당 상품(" + productDTO.getId() + ")이 조회되지 않습니다."));

        // 1-1. 사용자 입력 데이터
        productEntity.setName(productDTO.getName());
        productEntity.setContent(productDTO.getContent());
        productEntity.setPrice(productDTO.getPrice());

        // 2. 카테고리 Entity 추출
        ProductCategoryEntity categoryEntity = categoryRepository
                .findById(Integer.parseInt(map.get("categoryId").toString()))
                .orElseThrow(
                        () -> new NotFoundException("해당 카테고리(" + map.get("categoryId").toString() + ")가 조회되지 않습니다."));
        productEntity.setCategoryEntity(categoryEntity);

        // 3. 이미지(NCP) 수정
        // 이미지 Id
        String[] selectImgId = (String[]) map.get("selectImgId"); // 존재할 상품 이미지 Id
        List<ProductImgEntity> imgEntityList = productEntity.getImgList(); // 상품 이미지 Entity
        List<ProductImgEntity> selectimgEntityList = new ArrayList<>(); // DB에 저장할 Img Entity

        // 3-1. 이미지 삭제 (NCP & DB)
        for (ProductImgEntity imgEntity : imgEntityList) {
            boolean isDelete = true;

            for (String imgIdStr : selectImgId) {
                int imgId = Integer.parseInt(imgIdStr);
                // DB에 남길 Img Entity
                if (imgId == imgEntity.getId()) {
                    selectimgEntityList.add(imgEntity);
                    isDelete = false;
                    break;
                }
            }

            // NCP에서 삭제
            if (isDelete) {
                ncpObjectStorageService.deleteFile(
                        ncpDTO.getBUCKETNAME(),
                        ncpDTO.getPRODUCTDIRECTORY(),
                        imgEntity.getFileName());

                System.out.println("삭제 Img Entity Id: " + imgEntity.getId());
            }
        }

        // DB 에서 삭제
        productEntity.getImgList().clear(); // 기존 컬렉션 초기화
        productEntity.getImgList().addAll(selectimgEntityList); // 새 값 추가

        // 3-2. 이미지 업로드 (NCP & DB)
        for (int i = 1; i < 5; i++) {
            if (map.get("layer" + i) != null) {
                List<MultipartFile> files = (List<MultipartFile>) map.get("layer" + i);
                saveImgFiles(files, productEntity, i);
            }
        }

        // 4. 재고 수정
        for (ProductStockEntity stockEntity : productEntity.getStockList()) {
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
        }

        productRepository.save(productEntity);
    }

}
