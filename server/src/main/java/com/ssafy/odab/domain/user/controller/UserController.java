package com.ssafy.odab.domain.user.controller;

import com.ssafy.odab.domain.user.dto.KakaoUserInfo;
import com.ssafy.odab.domain.user.service.KakaoService;
import jakarta.servlet.http.HttpServletResponse;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;


import java.io.IOException;
import java.util.Map;

@RestController
@RequestMapping("/api/v1")
@RequiredArgsConstructor
public class UserController {

  private final KakaoService kakaoService;

  @GetMapping("/auth/kakao/callback")
  public void kakaoCallback(@RequestParam String code, HttpServletResponse response) throws IOException {
    // 1. 인증 코드로 액세스 토큰 받기
    String accessToken = kakaoService.getKakaoAccessToken(code);

    // 2. 액세스 토큰으로 사용자 정보 가져오기
    KakaoUserInfo userInfo = kakaoService.getKakaoUserInfo(accessToken);

    // 3. 사용자 정보로 로그인 또는 회원가입 진행
    Map<String, Object> responseData = kakaoService.loginOrSignup(userInfo);

    // 4. 필요한 데이터를 쿼리 파라미터로 전달
    String token = (String) responseData.get("token");
    Integer userId = (Integer) responseData.get("userId");
    String redirectUrl = String.format(
            "http://localhost:5173?token=%s&userId=%d",
            token, userId
    );

    // 5. 프론트엔드로 리다이렉트
    response.sendRedirect(redirectUrl);
  }


  @PostMapping("/login")
  public ResponseEntity<String> doLogin() {
    return ResponseEntity.ok("서버 되는거지 데브툴스도 된다.");
  }

  // 카카오 로그인 페이지로 리다이렉트하는 URL 제공
  @GetMapping("/auth/kakao")
  public ResponseEntity<Map<String, String>> getKakaoAuthUrl() {
    String kakaoUrl = "https://kauth.kakao.com/oauth/authorize" +
            "?client_id=" + kakaoService.getClientId() +
            "&redirect_uri=" + kakaoService.getRedirectUri() +
            "&response_type=code";

    Map<String, String> response = Map.of("url", kakaoUrl);
    return ResponseEntity.ok(response);
  }
}