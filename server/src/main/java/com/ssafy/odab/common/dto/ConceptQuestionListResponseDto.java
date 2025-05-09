package com.ssafy.odab.common.dto;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Getter;
import lombok.NoArgsConstructor;
import java.util.List;
import java.time.LocalDateTime;

@Getter
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class ConceptQuestionListResponseDto {
    private List<QuestionDto> questionList;

    @Getter
    @Builder
    @NoArgsConstructor
    @AllArgsConstructor
    public static class QuestionDto {
        private Integer questionId;
        private String subConcept;
        private String questionImg;
        private String questionText;
        private String questionSolution;
        private String answer;
        private LocalDateTime registAt;
    }
} 