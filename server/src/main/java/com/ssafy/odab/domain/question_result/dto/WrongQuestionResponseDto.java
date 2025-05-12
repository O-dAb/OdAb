package com.ssafy.odab.domain.question_result.dto;

import com.ssafy.odab.domain.question.entity.QuestionSolution;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Getter;
import lombok.RequiredArgsConstructor;

import java.time.LocalDateTime;
import java.util.List;
import java.util.Set;

@Getter
@Builder
@RequiredArgsConstructor
public class WrongQuestionResponseDto {

    private final List<WrongQuestionDto> gradeWrongQuestionDtos;
    private final Set<WrongQuestionSubconcept> wrongQuestionSubconcepts;

    @Builder
    @Getter
    @AllArgsConstructor
    public static class WrongQuestionDto {
        private Integer questionId;
        private String questionImg;
        private String questionText;
        private String answer;
        private LocalDateTime registDate;
        private List<WrongQuestionSolution> wrongQuestionSolutions;

        @Builder
        @Getter
        @AllArgsConstructor
        public static class WrongQuestionSolution {
            private Integer questionSolutionId;
            private Byte step;
            private String solutionContent;

            public static WrongQuestionSolution from(QuestionSolution questionSolution) {
                return new WrongQuestionSolution(
                        questionSolution.getId(),
                        questionSolution.getStep(),
                        questionSolution.getSolutionContent()
                );
            }
        }
    }

    @Builder
    @Getter
    @AllArgsConstructor
    public static class WrongQuestionSubconcept {
        private Integer subConceptId;
        private String subConceptType;
    }

}
