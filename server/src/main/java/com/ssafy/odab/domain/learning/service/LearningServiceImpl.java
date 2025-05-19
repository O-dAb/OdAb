package com.ssafy.odab.domain.learning.service;

import java.time.LocalDate;
import java.util.Arrays;
import java.util.List;
import java.util.stream.Collectors;

import org.springframework.stereotype.Service;

import com.ssafy.odab.domain.concept.entity.MajorConcept;
import com.ssafy.odab.domain.concept.repository.MajorConceptRepository;
import com.ssafy.odab.domain.learning.dto.ReviewPageResponseDto;
import com.ssafy.odab.domain.learning.repository.LastLearningDateRepository;
import com.ssafy.odab.domain.question_result.repository.QuestionResultRepository;

import lombok.RequiredArgsConstructor;

@Service
@RequiredArgsConstructor
public class LearningServiceImpl implements LearningService {

    private final QuestionResultRepository questionResultRepository;
    private final LastLearningDateRepository lastLearningDateRepository;
    private final MajorConceptRepository majorConceptRepository;

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
}
