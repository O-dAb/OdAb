package com.ssafy.odab.domain.learning.service;

import com.ssafy.odab.domain.learning.dto.ReviewPageResponseDto;

public interface LearningService {
    ReviewPageResponseDto getReviewMain(Integer userId);
}
