package com.ssafy.odab.domain.main.controller;

import com.ssafy.odab.domain.main.dto.MainPageResponseDto;
import com.ssafy.odab.domain.main.service.MainService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;
import com.ssafy.odab.domain.user.service.JwtService;

@RestController
@RequiredArgsConstructor
@RequestMapping("/api/v1/main")
public class MainController {
    private final MainService mainService;

    @GetMapping
    public ResponseEntity<?> getMainPage() {
        
        // Integer userId = 1; // TODO: 실제 로그인 유저로 교체
        JwtService jwtService = new JwtService();
        Integer userId = jwtService.getUserId(); // 만드는중. 
        MainPageResponseDto data = mainService.getMainPage(userId);
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
