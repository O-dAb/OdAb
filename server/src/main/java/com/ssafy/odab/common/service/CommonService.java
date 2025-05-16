package com.ssafy.odab.common.service;

import com.ssafy.odab.common.dto.GradeConceptResponseDto;
import com.ssafy.odab.domain.question.dto.ConceptQuestionResponseDto;

import java.util.Map;

public interface CommonService {
    //학년별 개념 조회
    GradeConceptResponseDto getGradeConceptDetail(Byte grade, Integer userId);
    // 개념별 문제 조회
    ConceptQuestionResponseDto getConceptQuestionList(Integer subConceptId);
    // 전체 개념 조회
    Object getAllConcepts();
    // 개념별 내용 조회
    Map<String, Object> getSubConceptContent(Integer subConceptId);
} 