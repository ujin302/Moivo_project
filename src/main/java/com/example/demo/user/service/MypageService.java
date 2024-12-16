package com.example.demo.user.service;

import java.util.List;

import com.example.demo.payment.dto.PaymentDTO;
import com.example.demo.store.dto.ProductDTO;
import com.example.demo.user.dto.UserDTO;
import com.example.demo.user.dto.WishDTO;

public interface MypageService {

    public UserDTO getUserInfo(int id);

    //public List<CouponDTO> getCouponList(int id);

    public List<ProductDTO> getProductList(int userId);

    public List<WishDTO> getWishlist(int id);

    public List<PaymentDTO> getOrders(int id);

}
