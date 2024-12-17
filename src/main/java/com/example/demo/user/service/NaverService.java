package com.example.demo.user.service;

import com.example.demo.configuration.SocialConfiguration;
import com.example.demo.user.dto.KakaoTokenDTO;
import com.example.demo.user.dto.UserDTO;

public interface NaverService {

    KakaoTokenDTO getToken(String code, SocialConfiguration socialConfig);

    UserDTO getUserInfo(String kakaoAccessToken, String kakaoUserInfoUri);

}
