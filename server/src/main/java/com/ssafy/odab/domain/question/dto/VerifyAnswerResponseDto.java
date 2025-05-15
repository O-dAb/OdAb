package com.ssafy.odab.domain.question.dto;

import lombok.Builder;
import lombok.RequiredArgsConstructor;

@Builder
@RequiredArgsConstructor
public class VerifyAnswerResponseDto {

    private final Boolean correct;
    private final String message;
}
