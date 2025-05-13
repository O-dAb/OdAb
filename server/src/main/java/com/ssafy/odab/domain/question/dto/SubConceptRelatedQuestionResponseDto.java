package com.ssafy.odab.domain.question.dto;

import com.ssafy.odab.domain.concept.entity.SubConcept;
import com.ssafy.odab.domain.question.entity.Question;
import lombok.Builder;
import lombok.Getter;
import lombok.RequiredArgsConstructor;

import java.time.LocalDateTime;
import java.util.List;

@Getter
@Builder
@RequiredArgsConstructor
public class SubConceptRelatedQuestionResponseDto {
    private final Integer questionId;
    private final String questionImg;
    private final String questionText;
    private final LocalDateTime registedAt;
    private final Integer userId;
    private final String userName;
    private final List<RelatedSubConceptDto> subConceptDtos;

    @Getter
    @Builder
    @RequiredArgsConstructor
    public static class RelatedSubConceptDto {
        private final Integer subConceptId;
        private final String subConceptType;

        public static RelatedSubConceptDto from(SubConcept subConcept) {
            return new RelatedSubConceptDto(
                    subConcept.getId(),
                    subConcept.getConceptType()
            );
        }
    }

    public static SubConceptRelatedQuestionResponseDto from(Question question) {
        return new SubConceptRelatedQuestionResponseDto(
                question.getId(),
                question.getQuestionImg(),
                question.getQuestionText(),
                question.getRegistedAt(),
                question.getUser().getId(),
                question.getUser().getUserName(),
                question.getQuestionConcepts().stream().map(questionConcept -> RelatedSubConceptDto.from(questionConcept.getSubConcept())).toList()
        );
    }
}
