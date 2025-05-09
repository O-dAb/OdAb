package com.ssafy.odab.domain.user.service;

import com.google.gson.JsonElement;
import com.google.gson.JsonObject;
import com.google.gson.JsonParser;
import com.ssafy.odab.domain.user.dto.KakaoUserInfo;
import com.ssafy.odab.domain.user.entity.User;
import com.ssafy.odab.domain.user.repository.UserRepository;
import lombok.Getter;
import lombok.RequiredArgsConstructor;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.http.HttpEntity;
import org.springframework.http.HttpHeaders;
import org.springframework.http.HttpMethod;
import org.springframework.http.ResponseEntity;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.util.LinkedMultiValueMap;
import org.springframework.util.MultiValueMap;
import org.springframework.web.client.RestTemplate;

import java.time.LocalDateTime;
import java.util.HashMap;
import java.util.Map;
import java.util.Optional;

@Service
@RequiredArgsConstructor
@Getter
public class KakaoService {

    private final UserRepository userRepository;
    private final JwtService jwtService;

    @Value("${spring.security.oauth2.client.registration.kakao.client-id}")
    private String clientId;

    @Value("${spring.security.oauth2.client.registration.kakao.client-secret}")
    private String clientSecret;

    @Value("${spring.security.oauth2.client.registration.kakao.redirect-uri}")
    private String redirectUri;

    /**
     * 카카오 인증 코드로 액세스 토큰을 받아옵니다.
     */
    public String getKakaoAccessToken(String code) {
        HttpHeaders headers = new HttpHeaders();
        headers.add("Content-type", "application/x-www-form-urlencoded;charset=utf-8");

        MultiValueMap<String, String> body = new LinkedMultiValueMap<>();
        body.add("grant_type", "authorization_code");
        body.add("client_id", clientId);
        body.add("client_secret", clientSecret);
        body.add("redirect_uri", redirectUri);
        body.add("code", code);

        HttpEntity<MultiValueMap<String, String>> kakaoTokenRequest =
                new HttpEntity<>(body, headers);

        RestTemplate rt = new RestTemplate();
        ResponseEntity<String> response = rt.exchange(
                "https://kauth.kakao.com/oauth/token",
                HttpMethod.POST,
                kakaoTokenRequest,
                String.class
        );

        JsonElement element = JsonParser.parseString(response.getBody());
        return element.getAsJsonObject().get("access_token").getAsString();
    }

    /**
     * 카카오 액세스 토큰으로 사용자 정보를 가져옵니다.
     */
    public KakaoUserInfo getKakaoUserInfo(String accessToken) {
        HttpHeaders headers = new HttpHeaders();
        headers.add("Authorization", "Bearer " + accessToken);
        headers.add("Content-type", "application/x-www-form-urlencoded;charset=utf-8");

        HttpEntity<MultiValueMap<String, String>> kakaoUserInfoRequest = new HttpEntity<>(headers);

        RestTemplate rt = new RestTemplate();
        ResponseEntity<String> response = rt.exchange(
                "https://kapi.kakao.com/v2/user/me",
                HttpMethod.POST,
                kakaoUserInfoRequest,
                String.class
        );

        JsonElement element = JsonParser.parseString(response.getBody());
        JsonObject kakaoAccount = element.getAsJsonObject().get("kakao_account").getAsJsonObject();
        JsonObject profile = kakaoAccount.getAsJsonObject("profile");

        Integer id = element.getAsJsonObject().get("id").getAsInt();
        String nickname = profile.has("nickname") ? profile.get("nickname").getAsString() : null;
        KakaoUserInfo userInfo = new KakaoUserInfo(id, nickname);
        return userInfo;
    }

    /**
     * 카카오 사용자 정보로 로그인 또는 회원가입을 처리합니다.
     */
    @Transactional
    public Map<String, Object> loginOrSignup(KakaoUserInfo userInfo) {
        // 이미 가입된 사용자인지 확인
        Optional<User> existingUser = userRepository.findBykakaoId(userInfo.getId());

        User user;
        boolean isNewUser = false;

        if (existingUser.isPresent()) {
            // 기존 사용자라면 정보 업데이트 (필요한 경우)
            user = existingUser.get();
            // 필요시 업데이트 로직 추가
        } else {
            // 신규 사용자라면 회원가입
            user = new User();
            user.updateKakaoId(userInfo.getId());
            user.updateUserName(userInfo.getNickname());
            user.updateCreatedAt(LocalDateTime.now());
            user.updateStatus(true);
            user.updateGrade(1); // 학년 일단 1로 설정

            userRepository.save(user);
            isNewUser = true;
        }

        // JWT 토큰 생성
        String token = jwtService.createToken(user);

        // 응답 데이터 구성
        Map<String, Object> response = new HashMap<>();
        response.put("token", token);
        response.put("userId", user.getId());
        response.put("userName", user.getUserName());
        response.put("isNewUser", isNewUser);

        return response;
    }

}