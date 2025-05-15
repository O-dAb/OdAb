package com.ssafy.odab.domain.learning.controller;

import org.springframework.web.bind.annotation.RestController;

import lombok.RequiredArgsConstructor;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.RequestMapping;
import com.ssafy.odab.domain.learning.service.LearningService;
import com.ssafy.odab.domain.learning.dto.ReviewPageResponseDto;

@RestController
@RequiredArgsConstructor
@RequestMapping("/api/v1/learning/review")
public class LearningController {
    private final LearningService learningService;

    @GetMapping()
    public ResponseEntity<?> getReviewMain() {
        Integer userId = 1; // TODO: 실제 로그인 유저로 교체
        ReviewPageResponseDto data = learningService.getReviewMain(userId);
        return ResponseEntity.ok(
            new ApiResponse<>(200, "성공적으로 조회되었습니다.", data)
        );
    }

    // 공통 응답 형식 
    public static class ApiResponse<T> {
        private final int httpStatus;
        private final String message;
        private final T data;
        public ApiResponse(int httpStatus, String message, T data) {
            this.httpStatus = httpStatus;
            this.message = message;
            this.data = data;
        }
        public int getHttpStatus() { return httpStatus; }
        public String getMessage() { return message; }
        public T getData() { return data; }
    }
}

