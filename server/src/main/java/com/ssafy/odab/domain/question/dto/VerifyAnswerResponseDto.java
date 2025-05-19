package com.ssafy.odab.domain.question.dto;

import lombok.Builder;
import lombok.Getter;

@Getter
@Builder
public class VerifyAnswerResponseDto {
    private final Boolean correct;
    private final String message;
}