package com.ssafy.odab.domain.question_result.controller;

import com.ssafy.odab.domain.question_result.dto.WrongQuestionResponseDto;
import com.ssafy.odab.domain.question_result.service.QuestionResultService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

@RestController
@RequiredArgsConstructor
@RequestMapping("/api/v1/question-result/")
public class QuestionResultController {

  private final QuestionResultService questionResultService;

  @GetMapping("{grade}/grade")
  public ResponseEntity<WrongQuestionResponseDto> findGradeWrongAnswersByGrade(
      @PathVariable("grade") Byte grade) {
    Integer userId = 2;
    WrongQuestionResponseDto wrongQuestionResponseDto
        = questionResultService.findWrongAnswersByGrade(grade, userId);
    return ResponseEntity.ok(wrongQuestionResponseDto);
  }

  @GetMapping("{schoolLevel}")
  public ResponseEntity<WrongQuestionResponseDto> findWrongAnswersBySchoolLevel(
      @PathVariable("schoolLevel") String schoolLevel) {
    Integer userId = 1;
    WrongQuestionResponseDto wrongQuestionResponseDto =
        questionResultService.findWrongAnswersBySchoolLevel(schoolLevel, userId);
    return ResponseEntity.ok(wrongQuestionResponseDto);
  }

  @GetMapping("{subConceptId}/subconcept")
  public ResponseEntity<Void> findWrongAnswersBySubConcept(@PathVariable("subConceptId") Integer subConceptId) {

    return null;
  }

}
