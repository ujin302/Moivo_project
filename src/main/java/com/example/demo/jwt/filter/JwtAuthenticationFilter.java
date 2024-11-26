package com.example.demo.jwt.filter;

import io.jsonwebtoken.Claims;
import io.jsonwebtoken.Jws;
import io.jsonwebtoken.Jwts;
import io.jsonwebtoken.security.Keys;
import org.springframework.beans.factory.annotation.Qualifier;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.security.core.userdetails.UserDetailsService;
import org.springframework.security.web.authentication.WebAuthenticationDetailsSource;
import org.springframework.stereotype.Component;
import org.springframework.web.filter.OncePerRequestFilter;

import com.example.demo.jwt.prop.JwtProps;

import jakarta.servlet.FilterChain;
import jakarta.servlet.ServletException;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpServletResponse;
import java.io.IOException;

@Component
public class JwtAuthenticationFilter extends OncePerRequestFilter {

    private final JwtProps jwtProps;
    private final UserDetailsService userDetailsService;

    public JwtAuthenticationFilter(JwtProps jwtProps, @Qualifier("customUserDetailsService")UserDetailsService userDetailsService) {
        this.jwtProps = jwtProps;
        this.userDetailsService = userDetailsService;
    }

    @Override
    protected void doFilterInternal(HttpServletRequest request, HttpServletResponse response, FilterChain chain)
            throws ServletException, IOException {
        String header = request.getHeader("Authorization");
        if (header != null && header.startsWith("Bearer ")) {
            String jwt = header.substring(7);
            byte[] signingKey = jwtProps.getSecretKey().getBytes();

            try {
                Jws<Claims> parsedToken = Jwts.parserBuilder()
                        .setSigningKey(Keys.hmacShaKeyFor(signingKey))
                        .build()
                        .parseClaimsJws(jwt);

                String userId = parsedToken.getBody().get("uid", String.class);
                UserDetails userDetails = userDetailsService.loadUserByUsername(userId);

                UsernamePasswordAuthenticationToken authentication =
                        new UsernamePasswordAuthenticationToken(userDetails, null, userDetails.getAuthorities());
                authentication.setDetails(new WebAuthenticationDetailsSource().buildDetails(request));

                SecurityContextHolder.getContext().setAuthentication(authentication);
            } catch (Exception e) {
                logger.error("토큰 발급 안됨", e);
                response.sendError(HttpServletResponse.SC_UNAUTHORIZED, "토큰 발급 안됨");
            }
        }

        chain.doFilter(request, response);
    }
}
