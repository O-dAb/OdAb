package com.ssafy.odab.domain.learning.dto;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Getter;
import lombok.NoArgsConstructor;

import java.time.LocalDate;
import java.util.List;

@Getter
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class ReviewPageResponseDto {
    private String todayDate;
    private List<ReviewDto> todayReviewList;
    private List<ReviewDto> scheduledReviewList;
    private List<MajorConceptDto> majorConceptList;

    @Getter
    @Builder
    @NoArgsConstructor
    @AllArgsConstructor
    public static class ReviewDto {
        private Integer subConceptId;
        private String subConceptType;
        private LocalDate lastLearningDate;
    }

    @Getter
    @Builder
    @NoArgsConstructor
    @AllArgsConstructor
    public static class MajorConceptDto {
        private Integer majorConceptId;
        private String majorConceptType;
        private List<ReviewDto> subConceptList;
    }
}
