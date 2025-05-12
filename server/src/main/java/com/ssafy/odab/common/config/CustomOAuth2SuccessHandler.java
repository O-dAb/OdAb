package com.ssafy.odab.common.config;

import com.ssafy.odab.domain.user.dto.KakaoUserInfo;
import com.ssafy.odab.domain.user.service.KakaoService;
import com.ssafy.odab.domain.user.service.JwtService;
import lombok.RequiredArgsConstructor;
import org.springframework.security.core.Authentication;
import org.springframework.security.oauth2.core.user.OAuth2User;
import org.springframework.security.web.authentication.AuthenticationSuccessHandler;
import org.springframework.stereotype.Component;

import jakarta.servlet.ServletException;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpServletResponse;
import java.io.IOException;
import java.util.Map;

@Component
@RequiredArgsConstructor
public class CustomOAuth2SuccessHandler implements AuthenticationSuccessHandler {

    private final KakaoService kakaoService;

    @Override
    public void onAuthenticationSuccess(HttpServletRequest request, HttpServletResponse response,
                                        Authentication authentication) throws IOException, ServletException {
        // 1. 카카오 사용자 정보 추출
        OAuth2User oAuth2User = (OAuth2User) authentication.getPrincipal();
        String kakaoId = oAuth2User.getAttribute("id").toString();
        String nickname = ((Map<String, Object>) oAuth2User.getAttribute("properties")).get("nickname").toString();

        // 2. KakaoUserInfo 객체 생성
        KakaoUserInfo userInfo = new KakaoUserInfo(Long.parseLong(kakaoId), nickname);

        // 3. 회원가입/로그인 처리 및 JWT 발급
        Map<String, Object> responseData = kakaoService.loginOrSignup(userInfo);
        String jwtToken = (String) responseData.get("token");
        Integer userId = (Integer) responseData.get("userId");

        // 4. 프론트엔드로 리다이렉트 (JWT 토큰 전달)
        String redirectUrl = String.format("http://localhost:5173?token=%s&userId=%d", jwtToken, userId);
        response.sendRedirect(redirectUrl);
    }
}
