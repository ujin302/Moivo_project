package com.example.demo.store.service;

import com.example.demo.store.dto.ReviewDTO;

public interface ReviewService {

    void insertReview(ReviewDTO reviewDTO, int userid, int productid);

}
