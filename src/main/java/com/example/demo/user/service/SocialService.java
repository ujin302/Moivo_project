package com.example.demo.user.service;

import java.util.Map;

public interface SocialService {

    public String getKakaoURI();

    public Map<String, Object> getKakaoLogin(String code);

}
