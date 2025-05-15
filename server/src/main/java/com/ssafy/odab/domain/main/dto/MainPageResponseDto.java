package com.ssafy.odab.domain.main.dto;

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
public class MainPageResponseDto {
    private List<TodayReviewDto> todayReviewList;
    private RecentStudySubConceptDto recentStudySubConcept;

    @Getter
    @Builder
    @NoArgsConstructor
    @AllArgsConstructor
    public static class TodayReviewDto {
        private Integer subConceptId;
        private String subConceptType;
        private LocalDate lastLearningTime;
        private int reviewOrder; // 몇일차 복습인지
    }

    @Getter
    @Builder
    @NoArgsConstructor
    @AllArgsConstructor
    public static class RecentStudySubConceptDto {
        private Integer subConceptId;
        private String subConceptType;
        private LocalDate lastLearningTime;
    }
} 