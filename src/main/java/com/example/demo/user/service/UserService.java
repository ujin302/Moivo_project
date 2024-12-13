package com.example.demo.user.service;

import java.util.List;
import java.util.Map;
import java.util.Optional;

import com.example.demo.user.dto.UserDTO;
import com.example.demo.user.entity.UserEntity;

public interface UserService {
    public String insert(UserDTO user);

    public Map<String, Object> login(String userId, String pwd);

    //payload에 넣을려고 만듬
    public int getWishIdById(int id); // userId로 Wish ID 조회
    public int getCartIdById(int id); //userId로 Cart ID 조회

    public void logout(String accesstoken, String refreshToken);

    public List<UserDTO> findAllUsers(); // 모든 사용자 조회
    //public void updateUserGrade(int userId, String newGrade); // 사용자 등급 업데이트

    //public void updateUserGradeBasedOnPurchase(int userId);

    public boolean validateToken(String token); // 토큰 검사 _241126_sc
    public Map<String, Object> getUserDataFromToken(String token); // 토큰에서 사용자 데이터 추출 _241127_sc
    public Map<String, Object> refreshUserToken(String userId); // 사용자 토큰 갱신 _241127_sc

    public UserEntity authenticate(String userId, String password);

    //public Optional<UserEntity> findUserById(Integer userId);

    // 사용자 정보 조회 메소드 추가
    public UserDTO findUserById(String userId);

}
