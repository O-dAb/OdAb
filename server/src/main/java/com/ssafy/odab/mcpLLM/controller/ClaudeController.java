package com.ssafy.odab.mcpLLM.controller;

import com.ssafy.odab.domain.user.service.JwtService;
import com.ssafy.odab.mcpLLM.dto.*;
import com.ssafy.odab.mcpLLM.service.ClaudeService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.MediaType;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;
import reactor.core.publisher.Mono;

@RestController
@RequestMapping("/api/claude")
@RequiredArgsConstructor
public class ClaudeController {
    private final ClaudeService claudeService;
    private final JwtService jwtService;

    @PostMapping(consumes = MediaType.MULTIPART_FORM_DATA_VALUE)
    public Mono<ApiResponseDto> apiRequest(
            @RequestParam(value = "userAsk") String userAsk,
            @RequestParam(value = "imageData") MultipartFile imageData) {
        // !!!!!!수정포인트!!!!!!
//        Integer userId = jwtService.getUserId();
        Integer userId = 1;
        ApiRequestDto apiRequestDto = new ApiRequestDto();
        apiRequestDto.setUserAsk(userAsk);
        apiRequestDto.setImageData(imageData);
        return claudeService.searchSimilarQuestions(apiRequestDto, userId);
    }

    @PostMapping(value = "/text", consumes = MediaType.MULTIPART_FORM_DATA_VALUE)
    public Mono<ClaudeTextApiResponseDto> apiRequest2(
            @RequestParam(value = "imageData") MultipartFile imageData) {
        // !!!!!!수정포인트!!!!!!
//        Integer userId = jwtService.getUserId();
        Integer userId = 1;
        ApiRequestDto apiRequestDto = new ApiRequestDto();
        apiRequestDto.setImageData(imageData);
        return claudeService.extractProblem(apiRequestDto, userId);
    }

    @PostMapping(value = "/fix")
    public Mono<FixProblemResponseDto> apiRequest3(
            @RequestBody FixProblemRequestDto fixProblemRequestDto) {
        // !!!!!!수정포인트!!!!!!
//        Integer userId = jwtService.getUserId();
        Integer userId = 1;
        return claudeService.fixProblem(fixProblemRequestDto, userId);
    }
}