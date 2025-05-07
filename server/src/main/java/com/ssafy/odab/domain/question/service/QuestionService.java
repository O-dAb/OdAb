package com.ssafy.odab.domain.question.service;

import com.ssafy.odab.domain.question.dto.VerifyAnswerRequestDto;

public interface QuestionService {

  public Boolean verifyAnswer(VerifyAnswerRequestDto verifyAnswerRequestDto);

}
