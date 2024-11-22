package com.example.demo.jwt.prop;

import java.util.Base64;

import org.springframework.boot.context.properties.ConfigurationProperties;
import org.springframework.stereotype.Component;

import lombok.Data;

@Data
@Component
@ConfigurationProperties("com.example.demo.jwt")
public class JwtProps {

    //이 시크릿 키는 인코딩된 시크릿 키임...정확히 뭐라 설명해야할지를 모르겠네여...
    private String secretKey;

}
