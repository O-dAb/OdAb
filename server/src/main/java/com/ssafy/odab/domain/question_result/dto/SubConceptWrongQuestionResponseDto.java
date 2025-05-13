package com.ssafy.odab.domain.question_result.dto;

import com.ssafy.odab.domain.question.entity.Question;
import lombok.*;

import java.time.LocalDateTime;
import java.util.List;

@Getter
@Builder
@RequiredArgsConstructor
public class SubConceptWrongQuestionResponseDto {

    private final List<SubConceptWrongQuestionDto> wrongQuestionDtos;
    private final Integer subConceptId;
    private final String subConceptType;


    @Getter
    @Builder
    @NoArgsConstructor
    @AllArgsConstructor
    public static class SubConceptWrongQuestionDto {
        private Integer questionId;
        private String questionImg;
        private String questionText;
        private LocalDateTime registedAt;

        public static SubConceptWrongQuestionDto from(Question question) {
            return new SubConceptWrongQuestionDto(
                    question.getId(),
                    question.getQuestionImg(),
                    question.getQuestionText(),
                    question.getRegistedAt()
            );
        }
    }

}
