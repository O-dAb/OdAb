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
import org.springframework.data.redis.core.StringRedisTemplate;
import java.util.UUID;
import java.util.concurrent.TimeUnit;
import com.fasterxml.jackson.databind.ObjectMapper;

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
    private final StringRedisTemplate redisTemplate;
    private final ObjectMapper objectMapper = new ObjectMapper();

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
        String accessToken = element.getAsJsonObject().get("access_token").getAsString();
        System.out.println("[KakaoService] accessToken: " + accessToken);
        return accessToken;
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

        Long id = element.getAsJsonObject().get("id").getAsLong();
        String nickname = profile.has("nickname") ? profile.get("nickname").getAsString() : null;
        KakaoUserInfo userInfo = new KakaoUserInfo(id, nickname);
        System.out.println("[KakaoService] userInfo: id=" + id + ", nickname=" + nickname);
        return userInfo;
    }

    /**
     * 카카오 사용자 정보로 로그인 또는 회원가입을 처리합니다.
     */
    @Transactional
    public Map<String, Object> loginOrSignup(KakaoUserInfo userInfo) {
        // 1. 회원가입/로그인 처리
        Optional<User> existingUser = userRepository.findBykakaoId(userInfo.getId());
        User user;
        boolean isNewUser = false;

        if (existingUser.isPresent()) {
            user = existingUser.get();
        } else {
            user = new User();
            user.updateKakaoId(userInfo.getId());
            user.updateUserName(userInfo.getNickname());
            user.updateCreatedAt(LocalDateTime.now());
            user.updateStatus(true);
            user.updateGrade(1);
            userRepository.save(user);
            isNewUser = true;
        }

        // 2. JWT 토큰 생성
        String token = jwtService.createToken(user);

        // 3. uuid 생성
        String uuid = UUID.randomUUID().toString();

        // 4. Redis에 JSON으로 저장 (3분 유효)
        Map<String, Object> redisData = Map.of(
            "token", token,
            "userId", user.getId(),
            "nickname", user.getUserName()
        );
        try {
            String redisValue = objectMapper.writeValueAsString(redisData);
            redisTemplate.opsForValue().set(uuid, redisValue, 3, TimeUnit.MINUTES);
        } catch (Exception e) {
            throw new RuntimeException("Redis 저장 실패", e);
        }

        // 5. uuid만 반환
        Map<String, Object> response = new HashMap<>();
        response.put("auth_code", uuid);
        response.put("isNewUser", isNewUser);
        return response;
    }

}