package com.example.demo.jwt.prop;

import java.util.Base64;

import org.springframework.beans.factory.annotation.Value;
import org.springframework.boot.context.properties.ConfigurationProperties;
import org.springframework.stereotype.Component;

import lombok.Data;

@Data
@Component
@ConfigurationProperties("com.example.demo.jwt")
public class JwtProps {

    private String secretKey;

    @Value("${jwt.secret}")
    public void setSecretKey(String secretKey) {
        this.secretKey = Base64.getEncoder().encodeToString(secretKey.getBytes());
    }

    public String getSecretKey() {
        return secretKey;
    }

}