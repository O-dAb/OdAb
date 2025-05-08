package com.ssafy.odab.domain.question.dto;

import lombok.Getter;
import lombok.RequiredArgsConstructor;

@Getter
@RequiredArgsConstructor
public class VerifyAnswerRequestDto {

  private final Integer questionId;
  private final String answer;

}
