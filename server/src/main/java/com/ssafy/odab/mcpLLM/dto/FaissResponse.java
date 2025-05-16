package com.ssafy.odab.mcpLLM.dto;

import lombok.Builder;
import lombok.Data;
import lombok.Getter;
import lombok.Setter;

// 응답 DTO
@Setter
@Getter
@Builder
@Data
public class FaissResponse {
    private Integer question_id;
    private Double similarity;

}