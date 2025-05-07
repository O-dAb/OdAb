package com.ssafy.odab.domain.question_result.service;

import com.ssafy.odab.domain.question_result.dto.WrongQuestionResponseDto;
import com.ssafy.odab.domain.question_result.repository.QuestionResultRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

@Service
@RequiredArgsConstructor
public class QuestionResultServiceImpl implements QuestionResultService {

  private final QuestionResultRepository questionResultRepository;

  @Override
  public WrongQuestionResponseDto findWrongAnswersByGrade(int grade) {
    
    return null;
  }
}
