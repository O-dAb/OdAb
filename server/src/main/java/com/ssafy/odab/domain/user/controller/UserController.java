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

import org.springframework.data.redis.core.StringRedisTemplate;
import java.util.UUID;
import java.util.concurrent.TimeUnit;
import java.io.IOException;
import org.springframework.web.multipart.MultipartFile;

import java.io.IOException;
import java.util.Map;
import com.fasterxml.jackson.databind.ObjectMapper;

@RestController
@RequiredArgsConstructor
public class UserController {

    private final KakaoService kakaoService;
    private final UserService userService;
    private final JwtService jwtService;
    private final StringRedisTemplate redisTemplate;

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
            if (jwtService.validateToken(token)) {
                Integer userId = jwtService.getUserIdFromToken(token);
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
    public void kakaoOauth2Callback(@RequestParam String code, HttpServletResponse response) throws IOException {
        String accessToken = kakaoService.getKakaoAccessToken(code);
        KakaoUserInfo userInfo = kakaoService.getKakaoUserInfo(accessToken);
        System.out.println("[카카오 콜백] code: " + code);
        System.out.println("[카카오 콜백] accessToken: " + accessToken);
        System.out.println("[카카오 콜백] userInfo: id=" + userInfo.getId() + ", nickname=" + userInfo.getNickname());
        Map<String, Object> responseData = kakaoService.loginOrSignup(userInfo);
        String uuid = (String) responseData.get("auth_code");
        String redirectUrl = String.format("http://localhost:3000/?auth_code=%s", uuid);
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
    public ResponseEntity<Integer> getUserIdFromToken(@RequestParam("token") String token) {
        Integer userId = jwtService.getUserIdFromToken(token);
        return ResponseEntity.ok(userId);
    }
}