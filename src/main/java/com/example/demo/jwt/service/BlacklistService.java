package com.example.demo.jwt.service;

import com.example.demo.jwt.entity.BlacklistEntity;
import com.example.demo.jwt.repository.BlacklistRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.Date;

@Service
public class BlacklistService {
    
    @Autowired
    private BlacklistRepository blacklistRepository;
    
    public void addToBlacklist(String token, Date expiryDate) {
        BlacklistEntity blacklistEntity = new BlacklistEntity();
        blacklistEntity.setToken(token);
        blacklistEntity.setExpiryDate(expiryDate);
        blacklistRepository.save(blacklistEntity);
    }
    
    public boolean isTokenBlacklisted(String token) {
        return blacklistRepository.existsByToken(token);
    }
}