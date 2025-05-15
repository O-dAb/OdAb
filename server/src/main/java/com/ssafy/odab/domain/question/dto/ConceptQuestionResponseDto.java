package com.ssafy.odab.domain.question.dto;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Getter;
import lombok.NoArgsConstructor;
import java.util.List;

@Getter
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class ConceptQuestionResponseDto { //개념별 문제 리스트 조회 DTO
    private int httpStatus;
    private String message;
    private Data data;

    @Getter
    @Builder
    @NoArgsConstructor
    @AllArgsConstructor
    public static class Data {
        private List<QuestionWithSolutionDto> questionList;
    }

    @Getter
    @Builder
    @NoArgsConstructor
    @AllArgsConstructor
    public static class QuestionWithSolutionDto {
        private Integer questionId;
        private String questionImg;
        private String questionText;
        private String answer;
        private Integer questionSolutionId;
        private String solutionContent;
        private Byte step;
    }
}