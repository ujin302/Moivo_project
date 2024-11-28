package com.example.demo.user.service.impl;

import com.example.demo.configuration.OAuthProperties;
import com.example.demo.user.entity.UserEntity;
import com.example.demo.user.repository.UserRepository;
import com.example.demo.user.service.SocialService;
import com.fasterxml.jackson.core.JsonProcessingException;
import com.fasterxml.jackson.databind.JsonNode;
import com.fasterxml.jackson.databind.ObjectMapper;
import lombok.RequiredArgsConstructor;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpEntity;
import org.springframework.http.HttpMethod;
import org.springframework.http.ResponseEntity;
import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder;
import org.springframework.security.oauth2.client.userinfo.DefaultOAuth2UserService;
import org.springframework.security.oauth2.client.userinfo.OAuth2UserRequest;
import org.springframework.security.oauth2.core.OAuth2AuthenticationException;
import org.springframework.security.oauth2.core.user.OAuth2User;
import org.springframework.stereotype.Service;
import org.springframework.util.LinkedMultiValueMap;
import org.springframework.util.MultiValueMap;
import org.springframework.web.client.RestTemplate;
import org.springframework.http.HttpHeaders;


@Service
@RequiredArgsConstructor
public class OAuth2UserServiceImpl extends DefaultOAuth2UserService implements SocialService {

    private final OAuthProperties oAuthProperties;
    private OAuth2UserServiceImpl oAuth2UserService;


    @Override
    public OAuth2User loadUser(OAuth2UserRequest request) throws OAuth2AuthenticationException {

        System.out.println("getClientRegistration = " + request.getClientRegistration());
        System.out.println("getAccess Token = " + request.getAccessToken().getTokenValue());

        OAuth2User oAuth2User = super.loadUser(request);
        //구글로그인 버튼 클릭 -> 구글 로그인 창 -> 로그인 완료 -> code 리턴 -> AccessToken 요청
        System.out.println("getAttributes = " + oAuth2User.getAttributes());

//        String provider = request.getClientRegistration().getRegistrationId();
//        String providerId = oAuth2User.getAttribute("sub");
        String addr1 = request.getClientRegistration().getRegistrationId();
        String addr2 = oAuth2User.getAttribute("sub");
//        String username = provider + "-" + providerId;
        String username = addr1 + "-" + addr2;
        //String password = bCryptPasswordEncoder
        String email = oAuth2User.getAttribute("email");
        //String Role = "ROLE_USER";

        return oAuth2User;
    }

    public String getAccessToken(String code, String provider) throws JsonProcessingException {
        // HTTP Header 생성
        HttpHeaders headers = new HttpHeaders();
        headers.add("Content-type", "application/x-www-form-urlencoded;charset=utf-8");

        OAuthProperties.OAuthProvider providerConfig = oAuthProperties.getProviders().get(provider);
        // HTTP Body 생성
        MultiValueMap<String, String> body = new LinkedMultiValueMap<>();
        body.add("grant_type", "authorization_code");
        body.add("client_id", providerConfig.getClientId());
        body.add("redirect_uri", providerConfig.getRedirectUri());
        body.add("code", code);
        body.add("client_secret", providerConfig.getClientSecret());

        // HTTP 요청 보내기
        HttpEntity<MultiValueMap<String, String>> kakaoTokenRequest = new HttpEntity<>(body, headers);
        RestTemplate rt = new RestTemplate();
        ResponseEntity<String> response = rt.exchange(
                "https://kauth.kakao.com/oauth/token",
                HttpMethod.POST,
                kakaoTokenRequest,
                String.class
        );

        // HTTP 응답 (JSON) -> 액세스 토큰 파싱
        String responseBody = response.getBody();
        ObjectMapper objectMapper = new ObjectMapper();
        JsonNode jsonNode = objectMapper.readTree(responseBody);

        return jsonNode.get("access_token").asText();
    }

    public UserEntity getKakaoEntity(String accessToken) throws JsonProcessingException {
        // HTTP Header 생성
        HttpHeaders headers = new HttpHeaders();
        headers.add("Authorization", "Bearer " + accessToken);
        headers.add("Content-type", "application/x-www-form-urlencoded;charset=utf-8");

        // HTTP 요청 보내기
        HttpEntity<MultiValueMap<String, String>> kakaoUserEntityRequest = new HttpEntity<>(headers);
        RestTemplate rt = new RestTemplate();
        ResponseEntity<String> response = rt.exchange(
                "https://kapi.kakao.com/v2/user/me",
                HttpMethod.POST,
                kakaoUserEntityRequest,
                String.class
        );

        // responseBody에 있는 정보 꺼내기
        String responseBody = response.getBody();
        ObjectMapper objectMapper = new ObjectMapper();
        JsonNode jsonNode = objectMapper.readTree(responseBody);

        Long id = jsonNode.get("id").asLong();
        String email = jsonNode.get("kakao_account").get("email").asText();
        String nickname = jsonNode.get("properties")
                .get("nickname").asText();

        return UserEntity.toSaveKakaoUserEntity(jsonNode);
    }

    public String handleKakaoLogin(String code) throws JsonProcessingException {
        String provider = "kakao";  // 카카오는 provider로 "kakao"를 사용
        // getAccessToken을 호출하여 액세스 토큰을 얻음
        String accessToken = getAccessToken(code, provider);
        return accessToken;  // 액세스 토큰을 반환
    }

    public UserEntity handleKakaoUserInfo(String accessToken) throws JsonProcessingException {
        // 액세스 토큰을 사용하여 카카오 사용자 정보를 가져옴
        UserEntity userEntity = getKakaoEntity(accessToken);

        // UserEntity에는 카카오 로그인 정보가 저장됨
        return userEntity;
    }

    public UserEntity loginWithKakao(String code) throws JsonProcessingException {
        // Step 1: 인증 코드로 액세스 토큰 발급
        String accessToken = oAuth2UserService.handleKakaoLogin(code);

        // Step 2: 액세스 토큰으로 카카오 사용자 정보 조회
        UserEntity userEntity = oAuth2UserService.handleKakaoUserInfo(accessToken);

        // Step 3: UserEntity 저장 혹은 필요한 후속 작업
        // 예: userRepository.save(userEntity);

        return userEntity;
    }
}
