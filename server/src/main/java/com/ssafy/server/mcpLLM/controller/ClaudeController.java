package com.ssafy.server.mcpLLM.controller;

import com.ssafy.server.mcpLLM.dto.ApiRequestDto;
import com.ssafy.server.mcpLLM.dto.ClaudeResponseApiDto;
import com.ssafy.server.mcpLLM.service.ClaudeService;
import lombok.RequiredArgsConstructor;
import org.springframework.web.bind.annotation.*;
import reactor.core.publisher.Mono;

@RestController
@RequiredArgsConstructor
@RequestMapping("/api/claude")
public class ClaudeController {
    private final ClaudeService claudeService;

    @PostMapping
    public Mono<ClaudeResponseApiDto> apiRequest(@RequestBody ApiRequestDto apiRequestDto) {
        return claudeService.sendMathProblem(apiRequestDto);
    }
}