package com.ssafy.odab.domain.learning.controller;

import org.springframework.web.bind.annotation.RestController;

import lombok.RequiredArgsConstructor;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.RequestMapping;
import com.ssafy.odab.domain.learning.service.LearningService;
import com.ssafy.odab.domain.learning.dto.ReviewPageResponseDto;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.RequestParam;
import java.util.List;
import com.ssafy.odab.domain.user.service.JwtService;

@RestController
@RequiredArgsConstructor
@RequestMapping("/api/v1/learning/review")
public class LearningController {
    private final LearningService learningService;
    private final JwtService jwtService;
    
    @GetMapping()
    public ResponseEntity<?> getReviewMain() {
        Integer userId = 1; 
        // Integer userId = jwtService.getUserIdFromRequest(); // jwt.getUserId()로 수정하면 오류뜸.(토큰 가져올 수 없습니다.) 
        ReviewPageResponseDto data = learningService.getReviewMain(userId);
        return ResponseEntity.ok(
            new ApiResponse<>(200, "성공적으로 조회되었습니다.", data)
        );
    }
 
    // 오늘의 복습문제 조회 API
    @GetMapping("/today/{subConceptId}/subConceptId")
    public ResponseEntity<?> getTodayReviewQuestionsBySubConcept(
            @PathVariable Integer subConceptId) {
        Integer userId = jwtService.getUserId();
        List<ReviewQuestionDto> questionList = learningService.getTodayReviewQuestionsBySubConcept(subConceptId, userId);
        return ResponseEntity.ok(questionList);
    }

    // 내일의 복습문제 조회 API
    @GetMapping("/tomorrow/{subConceptId}/subConceptId")
    public ResponseEntity<?> getTomorrowReviewQuestionsBySubConcept(
            @PathVariable Integer subConceptId) {
        Integer userId = jwtService.getUserId();
        List<ReviewQuestionDto> questionList = learningService.getTomorrowReviewQuestionsBySubConcept(subConceptId, userId);
        return ResponseEntity.ok(questionList);
    }

    // 복습 문제 리스트 응답 DTO
    public static class ReviewQuestionListResponse {
        private final List<ReviewQuestionDto> questionList;
        public ReviewQuestionListResponse(List<ReviewQuestionDto> questionList) {
            this.questionList = questionList;
        }
        public List<ReviewQuestionDto> getQuestionList() { return questionList; }
    }

    // 복습 문제 단일 DTO
    public static class ReviewQuestionDto {
        public Integer questionId;
        public String questionImg;
        public String questionText;
        public String answer;
        public Integer questionSolutionId;
        public String solutionContent;
        public Byte step;
        public ReviewQuestionDto(Integer questionId, String questionImg, String questionText, String answer, Integer questionSolutionId, String solutionContent, Byte step) {
            this.questionId = questionId;
            this.questionImg = questionImg;
            this.questionText = questionText;
            this.answer = answer;
            this.questionSolutionId = questionSolutionId;
            this.solutionContent = solutionContent;
            this.step = step;
        }
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

