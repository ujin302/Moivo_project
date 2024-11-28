package com.example.demo.user.service;

import java.util.List;
import java.util.Map;

import com.example.demo.user.dto.WishDTO;

public interface WishService {

    public void addProduct(int productId, int userId);

    public Map<String, Object> printWish(int userId);

    public void deleteProduct(int productId, int userId);

}
