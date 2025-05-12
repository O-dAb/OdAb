package com.ssafy.odab.common.dto;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Getter;
import lombok.NoArgsConstructor;

import java.util.List;

@Getter
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class GradeConceptResponseDto { //학년별 개념 조회 
    private List<MajorConceptDto> majorConceptList;

    @Getter
    @Builder
    @NoArgsConstructor
    @AllArgsConstructor
    public static class MajorConceptDto {
        private Integer majorConceptId;
        private String majorConceptType;
        private List<SubConceptDto> subConceptList;
    }

    @Getter
    @Builder
    @NoArgsConstructor
    @AllArgsConstructor
    public static class SubConceptDto {
        private Integer subConceptId;
        private String subConceptType;

    }
}