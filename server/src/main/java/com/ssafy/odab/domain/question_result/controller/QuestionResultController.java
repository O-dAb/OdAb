package com.ssafy.odab.domain.question_result.controller;

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

  @GetMapping("{grade}")
  public ResponseEntity<Void> findWrongAnswersByGrade(@PathVariable("grade") int grade) {

    return null;
  }

}
