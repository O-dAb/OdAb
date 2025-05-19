package com.ssafy.odab.domain.question_result.dto;

import com.ssafy.odab.domain.concept.entity.MajorConcept;
import com.ssafy.odab.domain.concept.entity.SubConcept;
import com.ssafy.odab.domain.question.entity.QuestionSolution;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Getter;
import lombok.RequiredArgsConstructor;

import java.time.LocalDateTime;
import java.util.Comparator;
import java.util.List;
import java.util.stream.Collectors;

@Getter
@Builder
@RequiredArgsConstructor
public class WrongQuestionResponseDto {

    private final List<WrongQuestionDto> gradeWrongQuestionDtos;
    private final List<WrongQuestionMajorConcept> majorConcepts;

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
        private List<WrongQuestionSubconcept> wrongQuestionSubconceptList;

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
    public static class WrongQuestionMajorConcept {
        private Integer majorConceptId;
        private String majorConceptType;
        private Byte grade;
        private List<WrongQuestionSubconcept> subconcepts;

        public static WrongQuestionMajorConcept from(MajorConcept majorConcept) {
            return new WrongQuestionMajorConcept(
                    majorConcept.getId(),
                    majorConcept.getConceptType(),
                    majorConcept.getGradeLevel().getGrade(),
                    majorConcept.getSubConcepts().stream()
                            .sorted(Comparator.comparing(SubConcept::getConceptOrder))
                            .map(WrongQuestionSubconcept::from)
                            .collect(Collectors.toList())
            );
        }
    }

    @Builder
    @Getter
    @AllArgsConstructor
    public static class WrongQuestionSubconcept {
        private Integer subConceptId;
        private String subConceptType;

        public static WrongQuestionSubconcept from(SubConcept subConcept) {
            return new WrongQuestionSubconcept(
                    subConcept.getId(),
                    subConcept.getConceptType()
            );
        }
    }

}
