package com.example.demo.user.service;

import java.util.List;
import java.util.Map;

import com.example.demo.user.dto.UserDTO;

public interface UserService {
    public int insert(UserDTO user);

    public Map<String, Object> login(String userId, String pwd);

    public void logout(String token);

    public List<UserDTO> findAllUsers(); // 모든 사용자 조회
    public void updateUserGrade(int userId, String newGrade); // 사용자 등급 업데이트

    public void updateUserGradeBasedOnPurchase(int userId);

    public UserDTO findUserById(Integer userId);
}
