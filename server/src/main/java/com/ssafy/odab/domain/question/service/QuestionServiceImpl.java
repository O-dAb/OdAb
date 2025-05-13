package com.ssafy.odab.domain.question.service;

import com.ssafy.odab.domain.concept.entity.SubConcept;
import com.ssafy.odab.domain.concept.repository.SubConceptRepository;
import com.ssafy.odab.domain.question.dto.RetryQuestionResponseDto;
import com.ssafy.odab.domain.question.dto.RetryQuestionResponseDto.RetryQuestionSolutionDto;
import com.ssafy.odab.domain.question.dto.RetryQuestionResponseDto.RetryQuestionSubConceptDto;
import com.ssafy.odab.domain.question.dto.SubConceptRelatedQuestionResponseDto;
import com.ssafy.odab.domain.question.dto.VerifyAnswerRequestDto;
import com.ssafy.odab.domain.question.entity.Question;
import com.ssafy.odab.domain.question.repository.QuestionRepository;
import com.ssafy.odab.domain.question_result.entity.QuestionResult;
import com.ssafy.odab.domain.question_result.repository.QuestionResultRepository;
   import com.ssafy.odab.domain.question.dto.ConceptResponseDto;
import lombok.RequiredArgsConstructor;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Pageable;
import org.springframework.data.domain.Sort;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.LocalDateTime;
import java.util.List;
import java.util.Set;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
public class QuestionServiceImpl implements QuestionService {

    private final QuestionRepository questionRepository;
    private final QuestionResultRepository questionResultRepository;
    private final SubConceptRepository subConceptRepository;

    @Override
    @Transactional
    public Boolean verifyAnswer(VerifyAnswerRequestDto verifyAnswerRequestDto) {

        // 문제에서 정답 여부 확인
        Question question = questionRepository.findById(verifyAnswerRequestDto.getQuestionId()).orElseThrow(() -> new IllegalArgumentException("문제를 찾을 수 없습니다."));

        // 정답결과 테이블에서 회원의 문제 조회
        QuestionResult questionResult = questionResultRepository.findByQuestionId(question.getId()).orElseThrow(() -> new IllegalArgumentException("문제 결과를 찾을 수 없습니다."));
        Boolean isCorrect = question.getAnswer().equals(verifyAnswerRequestDto.getAnswer());
        // 정답이 맞으면 풀이일자 수정, 정답여부 true
        // 정답이 틀리면 풀이일자 수정, 정답여부 false
        questionResult.changeVerifyAnswer(isCorrect, LocalDateTime.now());

        // 정답이 맞으면 true
        // 정답이 틀리면 false를 리턴
        return isCorrect;
    }

    @Override
    @Transactional
    public RetryQuestionResponseDto findRetryQuestionByQuestionId(Integer questionId) {
        // 문제id에 해당하는 문제 찾아오기
        Question question = questionRepository.findById(questionId).orElseThrow(() -> new IllegalArgumentException("문제를 찾을 수 없습니다."));
        // 문제별 정답 여부에서 가장 최근 정답기록 찾아오기
        List<RetryQuestionResponseDto> retryQuestionResponseDtos = questionResultRepository.findRecentQuestionResultByQuestionId(questionId);
        RetryQuestionResponseDto retryQuestionResponseDto = retryQuestionResponseDtos.get(0);
        List<SubConcept> subConcepts = subConceptRepository.findByQuestionId(questionId);
        Set<RetryQuestionSubConceptDto> retryQuestionSubConceptDtoSet = subConcepts.stream().map(RetryQuestionSubConceptDto::from).collect(Collectors.toSet());
        List<RetryQuestionSolutionDto> retryQuestionSolutionDtos = question.getQuestionSolutions().stream().map(RetryQuestionSolutionDto::from).toList();
        retryQuestionResponseDto.getRetryQuestionSubConceptDtos().addAll(retryQuestionSubConceptDtoSet);
        retryQuestionResponseDto.getRetryQuestionSolutionDtos().addAll(retryQuestionSolutionDtos);
        return retryQuestionResponseDto;
    }

    @Override
    @Transactional
    public Page<SubConceptRelatedQuestionResponseDto> findSubConceptRelatedQuestionBySubConceptId(Integer subConceptId, Pageable pageable) {
        // 개념별로 다른 학생들이 올려준 문제 조회
        // 개념별 조회시 인덱스 처리 필요
        // 페이징 처리 필요
        Pageable sortedPageable = PageRequest.of(pageable.getPageNumber(), pageable.getPageSize(), Sort.by("registedAt").descending());

        Page<Question> questions = questionRepository.findSubConceptRelatedQuestionBySubConceptId(subConceptId, pageable);

        return questions.map(SubConceptRelatedQuestionResponseDto::from);
    }

    @Override
    @Transactional(readOnly = true)
    public ConceptResponseDto findConceptList() {
        List<SubConcept> subConcepts = subConceptRepository.findAll();
        List<ConceptResponseDto.SubConceptSimpleDto> subConceptList = subConcepts.stream()
                .map(sc -> new ConceptResponseDto.SubConceptSimpleDto(sc.getId(), sc.getConceptType()))
                .toList();
        ConceptResponseDto.Data data = ConceptResponseDto.Data.builder()
                .subConceptList(subConceptList)
                .build();
        return ConceptResponseDto.builder()
                .data(data)
                .build();
    }
}
