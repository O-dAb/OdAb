package com.ssafy.odab.domain.user.controller;

import com.ssafy.odab.domain.user.dto.ProfileImageResponse;
import com.ssafy.odab.domain.user.service.UserService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;

import java.util.Map;

@RestController
@RequestMapping("/api/v1")
@RequiredArgsConstructor
public class UserController {

  private final UserService userService;

  @PutMapping("/profile_img")
  public ResponseEntity<ProfileImageResponse> saveProfileImg(@RequestParam("file") MultipartFile file) {
    try {
      // 개발 단계에서는 임시로 고정된 사용자 ID 사용
      Integer userId = 1; // 테스트용 사용자 ID

      String imageUrl = userService.saveProfileImg(userId, file);
      return ResponseEntity.ok(new ProfileImageResponse(imageUrl));
    } catch (Exception e) {
      // 로깅 추가 (선택 사항)
      e.printStackTrace();
      return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).build();
    }
  }



}