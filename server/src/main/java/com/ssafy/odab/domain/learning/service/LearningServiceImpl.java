package com.ssafy.odab.domain.learning.service;

import java.time.LocalDate;
import java.util.Arrays;
import java.util.List;
import java.util.stream.Collectors;
import java.util.Map;
import java.util.HashMap;

import org.springframework.stereotype.Service;

import com.ssafy.odab.domain.concept.entity.MajorConcept;
import com.ssafy.odab.domain.concept.repository.MajorConceptRepository;
import com.ssafy.odab.domain.learning.dto.ReviewPageResponseDto;
import com.ssafy.odab.domain.learning.repository.LastLearningDateRepository;
import com.ssafy.odab.domain.question_result.repository.QuestionResultRepository;
import com.ssafy.odab.domain.question.repository.QuestionRepository;
import com.ssafy.odab.domain.question.entity.Question;
import com.ssafy.odab.domain.question.entity.QuestionSolution;
import com.ssafy.odab.domain.learning.controller.LearningController.ReviewQuestionDto;

import lombok.RequiredArgsConstructor;

@Service
@RequiredArgsConstructor
public class LearningServiceImpl implements LearningService {

    private final QuestionResultRepository questionResultRepository;
    private final LastLearningDateRepository lastLearningDateRepository;
    private final MajorConceptRepository majorConceptRepository;
    private final QuestionRepository questionRepository;

  @Override
    public ReviewPageResponseDto getReviewMain(Integer userId) {
      //1. 오늘 날짜 가져오기.
        LocalDate today = LocalDate.now();

      //오늘의 복습
      //오늘로 부터 1일, 4일, 6일, 13일 전 최초로 학습하고 틀린린 문제들의 subConceptId, subConceptType 가져오기.
      // subConceptType 별로 총 몇 문제가 있는지 반환.
      //오늘, 내일복습 날짜 리스트
        List<LocalDate> reviewDates = Arrays.asList(1, 4, 6, 13).stream().map(today::minusDays).collect(Collectors.toList());
        List<LocalDate> scheduledDates = Arrays.asList(0, 2, 5, 12).stream().map(today::minusDays).collect(Collectors.toList());

        // 2. 오늘 복습 대상
        List<Object[]> todayReviewRawList =
            questionResultRepository.findReviewDtosByUserIdAndDatesWithFirstWrong(userId, reviewDates);
        // 네이티브 쿼리 반환값(Object[])을 ReviewDto로 변환
        List<ReviewPageResponseDto.ReviewDto> todayReviewList = todayReviewRawList.stream()
            .map(arr -> new ReviewPageResponseDto.ReviewDto(
                ((Number) arr[0]).intValue(),
                (String) arr[1],
                (arr[2] instanceof java.sql.Date) ? ((java.sql.Date) arr[2]).toLocalDate() : (LocalDate) arr[2]
            ))
            .collect(Collectors.toList());

      //내일의 복습
      //오늘로 부터 0일, 3일, 5일, 12일 전 최초로 학습하고 틀린  문제들의 subConceptId, subConceptType 가져오기.
      //subConceptType 별로 틀린문제 (복습 해야 할 문제) 총 몇 문제가 있는지 반환.
        // 3. 내일 복습 대상
        List<Object[]> scheduledReviewRawList =
            questionResultRepository.findReviewDtosByUserIdAndDatesWithFirstWrong(userId, scheduledDates);
        // 네이티브 쿼리 반환값(Object[])을 ReviewDto로 변환
        List<ReviewPageResponseDto.ReviewDto> scheduledReviewList = scheduledReviewRawList.stream()
            .map(arr -> new ReviewPageResponseDto.ReviewDto(
                ((Number) arr[0]).intValue(),
                (String) arr[1],
                (arr[2] instanceof java.sql.Date) ? ((java.sql.Date) arr[2]).toLocalDate() : (LocalDate) arr[2]
            ))
            .collect(Collectors.toList());

        // 4. 모든 sub_concept의 마지막 학습일
        List<Object[]> lastLearningRawList = lastLearningDateRepository.findAllSubConceptsWithLastLearningDate(userId);
        List<ReviewPageResponseDto.ReviewDto> lastLearningList = lastLearningRawList.stream()
            .map(arr -> new ReviewPageResponseDto.ReviewDto(
                ((Number) arr[0]).intValue(),
                (String) arr[1],
                (arr[2] instanceof java.sql.Date) ? ((java.sql.Date) arr[2]).toLocalDate() : (LocalDate) arr[2]
            ))
            .collect(Collectors.toList());

        // 5. majorConcept별로 subConcept 묶기
        List<MajorConcept> majorConcepts = majorConceptRepository.findAllWithSubConcepts();
        List<ReviewPageResponseDto.MajorConceptDto> majorConceptDtoList = majorConcepts.stream()
            .map(mc -> ReviewPageResponseDto.MajorConceptDto.builder()
                .majorConceptId(mc.getId())
                .majorConceptType(mc.getConceptType())
                .subConceptList(
                    lastLearningList.stream()
                        .filter(dto -> mc.getSubConcepts().stream().anyMatch(sc -> sc.getId().equals(dto.getSubConceptId())))
                        .collect(Collectors.toList())
                )
                .build())
            .collect(Collectors.toList());

        return ReviewPageResponseDto.builder()
            .todayDate(today.toString())
            .todayReviewList(todayReviewList)
            .scheduledReviewList(scheduledReviewList)
            .majorConceptList(majorConceptDtoList)
            .build();
    }

   

    @Override
    public List<ReviewQuestionDto> getTodayReviewQuestionsBySubConcept(Integer subConceptId, Integer userId) {
        LocalDate today = LocalDate.now();
        List<LocalDate> reviewDates = Arrays.asList(1, 4, 6, 13).stream().map(today::minusDays).toList();
        // 복습 주기에 해당하는 최초 오답 subConceptId별로 조회
        List<Object[]> reviewRawList = questionResultRepository.findReviewDtosByUserIdAndDatesWithFirstWrong(userId, reviewDates);
        // subConceptId로 필터링
        List<Integer> targetQuestionIds = reviewRawList.stream()
            .filter(arr -> ((Number) arr[0]).intValue() == subConceptId)
            .map(arr -> ((Number) arr[3]).intValue()) // question_id가 3번째 인덱스에 있다고 가정
            .toList();
        // 문제 + 풀이 정보 반환
        return getReviewQuestionDtosByQuestionIds(targetQuestionIds);
    }

    @Override
    public List<ReviewQuestionDto> getTomorrowReviewQuestionsBySubConcept(Integer subConceptId, Integer userId) {
        LocalDate today = LocalDate.now();
        List<LocalDate> reviewDates = Arrays.asList(0, 2, 5, 12).stream().map(today::minusDays).toList();
        List<Object[]> reviewRawList = questionResultRepository.findReviewDtosByUserIdAndDatesWithFirstWrong(userId, reviewDates);
        List<Integer> targetQuestionIds = reviewRawList.stream()
            .filter(arr -> ((Number) arr[0]).intValue() == subConceptId)
            .map(arr -> ((Number) arr[3]).intValue())
            .toList();
        return getReviewQuestionDtosByQuestionIds(targetQuestionIds);
    }

    // questionId 리스트로 ReviewQuestionDto 리스트 반환
    private List<ReviewQuestionDto> getReviewQuestionDtosByQuestionIds(List<Integer> questionIds) {
        if (questionIds.isEmpty()) return List.of();
        List<Question> questions = questionRepository.findAllWithQuestionConcepts().stream()
            .filter(q -> questionIds.contains(q.getId()))
            .toList();
        return questions.stream()
            .flatMap(q -> q.getQuestionSolutions().stream()
                .sorted((a, b) -> Byte.compare(a.getStep(), b.getStep()))
                .map(sol -> new ReviewQuestionDto(
                    q.getId(),
                    q.getQuestionImg(),
                    q.getQuestionText(),
                    q.getAnswer(),
                    sol.getId(),
                    sol.getSolutionContent(),
                    sol.getStep()
                ))
            ).toList();
    }
}
