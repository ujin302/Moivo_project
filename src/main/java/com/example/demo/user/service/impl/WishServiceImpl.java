package com.example.demo.user.service.impl;

import java.util.ArrayList;
import java.util.HashMap;
import java.util.List;
import java.util.Map;
import java.util.stream.Collectors;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import com.example.demo.store.dto.ProductDTO;
import com.example.demo.store.entity.ProductEntity;
import com.example.demo.store.repository.ProductRepository;
import com.example.demo.user.dto.WishDTO;
import com.example.demo.user.entity.UserWishEntity;
import com.example.demo.user.entity.WishEntity;
import com.example.demo.user.repository.UserWishRepository;
import com.example.demo.user.repository.WishRepository;
import com.example.demo.user.service.WishService;

import jakarta.transaction.Transactional;

@Service
@Transactional
public class WishServiceImpl implements WishService {

    @Autowired
    private WishRepository wishRepository;

    @Autowired
    private UserWishRepository userWishRepository;

    @Autowired
    private ProductRepository productRepository;

    // 찜한거 담는거
    @Override
    public void addProduct(int productId, int userId) {
        WishEntity wishEntity = wishRepository.findByUserEntity_Id(userId).get(0);
        UserWishEntity userWishEntity = new UserWishEntity();
        ProductEntity productEntity = productRepository.findById(productId).orElse(null);

        userWishEntity.setProductEntity(productEntity);
        userWishEntity.setWishEntity(wishEntity);
        userWishRepository.save(userWishEntity);
    }

    // 찜한거 출력 - 24.11.25 sumin
    @Override
    public Map<String, Object> printWish(int userId) {
        Map<String, Object> map = new HashMap<>();

        // userId에 해당하는 사용자의 WishEntity 찾기 
        WishEntity wishEntity = wishRepository.findById(userId).orElse(null);

        //유저의 찜 목록이 존재한다면
        if (wishEntity != null) {
            // UserWishEntity 리스트에서 각 상품 정보 가져오기
            List<ProductDTO> productList = wishEntity.getUserWishList().stream()
                // 각 UserWishEntity의 ProductEntity를 ProductDTO로 변환    
                .map(userWish -> ProductDTO.toGetProductDTO(userWish.getProductEntity())) // ProductEntity를 ProductDTO로 변환
                .collect(Collectors.toList());

            // 가져온 ProductDTO 리스트를 WishDTO 리스트로 변환
            List<WishDTO> wishDTOList = productList.stream() // 찜한 상품의 정보가 담김
                .map(product -> {
                    // WishDTO 객체 생성 및 설정
                    WishDTO wishDTO = new WishDTO();
                    wishDTO.setProduct(product); // ProductDTO를 WishDTO에 설정
                    return wishDTO; // 변환된 WishDTO 반환
                })
                .collect(Collectors.toList());

            // 최종적으로 'wishlist'라는 키에 WishDTO 리스트를 맵에 저장
            map.put("wishlist", wishDTOList); 
        } else {
            // 찜 목록이 없다면 'wishlist'에 빈 리스트를 저장
            map.put("wishlist", new ArrayList<>()); 
        }
        return map;
    }

    // 찜한거 삭제 - 24.11.26 - uj
    @Override
    @Transactional
    public void deleteProduct(int productid, int userId) {
        // 사용자의 WishEntity 가져오기
        WishEntity wishEntity = wishRepository.findByUserEntity_Id(userId).get(0);
        ProductEntity productEntity = productRepository.findById(productid)
                .orElseThrow(() -> new RuntimeException("해당 상품이 없습니다."));
        List<UserWishEntity> userWishEntityList = wishEntity.getUserWishList();

        // 연관 관계 끊기 & DB에서 삭제
        for (UserWishEntity userWishEntity : userWishEntityList) {
            if (userWishEntity.getProductEntity() == productEntity) {
                userWishEntityList.remove(userWishEntity);
                wishRepository.save(wishEntity);
                break;
            }
        }

        System.out.println("삭제가 요청되었습니다.");
    }

}
