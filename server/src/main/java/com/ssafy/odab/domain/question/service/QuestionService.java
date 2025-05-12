package com.ssafy.odab.domain.question.service;

import com.ssafy.odab.domain.question.dto.VerifyAnswerRequestDto;
import org.springframework.web.multipart.MultipartFile;

public interface QuestionService {

  public Boolean verifyAnswer(VerifyAnswerRequestDto verifyAnswerRequestDto);

  public Boolean createQuestion(MultipartFile file, String questionText);
}
