package com.ssafy.odab.mcpLLM.dto;

import com.fasterxml.jackson.annotation.JsonInclude;
import lombok.Builder;
import lombok.Data;

import java.util.List;

@Builder
@Data
public class ApiRequestDto {
    private String userAsk;
    private List<String> imagePaths;
}