package com.ssafy.odab.mcpLLM.dto;

import lombok.Builder;
import lombok.Data;
import lombok.Getter;
import lombok.Setter;

@Getter
@Setter
@Data
@Builder
public class FixProblemRequestDto {
    private String problem;
    private String userAsk;
}