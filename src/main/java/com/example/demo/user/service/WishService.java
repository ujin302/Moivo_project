package com.example.demo.user.service;

import java.util.List;

import com.example.demo.store.entity.ProductEntity;

public interface WishService {

    public void addProduct(int productId, int userId);

    public List<ProductEntity> printWish(int userId);

    public void deleteProduct(int productId, int userId);

}
