package com.ssafy.odab.mcpLLM.service;

import com.ssafy.odab.mcpLLM.dto.ApiRequestDto;
import com.ssafy.odab.mcpLLM.dto.ApiResponseDto;
import org.springframework.stereotype.Service;
import reactor.core.publisher.Mono;

@Service
public interface ClaudeService {
    Mono<ApiResponseDto> sendMathProblem(ApiRequestDto apiRequestDto);

    Mono<ApiResponseDto> extractProblem(ApiRequestDto apiRequestDto);

    Mono<Boolean> isCorrectAnswer(String answer, String questionText, String userAnswerImg);
}