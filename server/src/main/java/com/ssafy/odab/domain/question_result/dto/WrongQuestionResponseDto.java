package com.ssafy.odab.domain.question_result.dto;

import java.time.LocalDateTime;
import java.util.List;
import java.util.Set;
import lombok.Builder;
import lombok.Getter;
import lombok.RequiredArgsConstructor;

@Getter
@Builder
@RequiredArgsConstructor
public class WrongQuestionResponseDto {

  private final List<WrongQuestionDto> gradeWrongQuestionDtos;
  private final Set<String> subConceptTypes;

  @Builder
  @Getter
  public static class WrongQuestionDto {
    private Integer questionId;
    private String subConceptType;
    private String questionImg;
    private String questionText;
    private String questionSolution;
    private String answer;
    private Integer level;
    private LocalDateTime registDate;
  }

}
