package com.example.demo.user.service.impl;

import com.example.demo.user.service.AdminUserService;
import com.example.demo.user.entity.UserEntity;
import com.example.demo.user.repository.UserRepository;
import org.springframework.stereotype.Service;
import org.springframework.beans.factory.annotation.Autowired;
import java.util.Map;
import java.util.HashMap;

// 24.12.13 _ yjy
@Service
public class AdminUserServiceImpl implements AdminUserService {
    
    @Autowired
    private UserRepository userRepository;
    
    @Override
    public Map<String, Object> getUserStates() {
        Map<String, Object> states = new HashMap<>();
        
        // is_admin=0인 회원만 카운트
        long totalUsers = userRepository.countByAdminFalse();
        states.put("totalUsers", totalUsers);
        
        return states;
    }
    
    @Override
    public Map<String, Integer> getUserCountByGrade() {
        Map<String, Integer> gradeStates = new HashMap<>();
        
        // 각 등급별 회원 수 계산
        for (UserEntity.Grade grade : UserEntity.Grade.values()) {
            int count = userRepository.countByGrade(grade);
            gradeStates.put(grade.name(), count);
        }
        
        return gradeStates;
    }
}
