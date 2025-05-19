package com.ssafy.odab.domain.question.controller;

import com.ssafy.odab.domain.question.dto.*;
import com.ssafy.odab.domain.question.service.QuestionService;
import com.ssafy.odab.domain.user.service.JwtService;
import lombok.RequiredArgsConstructor;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Pageable;
import org.springframework.data.domain.Sort;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

@RestController
@RequiredArgsConstructor
@RequestMapping("/api/v1/question/")
public class QuestionController {

    private final QuestionService questionService;
    private final JwtService jwtService;

    @PatchMapping("{questionId}/answer")
    public ResponseEntity<VerifyAnswerResponseDto> verifyAnswer(
            @PathVariable("questionId") Integer questionId, @RequestBody VerifyAnswerRequestDto verifyAnswerRequestDto) {
        Integer userId = jwtService.getUserIdFromRequest();
        Boolean isCorrect = questionService.verifyAnswer(verifyAnswerRequestDto, questionId, userId);
        String message = isCorrect ? "정답입니다." : "오답입니다.";
        System.out.println(isCorrect);
        VerifyAnswerResponseDto verifyAnswerResponseDto = VerifyAnswerResponseDto.builder()
                .correct(isCorrect)
                .message(message)
                .build();
        return ResponseEntity.ok(verifyAnswerResponseDto);
    }

    @GetMapping("/{questionId}/retry")
    public ResponseEntity<RetryQuestionResponseDto> findRetryQuestion(@PathVariable("questionId") Integer questionId) {
        jwtService.getUserIdFromRequest();
        return ResponseEntity.ok(questionService.findRetryQuestionByQuestionId(questionId));
    }

    //개념선택 - 수학개념 목록 조회
    @GetMapping("/concept")
    public ResponseEntity<ConceptResponseDto> findConceptList() {
        return ResponseEntity.ok(questionService.findConceptList());
    }

    @GetMapping("/{subConceptId}/related")
    public ResponseEntity<Page<SubConceptRelatedQuestionResponseDto>> findSubConceptRelatedQuestion(
            @PathVariable("subConceptId") Integer subConceptId,
            @RequestParam(value = "page", defaultValue = "0") int page,
            @RequestParam(value = "size", defaultValue = "20") int size,
            @RequestParam(value = "sort", defaultValue = "registedAt,desc") String sort) {

        String[] sortParams = sort.split(",");
        Sort.Direction direction = sortParams.length > 1 ?
                Sort.Direction.fromString(sortParams[1]) : Sort.Direction.DESC;

        Sort sortObj = Sort.by(direction, sortParams[0]);
        Pageable pageable = PageRequest.of(page, size, sortObj);

        return ResponseEntity.ok(
                questionService.findSubConceptRelatedQuestionBySubConceptId(subConceptId, pageable));
    }

}
