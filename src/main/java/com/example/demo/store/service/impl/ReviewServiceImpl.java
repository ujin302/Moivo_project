package com.example.demo.store.service.impl;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import com.example.demo.store.repository.ReviewRepository;
import com.example.demo.store.service.ReviewService;

@Service
public class ReviewServiceImpl implements ReviewService {

    // @Autowired
    private ReviewRepository reviewRepository;
}
