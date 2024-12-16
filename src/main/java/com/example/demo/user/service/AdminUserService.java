package com.example.demo.user.service;

import java.util.Map;

public interface AdminUserService {
    // 회원 현황 통계 조회
    public Map<String, Object> getUserStates();
    
    // 등급별 회원 수 조회
    public Map<String, Integer> getUserCountByGrade();
}
