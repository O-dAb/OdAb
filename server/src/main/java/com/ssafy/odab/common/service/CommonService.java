package com.ssafy.odab.common.service;

import com.ssafy.odab.common.dto.ConceptQuestionListResponseDto;
import com.ssafy.odab.common.dto.GradeConceptResponseDto;

public interface CommonService {
    //학년별 개념 조회
    GradeConceptResponseDto getGradeConceptDetail(Byte grade, Integer userId);
    //개념별 문제 조회
    ConceptQuestionListResponseDto getConceptQuestionList(Integer subConceptId, Integer userId);
    
} 