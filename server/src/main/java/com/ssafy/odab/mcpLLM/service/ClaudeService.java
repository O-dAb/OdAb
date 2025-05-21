package com.ssafy.odab.mcpLLM.service;

import com.ssafy.odab.mcpLLM.dto.*;
import org.springframework.stereotype.Service;
import reactor.core.publisher.Mono;

@Service
public interface ClaudeService {
    Mono<ApiResponseDto> sendMathProblem(ApiRequestDto apiRequestDto, Integer userId);

    Mono<ClaudeTextApiResponseDto> extractProblem(ApiRequestDto apiRequestDto, Integer userId);

    Mono<Boolean> isCorrectAnswer(String answer, String questionText, String userAnswerText, Integer userId);

    Mono<ApiResponseDto> searchSimilarQuestions(ApiRequestDto apiRequestDto, Integer userId);

    Mono<FixProblemResponseDto> fixProblem(FixProblemRequestDto fixProblemRequestDto, Integer userId);

    Mono<String> extractTextByAnswer(String userAnswerImg);
}
