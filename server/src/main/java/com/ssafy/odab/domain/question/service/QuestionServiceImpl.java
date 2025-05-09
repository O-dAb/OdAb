package com.ssafy.odab.domain.question.service;

import com.ssafy.odab.domain.concept.entity.SubConcept;
import com.ssafy.odab.domain.concept.repository.SubConceptRepository;
import com.ssafy.odab.domain.question.dto.RetryQuestionResponseDto;
import com.ssafy.odab.domain.question.dto.RetryQuestionResponseDto.RetryQuestionSolutionDto;
import com.ssafy.odab.domain.question.dto.RetryQuestionResponseDto.RetryQuestionSubConceptDto;
import com.ssafy.odab.domain.question.dto.VerifyAnswerRequestDto;
import com.ssafy.odab.domain.question.entity.Question;
import com.ssafy.odab.domain.question.repository.QuestionRepository;
import com.ssafy.odab.domain.question_result.entity.QuestionResult;
import com.ssafy.odab.domain.question_result.repository.QuestionResultRepository;
import java.time.LocalDateTime;
import java.util.List;
import java.util.Set;
import java.util.stream.Collectors;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

@Service
@RequiredArgsConstructor
public class QuestionServiceImpl implements QuestionService {

  private final QuestionRepository questionRepository;
  private final QuestionResultRepository questionResultRepository;
  private final SubConceptRepository subConceptRepository;

  @Override
  public Boolean verifyAnswer(VerifyAnswerRequestDto verifyAnswerRequestDto) {

    // 문제에서 정답 여부 확인
    Question question = questionRepository.findById(verifyAnswerRequestDto.getQuestionId())
        .orElseThrow(() -> new IllegalArgumentException("문제를 찾을 수 없습니다."));

    // 정답결과 테이블에서 회원의 문제 조회
    QuestionResult questionResult = questionResultRepository.findByQuestionId(question.getId())
        .orElseThrow(() -> new IllegalArgumentException("문제 결과를 찾을 수 없습니다."));
    Boolean isCorrect = question.getAnswer().equals(verifyAnswerRequestDto.getAnswer());
    // 정답이 맞으면 풀이일자 수정, 정답여부 true
    // 정답이 틀리면 풀이일자 수정, 정답여부 false
    questionResult.changeVerifyAnswer(isCorrect, LocalDateTime.now());

    // 정답이 맞으면 true
    // 정답이 틀리면 false를 리턴
    return isCorrect;
  }

  @Override
  public RetryQuestionResponseDto findRetryQuestionByQuestionId(Integer questionId) {
    // 문제id에 해당하는 문제 찾아오기
    Question question = questionRepository.findById(questionId)
        .orElseThrow(() -> new IllegalArgumentException("문제를 찾을 수 없습니다."));
    // 문제별 정답 여부에서 가장 최근 정답기록 찾아오기
    List<RetryQuestionResponseDto> retryQuestionResponseDtos = questionResultRepository.findRecentQuestionResultByQuestionId(
        questionId);
    RetryQuestionResponseDto retryQuestionResponseDto = retryQuestionResponseDtos.get(0);
    List<SubConcept> subConcepts = subConceptRepository.findByQuestionId(questionId);
    Set<RetryQuestionSubConceptDto> retryQuestionSubConceptDtoSet = subConcepts.stream()
        .map(RetryQuestionSubConceptDto::from).collect(
            Collectors.toSet());
    List<RetryQuestionSolutionDto> retryQuestionSolutionDtos = question.getQuestionSolutions()
        .stream().map(RetryQuestionSolutionDto::from).toList();
    retryQuestionResponseDto.getRetryQuestionSubConceptDtos().addAll(retryQuestionSubConceptDtoSet);
    retryQuestionResponseDto.getRetryQuestionSolutionDtos().addAll(retryQuestionSolutionDtos);
    return retryQuestionResponseDto;
  }
}
