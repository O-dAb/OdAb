package com.ssafy.odab.domain.user.controller;

import com.ssafy.odab.domain.user.dto.KakaoUserInfo;
import com.ssafy.odab.domain.user.dto.ProfileImageResponse;
import com.ssafy.odab.domain.user.service.JwtService;
import com.ssafy.odab.domain.user.service.KakaoService;
import com.ssafy.odab.domain.user.service.UserService;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpServletResponse;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import org.springframework.http.ResponseCookie;

import org.springframework.data.redis.core.StringRedisTemplate;
import java.util.UUID;
import java.util.concurrent.TimeUnit;
import java.io.IOException;
import org.springframework.web.multipart.MultipartFile;

import java.io.IOException;
import java.util.Map;
import com.fasterxml.jackson.databind.ObjectMapper;
import org.springframework.beans.factory.annotation.Value;

@RestController
@RequiredArgsConstructor
public class UserController {

    private final KakaoService kakaoService;
    private final UserService userService;
    private final JwtService jwtService;
    private final StringRedisTemplate redisTemplate;

    @Value("${client-base-url}")
    private String clientBaseUrl;
    
    /**
     * 토큰에서 사용자 ID를 추출합니다.
     */
    private Integer getUserIdFromToken(HttpServletRequest request) {
        String authHeader = request.getHeader("Authorization");
        System.out.println("Authorization 헤더: " + authHeader); // 디버깅용 로그

        if (authHeader != null && authHeader.startsWith("Bearer ")) {
            String token = authHeader.substring(7);
            System.out.println("추출된 토큰: " + token); // 디버깅용 로그

            // 토큰 유효성 검증 추가
            if (jwtService.validateAccessToken(token)) {
                Integer userId = jwtService.getUserIdFromAccessToken(token);
                System.out.println("추출된 사용자 ID: " + userId); // 디버깅용 로그
                return userId;
            } else {
                System.out.println("토큰 유효성 검증 실패"); // 디버깅용 로그
            }
        } else {
            System.out.println("Authorization 헤더가 없거나 Bearer 형식이 아님"); // 디버깅용 로그
        }
        throw new RuntimeException("유효한 인증 토큰이 없습니다.");
    }

    @GetMapping("/login/oauth2/code/kakao")
    public void kakaoOauth2Callback(@RequestParam("code") String code, HttpServletResponse response) throws IOException {
        String accessToken = kakaoService.getKakaoAccessToken(code);
        KakaoUserInfo userInfo = kakaoService.getKakaoUserInfo(accessToken);
        System.out.println("[카카오 콜백] code: " + code);
        System.out.println("[카카오 콜백] accessToken: " + accessToken);
        System.out.println("[카카오 콜백] userInfo: id=" + userInfo.getId() + ", nickname=" + userInfo.getNickname());
        Map<String, Object> responseData = kakaoService.loginOrSignup(userInfo);
        String refreshToken = (String) responseData.get("refreshToken");
        String uuid = (String) responseData.get("auth_code");
        String redirectUrl = String.format(clientBaseUrl + "/?auth_code=%s", uuid);
        // 쿠키로 내려주기
        ResponseCookie cookie = ResponseCookie.from("refreshToken", refreshToken)
            .httpOnly(true)
            .secure(true)
            .path("/")
            .maxAge(60 * 60 * 24 * 14)
            .sameSite("Strict")
            .build();
        response.addHeader("Set-Cookie", cookie.toString());
        response.sendRedirect(redirectUrl);
    }

    @GetMapping("/api/v1/auth/kakao")
    public ResponseEntity<Map<String, String>> getKakaoAuthUrl() {
        String kakaoUrl = "https://kauth.kakao.com/oauth/authorize" +
                "?client_id=" + kakaoService.getClientId() +
                "&redirect_uri=" + kakaoService.getRedirectUri() +
                "&response_type=code";
        System.out.println("[getKakaoAuthUrl] kakaoUrl 카카오 : " + kakaoUrl);
        Map<String, String> response = Map.of("url", kakaoUrl);
        return ResponseEntity.ok(response);
    }

    // 프론트가 uuid로 토큰/유저정보 요청
    @GetMapping("/api/auth/result")
    public ResponseEntity<?> getAuthResult(@RequestParam("auth_code") String authCode) throws IOException {
        String redisValue = redisTemplate.opsForValue().get(authCode);
        if (redisValue == null) {
            return ResponseEntity.status(HttpStatus.GONE).body("만료되었거나 잘못된 인증 코드입니다.");
        }
        ObjectMapper objectMapper = new ObjectMapper();
        Map<String, Object> result = objectMapper.readValue(redisValue, Map.class);
        System.out.println("[getAuthResult] Redis에서 꺼낸 정보: " + result);
        return ResponseEntity.ok(result);
    }

    /**
     * 사용자의 프로필 이미지를 업로드하고 저장합니다.
     *
     * @param file 업로드할 이미지 파일
     * @return 저장된 이미지 URL을 포함한 응답
     */
    @PutMapping("/api/v1/profile_img")
    public ResponseEntity<ProfileImageResponse> saveProfileImg(@RequestParam("file") MultipartFile file, HttpServletRequest request) {
        try {
            // 토큰에서 사용자 ID추출
//      Integer userId = getUserIdFromToken(request);
            Integer userId = 1;

            String imageUrl = userService.saveProfileImg(userId, file);
            return ResponseEntity.ok(new ProfileImageResponse(imageUrl));
        } catch (Exception e) {
            e.printStackTrace();
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).build();
        }
    }
    /**
     * 사용자의 학년 정보를 업데이트합니다.
     *
     * @param gradeMap 업데이트할 학년 정보를 포함한 맵 (key: "grade", value: 학년값)
     * @return 업데이트 결과 메시지를 포함한 응답
     */
    @PutMapping("/api/v1/profile_grade")
    public ResponseEntity<?> updateGrade(@RequestBody Map<String, Integer> gradeMap, HttpServletRequest request) {
        try {
            // 토큰에서 사용자 ID추출
//      Integer userId = getUserIdFromToken(request);
            Integer userId = 1;
            Integer grade = gradeMap.get("grade");

            // 유효성 검사: 학년 정보가 제공되지 않은 경우
            if (grade == null) {
                return ResponseEntity.badRequest()
                        .body(Map.of("message", "학년 정보가 제공되지 않았습니다."));
            }

            // 서비스 호출하여 학년 정보 업데이트
            userService.updateGrade(userId, grade);
            // 성공 응답 반환
            Map<String, Object> response = Map.of(
                    "message", "학년이 성공적으로 업데이트 되었습니다."
            );
            return ResponseEntity.ok(response);
        } catch (Exception e) {
            e.printStackTrace();
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body(Map.of("message", "학년 업데이트 중 오류가 발생했습니다."));
        }
    }

    @GetMapping("/api/auth/user-id")
    public ResponseEntity<Integer> getUserIdFromAccessToken(@RequestParam("token") String token) {
        Integer userId = jwtService.getUserIdFromAccessToken(token);
        return ResponseEntity.ok(userId);
    }
    // Postman 등 테스트용 토큰 발급 API (실서비스 미사용)
    @GetMapping("/api/v1/test-token")
    public ResponseEntity<String> getTestAccessToken(@RequestParam("userId") Integer userId) {
        // UserService에서 User 조회
        var user = userService.findById(userId);
        if (user == null) {
            return ResponseEntity.status(HttpStatus.NOT_FOUND).body("해당 userId의 사용자가 존재하지 않습니다.");
        }
        // JwtService로 토큰 발급
        String token = jwtService.createAccessToken(user);
        return ResponseEntity.ok(token);
    }

    /**
     * 클라이언트에서 리프레시 토큰을 받아 액세스/리프레시 토큰을 재발급합니다.
     * @param requestBody {"refreshToken": "..."}
     * @return 새 accessToken, refreshToken 또는 403
     */
    @PostMapping("/api/v1/refresh-token")
    public ResponseEntity<?> ValidateRefreshToken(@RequestBody Map<String, String> requestBody, HttpServletResponse response) {
        try {
            String refreshToken = requestBody.get("refreshToken");
            if (refreshToken == null) {
                return ResponseEntity.status(HttpStatus.BAD_REQUEST).body(Map.of("message", "리프레시 토큰이 필요합니다."));
            }

            // 1. 리프레시 토큰에서 userId 추출
            Integer userId;
            try {
                userId = jwtService.getUserIdFromAccessToken(refreshToken); // refreshToken도 같은 방식으로 userId 추출
            } catch (Exception e) {
                return ResponseEntity.status(HttpStatus.FORBIDDEN).body(Map.of("message", "유효하지 않은 리프레시 토큰입니다."));
            }

            // 2. Redis에서 해당 userId의 refreshToken을 가져옴 (key: "refresh:userId")
            String redisKey = "refresh:" + userId;
            String storedRefreshToken = redisTemplate.opsForValue().get(redisKey);
            if (storedRefreshToken == null || !storedRefreshToken.equals(refreshToken)) {
                return ResponseEntity.status(HttpStatus.FORBIDDEN).body(Map.of("message", "리프레시 토큰이 일치하지 않습니다."));
            }

            // 3. userId로 유저 조회
            var user = userService.findById(userId);
            if (user == null) {
                return ResponseEntity.status(HttpStatus.NOT_FOUND).body(Map.of("message", "사용자를 찾을 수 없습니다."));
            }

            // 4. 새 토큰 발급
            String newAccessToken = jwtService.createAccessToken(user);
            String newRefreshToken = jwtService.createRefreshToken(user);

            // 5. Redis에 새 refreshToken 저장 (기존 토큰 덮어쓰기)
            redisTemplate.opsForValue().set(redisKey, newRefreshToken, jwtService.getRefreshTokenValidity(), TimeUnit.SECONDS);

            // 6. 응답 반환
            Map<String, String> responseData = Map.of(
                "accessToken", newAccessToken,
                "refreshToken", newRefreshToken
            );

            // 새 refreshToken 발급 후
            ResponseCookie cookie = ResponseCookie.from("refreshToken", newRefreshToken)
                .httpOnly(true)
                .secure(true)
                .path("/")
                .maxAge(60 * 60 * 24 * 14)
                .sameSite("Strict")
                .build();
            response.addHeader("Set-Cookie", cookie.toString());

            return ResponseEntity.ok(responseData);
        } catch (Exception e) {
            e.printStackTrace();
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body(Map.of("message", "토큰 재발급 중 오류가 발생했습니다."));
        }
    }

    /**
     * 액세스 토큰이 만료되었을 때 403을 반환하는 테스트용 API
     * Authorization 헤더에 Bearer 액세스 토큰 필요
     */
    @GetMapping("/api/v1/access-token")
    public ResponseEntity<?> ValidateAccessToken(HttpServletRequest request) {
        String authHeader = request.getHeader("Authorization");
        if (authHeader == null || !authHeader.startsWith("Bearer ")) {
            return ResponseEntity.status(HttpStatus.FORBIDDEN).body(Map.of("message", "인증 토큰이 필요합니다."));
        }
        String token = authHeader.substring(7);
        if (!jwtService.validateAccessToken(token)) {
            return ResponseEntity.status(HttpStatus.FORBIDDEN).body(Map.of("message", "액세스 토큰이 만료되었거나 유효하지 않습니다."));
        }
        // 정상 토큰일 경우
        return ResponseEntity.ok(Map.of("message", "정상적으로 인증되었습니다."));
    }
}