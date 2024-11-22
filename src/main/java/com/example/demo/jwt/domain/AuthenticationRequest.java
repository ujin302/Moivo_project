package com.example.demo.jwt.domain;

import lombok.Data;

@Data

public class AuthenticationRequest {
    
    private String name;
    private String pwd;
}
