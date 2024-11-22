package com.example.demo.user.service.impl;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import com.example.demo.user.repository.CartRepository;
import com.example.demo.user.repository.UserRepository;
import com.example.demo.user.service.CartService;

@Service
public class CartServiceImpl implements CartService {
    @Autowired
    private UserRepository userRepository; // 사용자

    // @Autowired
    private CartRepository cartRepository; // 장바구니
}
