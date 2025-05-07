package com.ssafy.odab.domain.question_result.service;

import com.ssafy.odab.domain.question_result.dto.WrongQuestionResponseDto;

public interface QuestionResultService {

  public WrongQuestionResponseDto findWrongAnswersByGrade(int grade);
}
