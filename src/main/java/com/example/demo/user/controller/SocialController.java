package com.example.demo.user.controller;

import com.example.demo.configuration.OAuthProperties;
import com.example.demo.user.entity.UserEntity;
import com.example.demo.user.service.SocialService;
import com.fasterxml.jackson.core.JsonProcessingException;
import lombok.Data;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.oauth2.client.userinfo.OAuth2UserService;
import org.springframework.ui.Model;
import org.springframework.web.bind.annotation.*;

@Data
@RestController
@RequestMapping("api/user/oauth2")
public class SocialController {

    private final OAuthProperties oAuthProperties;
    private final OAuth2UserService oAuth2UserService;

    // 소셜 로그인
    @GetMapping("/callback")
    public ResponseEntity<?> callback(@RequestParam("code") String code) {

        return new ResponseEntity<>(HttpStatus.OK);
    }

    @GetMapping("/callback/kakao")
    public UserEntity kakaoLogin(@RequestParam String code) throws JsonProcessingException {
        // code를 받아서 카카오 로그인 처리
        return SocialService.loginWithKakao(code);
    }

//    @GetMapping("/callback/{provider}")
//    public String socialLogin(@PathVariable String provider, Model model) {
//        OAuthProperties.OAuthProvider providerConfig = oAuthProperties.getProviders().get(provider);
//
//        if(providerConfig == null) {
//            throw new IllegalArgumentException("Unsupported provider: " + provider);
//        }
//        // 소셜 로그인 URL 생성 (카카오, 네이버, 구글)
//        String location = "https://kauth." + provider + ".com/oauth/authorize?response_type=code"
//                + "&client_id=" + providerConfig.getClientId()
//                + "&redirect_uri=" + providerConfig.getRedirectUri();
//        System.out.println(location);
//
//        // 모델에 URL 추가
//        model.addAttribute("location", location);
//
//        // 로그인 페이지로 리턴
//        return "login";
//      }

}


