package com.ssafy.odab.domain.question.dto;

import com.ssafy.odab.domain.concept.entity.SubConcept;
import java.time.LocalDateTime;
import java.util.HashSet;
import java.util.Set;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Getter;
import lombok.RequiredArgsConstructor;

@Builder
@Getter
@AllArgsConstructor
public class RetryQuestionResponseDto {

  private final Integer questionId;
  private final String questionImg;
  private final String questionText;
  private final String questionSolution;
  private final String answer;
  private final Integer level;
  private final LocalDateTime registDate;
  private final Boolean isCorrect;
  private final Integer times;
  private final LocalDateTime solvedAt;
  private Set<RetryQuestionSubConceptDto> subConcepts;

  public RetryQuestionResponseDto(Integer questionId, String questionImg, String questionText,
      String questionSolution, String answer, Integer level, LocalDateTime registDate,
      Boolean isCorrect, Integer times, LocalDateTime solvedAt) {
    this.questionId = questionId;
    this.questionImg = questionImg;
    this.questionText = questionText;
    this.questionSolution = questionSolution;
    this.answer = answer;
    this.level = level;
    this.registDate = registDate;
    this.isCorrect = isCorrect;
    this.times = times;
    this.solvedAt = solvedAt;
    this.subConcepts = new HashSet<>();
  }

  @RequiredArgsConstructor
  public static class RetryQuestionSubConceptDto {
    private final Integer subConceptId;
    private final String subConceptType;

    public static RetryQuestionSubConceptDto from(SubConcept subConcept) {
      return new RetryQuestionSubConceptDto(
          subConcept.getId(),
          subConcept.getConceptType()
      );
    }
  }
}
