package com.example.demo.user.service;

import com.example.demo.user.entity.UserEntity;
import com.fasterxml.jackson.core.JsonProcessingException;

public interface SocialService {

    UserEntity loginWithKakao(String code, String provider) throws JsonProcessingException;

    public void saveOrUpdateUser(UserEntity userEntity);
}
