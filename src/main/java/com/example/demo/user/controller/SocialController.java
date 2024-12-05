package com.example.demo.user.controller;

//import com.example.demo.configuration.OAuthProperties;

import com.example.demo.security.handler.CustomOAuth2User;
import com.example.demo.security.utils.SecurityUtils;
import com.example.demo.user.entity.UserEntity;
import com.example.demo.user.service.SocialService;

import com.fasterxml.jackson.core.JsonProcessingException;
import lombok.RequiredArgsConstructor;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.security.oauth2.client.OAuth2AuthorizedClient;
import org.springframework.security.oauth2.client.OAuth2AuthorizedClientService;
import org.springframework.security.oauth2.client.userinfo.OAuth2UserService;
import org.springframework.security.oauth2.client.web.OAuth2LoginAuthenticationFilter;
import org.springframework.security.oauth2.core.user.OAuth2User;
import org.springframework.stereotype.Controller;
import org.springframework.web.bind.annotation.*;

@Controller
@RequestMapping("api/user")
@RequiredArgsConstructor
public class SocialController {

//    private final OAuthProperties oAuthProperties; // 추후 OAuth 구글, 네이버 로그인 추가시 사용

    private final SocialService socialService;
    private SecurityUtils securityUtils; // OAuth 로그인, 일반로그인 체크

    @Autowired
    private OAuth2AuthorizedClientService authorizedClientService;

    @GetMapping("/kakao")
    public String kakaoLogin() {

        // 소셜 로그인 URL 생성
        String location = "https://kauth." + "kakao" + ".com/oauth/authorize?response_type=code"
                + "&client_id=714a575754949434c7f9e10bb527da9a"
                + "&redirect_uri=http://localhost:5173/api/user/oauth2/callback/kakao";
        return "redirect:" + location;
    }


    @GetMapping("/oauth2/callback/{provider}")
    public String socialLogin(@PathVariable String provider, @RequestParam String code) throws JsonProcessingException {

        // 소셜 로그인 처리
        UserEntity userEntity = socialService.loginWithKakao(code, provider);
        System.out.println("Controller userEntity = " + userEntity);
        // OAuth2 인증 및 사용자 정보 가져오기
        // userEntity는 OAuth2User로 형변환 안돼서 CustomOAuth2User 클래스 생성
        OAuth2User oAuth2User = new CustomOAuth2User(userEntity);

        System.out.println("Controller oAuth2User = " + oAuth2User);

        // Authentication 객체 생성
        UsernamePasswordAuthenticationToken authentication =
                new UsernamePasswordAuthenticationToken(oAuth2User, null, oAuth2User.getAuthorities());

        System.out.println("Controller authentication = " + authentication);
        // SecurityContext에 설정
        SecurityContextHolder.getContext().setAuthentication(authentication);
        System.out.println("Controller SecurityContextHolder.getContext().getAuthentication() = " + SecurityContextHolder.getContext().getAuthentication());
        System.out.println("Controller SecurityContextHolder.getContext().getAuthentication() = 이 Oauth2AuthenticationToken이 저장되어야함");
        //설정까진 됐는데 유지가 안되는지 anonymous로 초기화됨 이유모름

        //OAuth2 확인
        if (securityUtils.isOAuthLogin()) {
            System.out.println(securityUtils.isOAuthLogin() + " Oauth 로그인");

        } else {
            System.out.println(securityUtils.isOAuthLogin() + "일반 로그인");
        }

        System.out.println("securityUtils.isOAuthLogin() = " + securityUtils.isOAuthLogin());
        socialService.saveOrUpdateUser(userEntity); //저장하면서 void라 사라지는건가 ? 아 모르것다~
        System.out.println("securityUtils.isOAuthLogin() = " + securityUtils.isOAuthLogin());

        // 로그인 페이지로 리턴
        if (securityUtils.isOAuthLogin()) {
            //true일떄
            System.out.println("정상");
        return "redirect:" + "http://localhost:5173";
        } else {
            //여기오면 망한다
            return "redirect:" + "http://localhost:5173/user";
        }
    }

    @PostMapping("/oauth2/access-token")
    public String getAccessToken(Authentication authentication) {
        return socialService.getUserAccessToken(authentication);
    }

}


