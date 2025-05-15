package com.ssafy.odab.domain.main.service;

import com.ssafy.odab.domain.learning.repository.LastLearningDateRepository;
import com.ssafy.odab.domain.main.dto.MainPageResponseDto;
import com.ssafy.odab.domain.question_result.repository.QuestionResultRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import java.time.LocalDate;
import java.util.*;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
public class MainServiceImpl implements MainService {
    private final LastLearningDateRepository lastLearningDateRepository;
    private final QuestionResultRepository questionResultRepository;

    // 복습 차수 기준일 (1, 4, 6, 13일차)
    private static final List<Integer> REVIEW_DAYS = Arrays.asList(1, 4, 6, 13);

    @Override
    public MainPageResponseDto getMainPage(Integer userId) {
        LocalDate today = LocalDate.now();
        List<LocalDate> reviewDates = REVIEW_DAYS.stream().map(today::minusDays).collect(Collectors.toList());

        // 오늘의 복습 리스트 조회
        List<Object[]> todayReviewRawList = questionResultRepository.findReviewDtosByUserIdAndDatesWithFirstWrong(userId, reviewDates);
        List<MainPageResponseDto.TodayReviewDto> todayReviewList = new ArrayList<>();
        for (Object[] arr : todayReviewRawList) {
            Integer subConceptId = ((Number) arr[0]).intValue();
            String subConceptType = (String) arr[1];
            LocalDate lastLearningTime = (arr[2] instanceof java.sql.Date) ? ((java.sql.Date) arr[2]).toLocalDate() : (LocalDate) arr[2];
            int reviewOrder = getReviewOrder(today, lastLearningTime);
            todayReviewList.add(MainPageResponseDto.TodayReviewDto.builder()
                    .subConceptId(subConceptId)
                    .subConceptType(subConceptType)
                    .lastLearningTime(lastLearningTime)
                    .reviewOrder(reviewOrder)
                    .build());
        }

        // 최근 학습한 소개념 1개 (가장 최근 날짜)
        List<Object[]> lastLearningRawList = lastLearningDateRepository.findAllSubConceptsWithLastLearningDate(userId);
        MainPageResponseDto.RecentStudySubConceptDto recentStudySubConcept = lastLearningRawList.stream()
                .filter(arr -> arr[2] != null)
                .max(Comparator.comparing(arr -> ((arr[2] instanceof java.sql.Date) ? ((java.sql.Date) arr[2]).toLocalDate() : (LocalDate) arr[2]), Comparator.naturalOrder()))
                .map(arr -> MainPageResponseDto.RecentStudySubConceptDto.builder()
                        .subConceptId(((Number) arr[0]).intValue())
                        .subConceptType((String) arr[1])
                        .lastLearningTime((arr[2] instanceof java.sql.Date) ? ((java.sql.Date) arr[2]).toLocalDate() : (LocalDate) arr[2])
                        .build())
                .orElse(null);

        return MainPageResponseDto.builder()
                .todayReviewList(todayReviewList)
                .recentStudySubConcept(recentStudySubConcept)
                .build();
    }

    // 복습차수(몇일차 복습인지) 계산
    private int getReviewOrder(LocalDate today, LocalDate lastLearningTime) {
        int diff = (int) (today.toEpochDay() - lastLearningTime.toEpochDay());
        for (int i = 0; i < REVIEW_DAYS.size(); i++) {
            if (diff == REVIEW_DAYS.get(i)) {
                return i + 1;
            }
        }
        return 0; // 복습차수 아님
    }
}