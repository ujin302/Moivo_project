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
import org.springframework.http.HttpEntity;
import org.springframework.http.HttpMethod;
import org.springframework.http.ResponseEntity;
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
import org.springframework.transaction.annotation.Transactional;
import org.springframework.util.LinkedMultiValueMap;
import org.springframework.util.MultiValueMap;
import org.springframework.web.client.RestOperations;
import org.springframework.web.client.RestTemplate;
import org.springframework.http.HttpHeaders;

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

    //private final OAuthProperties oAuthProperties; //추후 Google, Naver 사용시

    private final OAuth2AuthorizedClientService authorizedClientService;
    
    @Autowired
    private UserRepository userRepository;

    @Autowired
    private RestTemplate restTemplate;


    @Override
    public OAuth2User loadUser(OAuth2UserRequest request) throws OAuth2AuthenticationException {
//        // 부모 클래스(DefaultOAuth2UserService)에서 사용자 정보 가져오기
//        OAuth2User oAuth2User = super.loadUser(request);
//
//        // 클라이언트 등록 ID (예: kakao, naver, google)
//        String registrationId = request.getClientRegistration().getRegistrationId();
//
//        // 사용자 고유 ID가 매핑된 키 (예: sub, id 등)
//        String userNameAttributeName = request.getClientRegistration()
//                .getProviderDetails().getUserInfoEndpoint().getUserNameAttributeName();
//
//        // 사용자 정보 속성
//        Map<String, Object> attributes = oAuth2User.getAttributes();
//
//        // 사용자 정보를 저장 또는 업데이트
//        saveOrUpdate(attributes, registrationId);
//
//        // OAuth2 사용자 객체 반환
//        // Spring Secrurity 사용시 ROLE_ 들어가야함
//        return new DefaultOAuth2User(
//                Collections.singleton(new SimpleGrantedAuthority("ROLE_USER")),
//                attributes,
//                userNameAttributeName);
        //------------------------------------------------------------------------------------

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
//    public String getAccessTokenReturn() {
//        Authentication authentication = SecurityContextHolder.getContext().getAuthentication();
//        if (authentication == null || !authentication.isAuthenticated()) {
//            // 인증되지 않은 사용자는 처리하지 않음
//            return "인증되지 않은 사용자입니다.";
//        }
//        System.out.println("getAccessTokenReturn authentication = " + authentication);
//        //받는거보면 getAccessTokenReturn authentication = AnonymousAuthenticationToken [Principal=anonymousUser, Credentials=[PROTECTED], Authenticated=true, Details=WebAuthenticationDetails [RemoteIpAddress=0:0:0:0:0:0:0:1, SessionId=65B989C1CD5A759B513365A16DE2C07F], Granted Authorities=[ROLE_ANONYMOUS]]
//        // Spring Security 쓰려면 Granted Authorities=[ROLE_ANONYMOUS] ROLE_USER 이런식으로 수정필요할듯
//
//        // 인증된 사용자의 액세스 토큰 처리
//        String url = "http://localhost:5173/api/user/oauth2/access-token";
//        ResponseEntity<String> response = restTemplate.getForEntity(url, String.class);
//        return response.getBody();
//    }

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
        System.out.println("responseBody = " + responseBody);
        ObjectMapper objectMapper = new ObjectMapper();
        JsonNode jsonNode = objectMapper.readTree(responseBody);

        String userid = jsonNode.get("id").asText();
        String nickname = jsonNode.get("properties")
                .get("nickname").asText();
        System.out.println(nickname);

        UserEntity userEntity = new UserEntity();
        userEntity.setUserId(userid);
        userEntity.setName(nickname);
        return userEntity;
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
        // JSON 형식으로 수신
        return userEntity;
    }

    public UserEntity loginWithKakao(String code, String provider) throws JsonProcessingException {
        // 1. 인증 코드로 액세스 토큰 발급
        System.out.println("Impl사용자 code = " + code);
        String accessToken = handleKakaoLogin(code);
        System.out.println("Impl사용자 accessToken = " + accessToken);
        // 2. 액세스 토큰으로 카카오 사용자 정보 조회
        UserEntity userEntity = handleKakaoUserInfo(accessToken);
        System.out.println("Impl사용자 userEntity = " + userEntity);

        // 3. 사용자 정보 추출
        String username = userEntity.getName();
        String userID = userEntity.getUserId();

        //getAccessTokenReturn();
        // 3. DB에 UserEntity 저장
        // 스프링 시큐리티 합치면 추후엔 ROLE_USER ROLE_KAKAO 이런식으로 바꿔줘야할듯?
        userEntity.setLoginType(UserEntity.LoginType.valueOf("KAKAO"));
//        userRepository.save(userEntity);
        return userEntity;
    }

    @Transactional
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
        SecurityContextHolder.getContext().setAuthentication(
//                new UsernamePasswordAuthenticationToken(userEntity, null, AuthorityUtils.createAuthorityList("ROLE_USER")) ROLE_KAKAO
                new UsernamePasswordAuthenticationToken(userEntity, null, AuthorityUtils.createAuthorityList("KAKAO"))
        );
        // 세션에서 인증 정보 출력
        Authentication authentication = SecurityContextHolder.getContext().getAuthentication();
        if (authentication != null) {
            Object principal = authentication.getPrincipal();
            System.out.println("Authenticated User: " + principal); // 사용자 정보 출력
            System.out.println("Authorities: " + authentication.getAuthorities()); // 권한 정보 출력
        } else {
            System.out.println("No authentication found.");
        }
    }

}
