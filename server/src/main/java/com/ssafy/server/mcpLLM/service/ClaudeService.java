package com.ssafy.server.mcpLLM.service;

import com.ssafy.server.mcpLLM.dto.ApiRequestDto;
import com.ssafy.server.mcpLLM.dto.ClaudeResponseApiDto;
import org.springframework.stereotype.Service;
import reactor.core.publisher.Mono;

@Service
public interface ClaudeService {
    Mono<ClaudeResponseApiDto> sendMathProblem(ApiRequestDto apiRequestDto);
}