package com.example.demo.user.service.impl;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import com.example.demo.store.entity.ProductEntity;
import com.example.demo.store.repository.ProductRepository;
import com.example.demo.user.entity.UserWishEntity;
import com.example.demo.user.entity.WishEntity;
import com.example.demo.user.repository.UserWishRepository;
import com.example.demo.user.repository.WishRepository;
import com.example.demo.user.service.WishService;

@Service
public class WishServiceImpl implements WishService {

    @Autowired
    private WishRepository wishRepository;

    @Autowired
    private UserWishRepository userWishRepository;

    @Autowired
    private ProductRepository productRepository;

    @Override
    public void addProduct(int productId, int userId) {
        WishEntity wishEntity = wishRepository.findByUserEntity_Id(userId).get(0);
        UserWishEntity userWishEntity = new UserWishEntity();
        ProductEntity productEntity = productRepository.findById(productId).orElse(null);

        userWishEntity.setProductEntity(productEntity);
        userWishEntity.setWishEntity(wishEntity);
        userWishRepository.save(userWishEntity);
    }

}
