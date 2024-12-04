package com.example.demo.store.service.impl;

import java.util.ArrayList;
import java.util.Arrays;
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
import com.example.demo.store.entity.ProductEntity.Gender;
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

    // 상품 상세 정보 출력 - uj
    @Override
    public Map<String, Object> getProduct(int productId) {
        Map<String, Object> map = new HashMap<>();

        // 1. 상품 정보 추출
        ProductEntity productEntity = productRepository.findById(productId).orElseThrow(null);
        map.put("product", ProductDTO.toGetProductDTO(productEntity));

        // 2. 이미지 추출
        List<ProductImgDTO> imgList = new ArrayList<>();
        for (ProductImgEntity imgEntity : productEntity.getImgList()) {
            ProductImgDTO imgDTO = ProductImgDTO.toGetProductImgDTO(imgEntity);
            imgList.add(imgDTO);

            System.out.println(imgDTO);
        }
        map.put("imgList", imgList);

        // 3. 리뷰 추출
        List<ReviewDTO> reviewList = new ArrayList<>();
        for (ReviewEntity reviewEntity : productEntity.getReviewList()) {
            ReviewDTO reviewDTO = ReviewDTO.toGetReviewDTO(reviewEntity);
            reviewList.add(reviewDTO);
            System.out.println(reviewDTO);
        }
        map.put("reviewList", reviewList);

        // 4. 재고 추출
        List<ProductStockDTO> stockList = new ArrayList<>();
        for (ProductStockEntity stockEntity : productEntity.getStockList()) {
            stockList.add(ProductStockDTO.toGetProductStockDTO(stockEntity));
        }
        map.put("stockList", stockList);

        return map;
    }

    // 상품 등록 - uj
    @Override
    @SuppressWarnings("unchecked")
    public void saveProduct(Map<String, Object> map) {

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

    // NCP 업로드 & 이미지 테이블에 Data 저장 (메인 Img ProductEntity에 설정) - uj
    private void saveImgFiles(List<MultipartFile> files, ProductEntity product, int layer) {
        for (MultipartFile file : files) {
            try {
                NCPObjectStorageDTO ncpDTO = new NCPObjectStorageDTO();
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

    // 상품 리스트, 카테고리별 검색 or 키워드별 검색 후 페이징처리-11/25-tang & 11/27 - 페이징 처리 수정 - uj
    @Override
    public Map<String, Object> getProductList(Map<String, Object> dataMap) {
        Map<String, Object> map = new HashMap<>();
        // 1. 정보 세팅
        Pageable pageable = (Pageable) dataMap.get("pageable"); // 페이지 처리
        int block = Integer.parseInt(dataMap.get("block").toString()); // 한 페이지에 보여줄 숫자
        String sortby = dataMap.get("sortby").toString(); // 정렬 기준
        int categoryid = Integer.parseInt(dataMap.get("categoryid").toString()); // 카테고리 정렬 기준
        String keyword = null; // 검색어
        if (dataMap.get("keyword") != null)
            keyword = dataMap.get("keyword").toString();
        // 2. 기본 최신순 정렬 설정
        Sort sort = pageable.getSort();
        if (sortby.equals("priceHigh")) {
            // 가격 높은 순
            sort = Sort.by(Sort.Direction.DESC, "price");
        } else if (sortby.equals("priceLow")) {
            // 가격 낮은 순
            sort = Sort.by(Sort.Direction.ASC, "price");
        }
        pageable = PageRequest.of(pageable.getPageNumber(), pageable.getPageSize(), sort);

        // 3. 조건 별 상품 목록 가져오기( 컨트롤러에서 설정한 기본 개수는 15개)
        Page<ProductEntity> pageProductList = null;
        if (categoryid == 0 & keyword == null) { // 전체
            // categoryid는 all, keyword는 받지 않았을 때, 전체 DB 개수 추출
            pageProductList = productRepository.findAll(pageable); // 카테고리
        } else if (categoryid != 0 && keyword == null) {
            // categoryid로 검색한 DB 개수 추출
            pageProductList = productRepository.findBycategoryid(categoryid, pageable); // 키워드
        } else if (categoryid == 0 && keyword != null) {
            // keyword로 검색한 DB 개수 추출
            pageProductList = productRepository.findByNameContainingIgnoreCase(keyword, pageable); // 카테고리 + 키워드
        } else if (categoryid != 0 && keyword != null) {
            // categoryid + keyword로 검색한 DB 개수 추출
            pageProductList = productRepository.findByNameContainingIgnoreCaseAndCategoryEntity_id(keyword, categoryid,
                    pageable);
        }

        // 4. Entity -> DTO 변환
        List<ProductDTO> dtoList = pageProductList.getContent() // Java8 이상 사용시 Entity -> DTO 변환하는 방법
                .stream()
                .map(productEntity -> {
                    System.out.println("Product ID: " + productEntity.getId());
                    System.out.println("Original Image: " + productEntity.getImg());
                    return ProductDTO.toGetProductDTO(productEntity); // DTO로 변환
                })
                .collect(Collectors.toList());

        // 5. 페이징 숫자 처리
        int currentBlock = pageProductList.getNumber() / block;
        int startPage = currentBlock * block;
        int endPage = Math.min(startPage + block, pageProductList.getTotalPages());

        // 6. 결과 담기
        // 페이징 정보
        map.put("startPage", startPage); // 블럭 첫번째 페이지
        map.put("endPage", endPage); // 블럭 마지막 페이지
        map.put("isFirst", pageProductList.isFirst()); // 1 페이지 여부
        map.put("isLast", pageProductList.isLast()); // 마지막 페이지 여부
        map.put("hasPrevious", pageProductList.hasPrevious()); // 이전 페이지 여부
        map.put("hasNext", pageProductList.hasNext()); // 다음 페이지 여부
        map.put("totalPages", pageProductList.getTotalPages()); // 페이지 개수

        // 상품 관련 정보
        map.put("productList", dtoList);
        map.put("category", getCategory());
        System.out.println("getProductList: " + dtoList);
        return map;
    }

    // 상품 카테고리 추출 - uj
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
        NCPObjectStorageDTO ncpDTO = new NCPObjectStorageDTO();

        // 1. DB에서 상품 조회
        ProductDTO productDTO = (ProductDTO) map.get("ProductDTO");
        ProductEntity productEntity = productRepository.findById(productDTO.getId()).orElseThrow(
                () -> new NotFoundException("해당 상품(" + productDTO.getId() + ")이 조회되지 않습니다."));

        // 1-1. 사용자 입력 데이터
        productEntity.setName(productDTO.getName());
        productEntity.setContent(productDTO.getContent());
        productEntity.setPrice(productDTO.getPrice());
        productEntity.setGender(productDTO.getGender());

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

    // 24.11.29 - uj
    // 상품 성별 리스트 추출
    @Override
    public List<Gender> getGenders() {
        return Arrays.asList(Gender.values());
    }

    // 24.11.27 - 상품 삭제 - uj
    @Override
    public void deleteProduct(int productId) {
        // 1. 상품 정보 삭제

        // 2. 상품 이미지 삭제

        // 3. 상품 재고 삭제

        // 4. 상품 리뷰 삭제

        // 5. 장바구니에서 상품 삭제

        // 6.
    }

}