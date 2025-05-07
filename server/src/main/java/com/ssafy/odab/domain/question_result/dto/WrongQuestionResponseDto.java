package com.ssafy.odab.domain.question_result.dto;

import lombok.Getter;
import lombok.RequiredArgsConstructor;

@Getter
@RequiredArgsConstructor
public class WrongQuestionResponseDto {
  private Long questionId;
  private String subConceptType;
  private String questionImg;
  private String questionText;
  private String questionSolution;
  private String answer;
  private Integer level;
}
