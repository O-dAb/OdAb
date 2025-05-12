package com.ssafy.odab.mcpLLM.dto;

import lombok.Getter;
import lombok.Setter;
import org.springframework.web.multipart.MultipartFile;

@Getter
@Setter
public class ApiResponseDto {
    private String userAsk;
    private MultipartFile imageData;
}