package com.ssafy.odab.domain.question_result.service;

import com.ssafy.odab.domain.question_result.dto.SubConceptWrongQuestionResponseDto;
import com.ssafy.odab.domain.question_result.dto.WrongQuestionResponseDto;

import java.time.LocalDateTime;

public interface QuestionResultService {

    WrongQuestionResponseDto findWrongAnswersByGrade(Byte grade, Integer userId);

    WrongQuestionResponseDto findWrongAnswersBySchoolLevel(String schoolLevel, Integer userId);

    SubConceptWrongQuestionResponseDto findWrongAnswersBySubConcept(Integer subConceptId, Integer userId);

    WrongQuestionResponseDto findRecentWrongAnswersBySchoolLevel(String schoolLevel, Integer userId, LocalDateTime startTime);

    WrongQuestionResponseDto findRecentWrongAnswersByGrade(Byte grade, Integer userId, LocalDateTime startTime);
}
