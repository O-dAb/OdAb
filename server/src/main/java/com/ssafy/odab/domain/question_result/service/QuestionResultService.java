package com.ssafy.odab.domain.question_result.service;

import com.ssafy.odab.domain.question_result.dto.WrongQuestionResponseDto;

public interface QuestionResultService {

  WrongQuestionResponseDto findWrongAnswersByGrade(Byte grade, Integer userId);
  WrongQuestionResponseDto findWrongAnswersBySchoolLevel(String schoolLevel, Integer userId);

}
