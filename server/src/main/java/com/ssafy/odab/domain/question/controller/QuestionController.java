package com.ssafy.odab.domain.question.controller;

import com.ssafy.odab.domain.question.dto.RetryQuestionResponseDto;
import com.ssafy.odab.domain.question.dto.VerifyAnswerRequestDto;
import com.ssafy.odab.domain.question.dto.VerifyAnswerResponseDto;
import com.ssafy.odab.domain.question.service.QuestionService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PatchMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

@RestController
@RequiredArgsConstructor
@RequestMapping("/api/v1/question/")
public class QuestionController {

  private final QuestionService questionService;

  @PatchMapping("anwser")
  public ResponseEntity<VerifyAnswerResponseDto> verifyAnswer(
      @RequestBody VerifyAnswerRequestDto verifyAnswerRequestDto) {

    Boolean isCorrect = questionService.verifyAnswer(verifyAnswerRequestDto);
    String message = isCorrect ? "정답입니다." : "오답입니다.";
    VerifyAnswerResponseDto verifyAnswerResponseDto = VerifyAnswerResponseDto.builder()
        .correct(isCorrect)
        .message(message)
        .build();
    return ResponseEntity.ok(verifyAnswerResponseDto);
  }

  @GetMapping("/{questionId}/retry")
  public ResponseEntity<RetryQuestionResponseDto> findRetryQuestion(@PathVariable("questionId") Integer questionId) {

    //
    return null;
  }

}
