package com.ssafy.odab.domain.concept.dto;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Getter;
import lombok.NoArgsConstructor;


/*
현재 미사용중이지만 향후 확장성 위해 유지
concept패키지에서는 DTO를 common.dto.GradeConceptResponseDTO 사용중

*/
public class ConceptDto {

    @Getter
    @Builder
    @AllArgsConstructor
    @NoArgsConstructor
    public static class GradeLevelDto {
        private Integer gradeLevelId;
        private Byte grade;
        private String gradeName;
    }

    @Getter
    @Builder
    @AllArgsConstructor
    @NoArgsConstructor
    public static class MajorConceptDto {
        private Integer majorConceptId;
        private Integer gradeId;
        private String majorConceptType;
        private Integer conceptOrder;
    }

    @Getter
    @Builder
    @AllArgsConstructor
    @NoArgsConstructor
    public static class SubConceptDto {
        private Integer subConceptId;
        private Integer majorConceptId;
        private Integer gradeId;
        private String subConceptType;
        private Integer conceptOrder;
        private String conceptContent;
    }

}
