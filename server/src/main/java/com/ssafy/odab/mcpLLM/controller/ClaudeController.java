package com.ssafy.odab.mcpLLM.controller;

import com.ssafy.odab.mcpLLM.dto.ApiRequestDto;
import com.ssafy.odab.mcpLLM.dto.ClaudeResponseApiDto;
import com.ssafy.odab.mcpLLM.service.ClaudeService;
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