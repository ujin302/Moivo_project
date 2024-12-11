package com.example.demo.user.service;

import java.util.Map;

public interface KakaoService {
    // 카카오 로그인 처리 및 토큰 발급
    Map<String, String> processKakaoLogin(String code);
    
    // 카카오 액세스 토큰 얻기
    String getKakaoAccessToken(String code);
    
    // 카카오 사용자 정보 얻기
    Map<String, Object> getKakaoUserInfo(String accessToken);
}   //_ 241210_yjy