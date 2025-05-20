package com.ssafy.odab.mcpLLM.dto;

import lombok.Builder;
import lombok.Getter;
import lombok.Setter;

import java.util.List;

@Getter
@Setter
@Builder
public class ClaudeTextApiResponseDto {
    String questionText;
}