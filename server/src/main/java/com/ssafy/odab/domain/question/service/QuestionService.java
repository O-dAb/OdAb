package com.ssafy.odab.domain.question.service;

import com.ssafy.odab.domain.question.dto.RetryQuestionResponseDto;
import com.ssafy.odab.domain.question.dto.VerifyAnswerRequestDto;

public interface QuestionService {

  Boolean verifyAnswer(VerifyAnswerRequestDto verifyAnswerRequestDto);
  RetryQuestionResponseDto findRetryQuestionByQuestionId(Integer questionId);
}
