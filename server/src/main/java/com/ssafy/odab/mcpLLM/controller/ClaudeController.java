package com.ssafy.odab.mcpLLM.controller;

import com.ssafy.odab.domain.user.service.JwtService;
import com.ssafy.odab.mcpLLM.dto.ApiRequestDto;
import com.ssafy.odab.mcpLLM.dto.ApiResponseDto;
import com.ssafy.odab.mcpLLM.service.ClaudeService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.MediaType;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;
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
            @RequestParam(value = "userAsk", required = false) String userAsk,
            @RequestParam(value = "imageData", required = false) MultipartFile imageData) {
        System.out.println("컨트롤러에서");
        Integer userId = jwtService.getUserId();
        ApiRequestDto apiRequestDto = new ApiRequestDto();
        if (userAsk != null) {
            apiRequestDto.setUserAsk(userAsk);
        }
        if (imageData != null) {
            apiRequestDto.setImageData(imageData);
        }
        return claudeService.extractProblem(apiRequestDto, userId);
    }
}