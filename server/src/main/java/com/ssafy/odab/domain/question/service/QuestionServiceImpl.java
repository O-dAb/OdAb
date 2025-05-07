package com.ssafy.odab.domain.question.service;

import com.ssafy.odab.domain.question.dto.VerifyAnswerRequestDto;
import com.ssafy.odab.domain.question.entity.Question;
import com.ssafy.odab.domain.question.repository.QuestionRepository;
import com.ssafy.odab.domain.question_result.entity.QuestionResult;
import com.ssafy.odab.domain.question_result.repository.QuestionResultRepository;
import java.time.LocalDate;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

@Service
@RequiredArgsConstructor
public class QuestionServiceImpl implements QuestionService {

  private final QuestionRepository questionRepository;
  private final QuestionResultRepository questionResultRepository;

  @Override
  public Boolean verifyAnswer(VerifyAnswerRequestDto verifyAnswerRequestDto) {

    // 문제에서 정답 여부 확인
    Question question = questionRepository.findById(verifyAnswerRequestDto.getQuestionId())
        .orElseThrow(() -> new IllegalArgumentException("문제를 찾을 수 없습니다."));

    // 정답결과 테이블에서 회원의 문제 조회
//    QuestionResult questionResult = questionResultRepository.findByQuestionId(question.getQuestionId())
    QuestionResult questionResult = questionResultRepository.findByQuestion_QuestionId(question.getQuestionId())
        .orElseThrow(() -> new IllegalArgumentException("문제 결과를 찾을 수 없습니다."));
    Boolean isCorrect = question.getAnswer().equals(verifyAnswerRequestDto.getAnswer());
    // 정답이 맞으면 풀이일자 수정, 정답여부 true
    // 정답이 틀리면 풀이일자 수정, 정답여부 false
    questionResult.changeVerifyAnswer(isCorrect, LocalDate.now());

    // 정답이 맞으면 true
    // 정답이 틀리면 false를 리턴
    return isCorrect;
  }
}
