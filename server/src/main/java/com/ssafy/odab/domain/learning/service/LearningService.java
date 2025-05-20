package com.ssafy.odab.domain.learning.service;

import com.ssafy.odab.domain.learning.dto.ReviewPageResponseDto;
import java.util.List;
import com.ssafy.odab.domain.learning.controller.LearningController.ReviewQuestionDto;

public interface LearningService {
    ReviewPageResponseDto getReviewMain(Integer userId);
    List<ReviewQuestionDto> getTodayReviewQuestionsBySubConcept(Integer subConceptId, Integer userId);
    List<ReviewQuestionDto> getTomorrowReviewQuestionsBySubConcept(Integer subConceptId, Integer userId);
}
