package com.ssafy.odab.mcpLLM.dto;

import lombok.Builder;
import lombok.Getter;
import lombok.Setter;
import org.springframework.web.multipart.MultipartFile;

import java.util.List;

@Getter
@Setter
@Builder
public class ApiResponseDto {
    String questionText;
    String answer;
    String imageUrl;
    List<String> questionSolution;
    List<String> concepts;
}