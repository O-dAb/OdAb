package com.ssafy.odab.domain.question.dto;

import com.ssafy.odab.domain.concept.entity.SubConcept;
import com.ssafy.odab.domain.question.entity.QuestionSolution;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Getter;
import lombok.RequiredArgsConstructor;

import java.time.LocalDateTime;
import java.util.ArrayList;
import java.util.HashSet;
import java.util.List;
import java.util.Set;

@Builder
@Getter
@AllArgsConstructor
public class RetryQuestionResponseDto {

    private final Integer questionId;
    private final String questionImg;
    private final String questionText;
    private final String answer;
    private final LocalDateTime registedAt;
    private final Boolean isCorrect;
    private final Integer times;
    private final LocalDateTime solvedAt;
    private Set<RetryQuestionSubConceptDto> retryQuestionSubConceptDtos;
    private List<RetryQuestionSolutionDto> retryQuestionSolutionDtos;

    public RetryQuestionResponseDto(Integer questionId, String questionImg, String questionText,
                                    String answer, LocalDateTime registedAt,
                                    Boolean isCorrect, Integer times, LocalDateTime solvedAt) {
        this.questionId = questionId;
        this.questionImg = questionImg;
        this.questionText = questionText;
        this.answer = answer;
        this.registedAt = registedAt;
        this.isCorrect = isCorrect;
        this.times = times;
        this.solvedAt = solvedAt;
        this.retryQuestionSubConceptDtos = new HashSet<>();
        this.retryQuestionSolutionDtos = new ArrayList<>();
    }

    @Getter
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

    @Getter
    @RequiredArgsConstructor
    public static class RetryQuestionSolutionDto {
        private final Integer questionSolutionId;
        private final Byte step;
        private final String solutionContent;

        public static RetryQuestionSolutionDto from(QuestionSolution questionSolution) {
            return new RetryQuestionSolutionDto(
                    questionSolution.getId(),
                    questionSolution.getStep(),
                    questionSolution.getSolutionContent()
            );
        }
    }
}
