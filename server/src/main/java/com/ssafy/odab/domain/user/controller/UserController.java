package com.ssafy.odab.domain.user.controller;

import com.ssafy.odab.domain.user.dto.ProfileImageResponse;
import com.ssafy.odab.domain.user.service.UserService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;

import java.util.HashMap;
import java.util.Map;

@RestController
@RequestMapping("/api/v1")
@RequiredArgsConstructor
public class UserController {

  private final UserService userService;

  /**
   * 사용자의 프로필 이미지를 업로드하고 저장합니다.
   *
   * @param file 업로드할 이미지 파일
   * @return 저장된 이미지 URL을 포함한 응답
   */
  @PutMapping("/profile_img")
  public ResponseEntity<ProfileImageResponse> saveProfileImg(@RequestParam("file") MultipartFile file) {
    try {
      // 개발 단계에서는 임시로 고정된 사용자 ID 사용
      Integer userId = 1; // 테스트용 사용자 ID

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
  @PutMapping("/profile_grade")
  public ResponseEntity<?> updateGrade(@RequestBody Map<String, Integer> gradeMap) {
    try{
      // 개발 단계에서는 임시로 고정된 사용자 ID 사용
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
      return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body(Map.of("message","학년 업데이트 중 오류가 발생했습니다."));
    }
  }

}