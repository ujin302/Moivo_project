//package com.example.demo.configuration;
//
//import org.springframework.beans.factory.annotation.Value;
//import org.springframework.boot.context.properties.ConfigurationProperties;
//import org.springframework.boot.context.properties.EnableConfigurationProperties;
//import org.springframework.stereotype.Component;
//
//import java.util.Map;
//
//현재 카카오 1개만 사용시는 이 클래스가 필요없지만 추후 확장시 클래스를 활용하는 것이 유리
//@Data가 다 먹히면 Getter, Setter 제거 가능할듯
//@Component
//@EnableConfigurationProperties
//@ConfigurationProperties(prefix = "spring.security.oauth2.client.registration.kakao")
//public class OAuthProperties {
//
//    //소셜 로그인에 필요한 정보 설정
//    private Map<String, Registration> registration;
//    private Map<String, Provider> providers;
//
//    public Map<String, Provider> getProviders() {
//        return providers;
//    }
//
//    public void setProviders(Map<String, Provider> providers) {
//        this.providers = providers;
//    }
//
//    public Map<String, Registration> getRegistration() {
//        return registration;
//    }
//    public void setRegistration(Map<String, Registration> registration) {
//        this.registration = registration;
//    }
//
//    public static class Registration {
//        private String clientId;
//        private String clientSecret;
//        private String redirectUri;
//        private String authorizationGrantType;
//        private String clientAuthenticationMethod;
//
//        public String getClientId() {
//            return clientId;
//        }
//
//        public void setClientId(String clientId) {
//            this.clientId = clientId;
//        }
//
//        public String getClientSecret() {
//            return clientSecret;
//        }
//
//        public void setClientSecret(String clientSecret) {
//            this.clientSecret = clientSecret;
//        }
//
//        public String getRedirectUri() {
//            return redirectUri;
//        }
//
//        public void setRedirectUri(String redirectUri) {
//            this.redirectUri = redirectUri;
//        }
//
//        public String getAuthorizationGrantType() {
//            return authorizationGrantType;
//        }
//
//        public void setAuthorizationGrantType(String authorizationGrantType) {
//            this.authorizationGrantType = authorizationGrantType;
//        }
//
//        public String getClientAuthenticationMethod() {
//            return clientAuthenticationMethod;
//        }
//
//        public void setClientAuthenticationMethod(String clientAuthenticationMethod) {
//            this.clientAuthenticationMethod = clientAuthenticationMethod;
//        }
//    }
//
//
//    public static class Provider {
//        private String clientId;
//        private String clientSecret;
//        private String redirectUri;
//
//        public String getClientId() {
//            return clientId;
//        }
//
//        public void setClientId(String clientId) {
//            this.clientId = clientId;
//        }
//
//        public String getClientSecret() {
//            return clientSecret;
//        }
//
//        public void setClientSecret(String clientSecret) {
//            this.clientSecret = clientSecret;
//        }
//
//        public String getRedirectUri() {
//            return redirectUri;
//        }
//
//        public void setRedirectUri(String redirectUri) {
//            this.redirectUri = redirectUri;
//        }
//    }
//}
//
//
