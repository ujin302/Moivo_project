package com.example.demo.user.service;

import java.util.List;

import com.example.demo.user.dto.UserDTO;
import com.example.demo.user.dto.WishDTO;

public interface MypageService {

    public UserDTO getUserInfo(int userseq);

    //public List<CouponDTO> getCouponList(int userseq);

    public List<WishDTO> getWishlist(int userSeq);

    //public List<OrderDTO> getOrders(int userSeq);

}
