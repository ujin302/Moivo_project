package com.example.demo.user.service.impl;

import java.util.List;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

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

    // 찜한거 출력 - 24.11.25 yjy
    @Override
    public List<WishDTO> printWish(int userId) {
        // 사용자의 WishEntity 가져오기
        WishEntity wishEntity = wishRepository.findById(userId).orElse(null);

        return wishEntity.getUserWishList().stream()
                .map(UserWishEntity::getWishEntity)
                .map(WishDTO::toGetWishDTO)
                .toList();
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
