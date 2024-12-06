package com.example.demo.user.service.impl;

//import com.example.demo.configuration.OAuthProperties;
import com.example.demo.user.entity.UserEntity;
import com.example.demo.user.repository.UserRepository;
import com.example.demo.user.service.SocialService;
import com.fasterxml.jackson.core.JsonProcessingException;
import com.fasterxml.jackson.databind.JsonNode;
import com.fasterxml.jackson.databind.ObjectMapper;
import lombok.RequiredArgsConstructor;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.http.*;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.authority.AuthorityUtils;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.security.oauth2.client.OAuth2AuthorizedClient;
import org.springframework.security.oauth2.client.OAuth2AuthorizedClientService;
import org.springframework.security.oauth2.client.userinfo.DefaultOAuth2UserService;
import org.springframework.security.oauth2.client.userinfo.OAuth2UserRequest;
import org.springframework.security.oauth2.core.OAuth2AuthenticationException;
import org.springframework.security.oauth2.core.user.OAuth2User;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Propagation;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.util.LinkedMultiValueMap;
import org.springframework.util.MultiValueMap;
import org.springframework.web.client.HttpClientErrorException;
import org.springframework.web.client.RestOperations;
import org.springframework.web.client.RestTemplate;

import java.util.Optional;


@Service
@RequiredArgsConstructor
//카카오 소셜
public class OAuth2UserServiceImpl extends DefaultOAuth2UserService implements SocialService {

    @Value("${spring.security.oauth2.client.registration.kakao.client-id}")
    private String clientId;
    @Value("${spring.security.oauth2.client.registration.kakao.client-secret}")
    private String clientSecret;
    @Value("${spring.security.oauth2.client.registration.kakao.redirect-uri}")
    private String redirectUri;

    //private final OAuthProperties oAuthProperties; //현재 사용 X 추후 Google, Naver 사용시

    private final OAuth2AuthorizedClientService authorizedClientService;

    @Autowired
    private UserRepository userRepository;

    @Autowired
    private RestTemplate restTemplate;

    public String getAccessTokenReturn() {
        Authentication authentication = SecurityContextHolder.getContext().getAuthentication();
        if (authentication == null || !authentication.isAuthenticated()) {
            // 인증되지 않은 사용자는 처리하지 않음
            return "인증되지 않은 사용자입니다.";
        }
        System.out.println("getAccessTokenReturn authentication = " + authentication);
        //받는거보면 getAccessTokenReturn authentication = AnonymousAuthenticationToken [Principal=anonymousUser, Credentials=[PROTECTED], Authenticated=true, Details=WebAuthenticationDetails [RemoteIpAddress=0:0:0:0:0:0:0:1, SessionId=65B989C1CD5A759B513365A16DE2C07F], Granted Authorities=[ROLE_ANONYMOUS]]
        // Spring Security 쓰려면 Granted Authorities=[ROLE_ANONYMOUS] ROLE_USER 이런식으로 수정필요할듯

        // 인증된 사용자의 액세스 토큰 처리
        String url = "https://kauth.kakao.com/oauth/token";
        ResponseEntity<String> response = restTemplate.getForEntity(url, String.class);
        return response.getBody();
    }

    // 인증된 사용자의 액세스 토큰을 가져오는 메서드
    public String getUserAccessToken(Authentication authentication) {
        // 클라이언트 등록 ID (여기서는 kakao), 사용자 ID (authentication.getName())
        OAuth2AuthorizedClient authorizedClient = authorizedClientService.loadAuthorizedClient(
                "kakao",  // clientRegistrationId (application.yml에 설정된 이름)
                authentication.getName()  // 현재 인증된 사용자의 이름
        );
        System.out.println("Impl authorizedClient .getAccessToken().getTokenValue() = " + authorizedClient.getAccessToken().getTokenValue());

        // 액세스 토큰이 존재하면 반환
        if (authorizedClient != null) {
            return authorizedClient.getAccessToken().getTokenValue();
        }

        // 액세스 토큰이 없으면 메시지 반환
        return "Access token 없음";
    }

    //사용자가 카카오 계정으로 인증되었음을 증명받음
    //카카오 로그인 코드로 액세스 토큰 요청
    public String getAccessToken(String code, String provider) throws JsonProcessingException {

        // HTTP Header 생성
        HttpHeaders headers = new HttpHeaders();
        headers.add("Accept", "application/json");
        headers.add("Content-type", "application/x-www-form-urlencoded;charset=utf-8");
        System.out.println("provider" + provider);

        // HTTP Body 생성
        MultiValueMap<String, String> body = new LinkedMultiValueMap<>();
        body.add("grant_type", "authorization_code");
        body.add("client_id", clientId);
        body.add("redirect_uri", redirectUri);
        body.add("code", code);
        body.add("client_secret", clientSecret);

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

    //카카오 로그인 처리
    public String handleKakaoLogin(String code) throws JsonProcessingException {
        String provider = "kakao";  // 카카오는 provider로 "kakao"를 사용
        // getAccessToken을 호출하여 액세스 토큰을 얻음
        return getAccessToken(code, provider);  // 액세스 토큰을 반환
    }

    public UserEntity handleKakaoUserInfo(String accessToken, String code) throws JsonProcessingException {
        // 액세스 토큰을 사용하여 카카오 사용자 정보를 가져옴
        //UserEntity userEntity = getKakaoEntity(accessToken);
        // 필수 파라미터 로그 출력
        System.out.println("client_id: " + clientId);
        System.out.println("redirect_uri: " + redirectUri);
        System.out.println("access_token: " + accessToken);
        System.out.println("code: " + code);

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

        // 응답 확인
        System.out.println("Response Code: " + response.getStatusCode());
        System.out.println("Response Body: " + response.getBody());

        // 만약 401 오류가 발생하면, 액세스 토큰을 갱신해야 함
        if (response.getStatusCode() == HttpStatus.UNAUTHORIZED) {
            System.out.println("Access token expired, requesting a new one.");
            // refresh_token을 사용하여 새 토큰 발급
        }

        // responseBody에 있는 정보 꺼내기
        String responseBody = response.getBody();
        System.out.println("responseBody = " + responseBody);
        ObjectMapper objectMapper = new ObjectMapper();
        JsonNode jsonNode = objectMapper.readTree(responseBody);

        String userid = jsonNode.get("id").asText();
        String nickname = jsonNode.get("properties")
                .get("nickname").asText();
        System.out.println("Impl handleKakaoUserInfo" + nickname);

        UserEntity userEntity = new UserEntity();
        userEntity.setUserId(userid);
        userEntity.setName(nickname);

        // UserEntity에는 카카오 로그인 정보가 저장됨
        // JSON 형식으로 수신
        return userEntity;
    }

    public UserEntity loginWithKakao(String code, String provider) throws JsonProcessingException {
        // 1. 인증 코드로 액세스 토큰 발급
        System.out.println("Impl사용자 code = " + code);
        System.out.println("reUrl" + redirectUri);
        String accessToken = null;
        try {
            accessToken = handleKakaoLogin(code);
        } catch (HttpClientErrorException e){
            System.err.println("Login Error Code = " +e.getStackTrace());
            System.err.println("Login Response Body = " + e.getResponseBodyAsString());
            throw e;
        }
        System.out.println("Impl사용자 accessToken = " + accessToken);

        // 2. 액세스 토큰으로 카카오 사용자 정보 조회
        UserEntity userEntity = handleKakaoUserInfo(accessToken, code);
        System.out.println("Impl사용자 userEntity = " + userEntity);

        // 3. 사용자 정보 추출
        String username = userEntity.getName();
        String userID = userEntity.getUserId();

        getAccessTokenReturn();
        // 3. DB에 UserEntity 저장
        // 스프링 시큐리티 합치면 추후엔 ROLE_USER ROLE_KAKAO 이런식으로 바꿔줘야할듯?
        userEntity.setLoginType(UserEntity.LoginType.valueOf("KAKAO"));
//        userRepository.save(userEntity);

        // 4 Security Debug
        Authentication authentication = SecurityContextHolder.getContext().getAuthentication();
        if (authentication != null) {
            System.out.println("Impl Login Authenticated = " + authentication.getName());
        } else {
            System.out.println("Authentication failed or not set.");
        }
        return userEntity;
    }

    @Transactional(propagation = Propagation.REQUIRED)
    public void saveOrUpdateUser(UserEntity userEntity) {
        //사용자 존재여부 확인
        Optional<UserEntity> existingUser = userRepository.findByUserId(userEntity.getUserId());

        if (existingUser.isPresent()) {
            // 이미 존재하는 사용자일 경우 업데이트
            UserEntity userToUpdate = existingUser.get();
            userToUpdate.setName(userEntity.getName());
            userToUpdate.setLoginType(userEntity.getLoginType());
            // 필요한 다른 필드들 업데이트
            userRepository.save(userToUpdate);
        } else {
            // 새로운 사용자 삽입
            userRepository.save(userEntity);
        }

        // 로그인 상태로 설정 (세션에 사용자 정보 추가)
//        SecurityContextHolder.getContext().setAuthentication(
////                new UsernamePasswordAuthenticationToken(userEntity, null, AuthorityUtils.createAuthorityList("ROLE_USER")) ROLE_KAKAO
//                new UsernamePasswordAuthenticationToken(userEntity, null, AuthorityUtils.createAuthorityList("KAKAO"))
//        );
//        // 세션에서 인증 정보 출력
//        Authentication authentication = SecurityContextHolder.getContext().getAuthentication();
//        if (authentication != null) {
//            Object principal = authentication.getPrincipal();
//            System.out.println("Impl Authenticated User: " + principal); // 사용자 정보 출력
//            System.out.println("Impl Authorities: " + authentication.getAuthorities()); // 권한 정보 출력
//        } else {
//            System.out.println("No authentication found.");
//        }
    }

}
