package com.example.demo.security.handler;

import jakarta.servlet.ServletException;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpServletResponse;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.security.web.authentication.AuthenticationSuccessHandler;
import org.springframework.security.web.authentication.SimpleUrlAuthenticationSuccessHandler;
import org.springframework.stereotype.Component;

import java.io.IOException;

@Component
public class CustomAuthenticationSuccessHandler extends SimpleUrlAuthenticationSuccessHandler implements AuthenticationSuccessHandler {

    @Override
    public void onAuthenticationSuccess(HttpServletRequest request, HttpServletResponse response, Authentication authentication) throws IOException, ServletException {
        // 1. SecurityContextHolder에 인증 정보 설정
        SecurityContextHolder.getContext().setAuthentication(authentication);
        System.out.println("CustomAuthenticationSuccessHandler" + authentication);

        System.out.println("저장하려는" +authentication.getPrincipal());
        // 2. 인증 정보를 세션에 저장
        request.getSession().setAttribute("SPRING_SECURITY_CONTEXT", SecurityContextHolder.getContext());
        response.sendRedirect( "redirect:" + "http://localhost:5173" + authentication.getName());

        // 3. 인증 성공 후 추가 작업
        System.out.println("SPRINGSECURITYCONTEXT");
        System.out.println(request.getSession().getAttribute("SPRING_SECURITY_CONTEXT"));

        request.getSession().setAttribute("user", authentication.getPrincipal());


        super.onAuthenticationSuccess(request, response, authentication);
    }


}