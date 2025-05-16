package com.ssafy.odab.mcpLLM.dto;

import lombok.Builder;
import lombok.Getter;
import lombok.Setter;
import org.springframework.web.multipart.MultipartFile;

@Getter
@Setter
public class ApiRequestDto {
    private String userAsk;
    private MultipartFile imageData;
}