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
@RequiredArgsConstructor
public class UserController {

  private final KakaoService kakaoService;

  @GetMapping("/login/oauth2/code/kakao")
  public void kakaoOauth2Callback(@RequestParam String code, HttpServletResponse response) throws IOException {
    System.out.println("[카카오 콜백] code: " + code);
    String accessToken = kakaoService.getKakaoAccessToken(code);
    System.out.println("[카카오 콜백] accessToken: " + accessToken);
    KakaoUserInfo userInfo = kakaoService.getKakaoUserInfo(accessToken);
    System.out.println("[카카오 콜백] userInfo: id=" + userInfo.getId() + ", nickname=" + userInfo.getNickname());
    Map<String, Object> responseData = kakaoService.loginOrSignup(userInfo);
    String token = (String) responseData.get("token");
    Integer userId = (Integer) responseData.get("userId");
    String nickname = userInfo.getNickname();
    if (nickname == null) {
        nickname = "";
    }
    System.out.println("[카카오 콜백] JWT token: " + token);
    System.out.println("[카카오 콜백] userId: " + userId);
    System.out.println("[카카오 콜백] nickname: " + nickname);
    String redirectUrl = String.format(
        "http://localhost:5173?token=%s&userId=%d&nickname=%s",
        token, userId, java.net.URLEncoder.encode(nickname, "UTF-8")
    );
    System.out.println("[카카오 콜백] redirectUrl: " + redirectUrl);
    response.sendRedirect(redirectUrl);
  }

  @GetMapping("/api/v1/auth/kakao")
  public ResponseEntity<Map<String, String>> getKakaoAuthUrl() {
    String kakaoUrl = "http://kauth.kakao.com/oauth/authorize" +
            "?client_id=" + kakaoService.getClientId() +
            "&redirect_uri=" + kakaoService.getRedirectUri() +
            "&response_type=code";
    System.out.println("[getKakaoAuthUrl] kakaoUrl 카카오 : " + kakaoUrl);
    Map<String, String> response = Map.of("url", kakaoUrl);
    return ResponseEntity.ok(response);
  }

  @PostMapping("/api/v1/login")
  public ResponseEntity<String> doLogin() {
    System.out.println("[로그인] /api/v1/login 요청 들어옴");
    String message = "서버 되는거지 데브툴스도 된다.";
    System.out.println("[로그인] 응답 메시지: " + message);
    return ResponseEntity.ok(message);
  }
}