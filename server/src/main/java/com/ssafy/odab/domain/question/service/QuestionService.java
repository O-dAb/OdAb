package com.ssafy.odab.domain.question.service;

import com.ssafy.odab.domain.question.dto.RetryQuestionResponseDto;
import com.ssafy.odab.domain.question.dto.VerifyAnswerRequestDto;
import org.springframework.web.multipart.MultipartFile;

public interface QuestionService {

  Boolean verifyAnswer(VerifyAnswerRequestDto verifyAnswerRequestDto);
  RetryQuestionResponseDto findRetryQuestionByQuestionId(Integer questionId);
  Boolean createQuestion(MultipartFile file, String questionText);
}
