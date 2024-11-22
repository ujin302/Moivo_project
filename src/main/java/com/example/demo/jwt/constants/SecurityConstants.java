package com.example.demo.jwt.constants;

public final class SecurityConstants {
    
    // JWT 토큰을 HTTP 헤더에서 식별하는 데 사용되는 헤더 이름임
    public static final String TOKEN_HEADER = "Authorization";

    // JWT 토큰의 접두사. 일반적으로 "Bearer " 다음에 실제 토큰이 옴
    public static final String TOKEN_PREFIX = "Bearer ";

    // JWT 토큰의 타입을 나타내는 상수임
    public static final String TOKEN_TYPE = "JWT";
    
    // final로 설정한 이유 : 이 클래스를 상수만 정의하도록 만든겁니다.
}