package com.example.demo.user.service.impl;

import java.util.List;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import com.example.demo.store.entity.ProductEntity;
import com.example.demo.store.repository.ProductRepository;
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

    //찜한거 담는거
    @Override
    public void addProduct(int productId, int userId) {
        WishEntity wishEntity = wishRepository.findByUserEntity_Id(userId).get(0);
        UserWishEntity userWishEntity = new UserWishEntity();
        ProductEntity productEntity = productRepository.findById(productId).orElse(null);

        userWishEntity.setProductEntity(productEntity);
        userWishEntity.setWishEntity(wishEntity);
        userWishRepository.save(userWishEntity);
    }

    //찜한거 출력  매개변수 유저 아이디 하나만 필요
    @Override
    public List<ProductEntity> printWish(int userId) {
       //사용자의 WishEntity 가져오기 
        WishEntity wishEntity  = wishRepository.findById(userId).orElse(null);
        
        return wishEntity.getUserWishList().stream()
            .map(UserWishEntity::getProductEntity) // UserWishEntity에서 ProductEntity 가져오기
            .toList();
    }

    //찜한거 삭제
    @Override
    public void deleteProduct(int productid, int userId) {
        // 사용자의 WishEntity 가져오기
        // WishEntity wishEntity = wishRepository.findByUserEntity_Id(userId).get(0);
        // ProductEntity productEntity = productRepository.findById(productid).orElseThrow(() -> new RuntimeException("해당 상품이 없습니다."));

        // // 해당 ProductEntity와 연결된 UserWishEntity 삭제
        // UserWishEntity userWishEntity =  userWishRepository.findByWishEntityAndProductEntity(wishEntity, productEntity)
        //    .orElseThrow(() -> new RuntimeException("찜 목록에서 해당 상품을 찾을 수 없습니다."));

        
        // userWishRepository.delete(userWishEntity);
        // System.out.println("삭제가 요청되었습니다.");
        // userWishRepository.flush();
    }

}
