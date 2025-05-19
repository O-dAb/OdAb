package com.ssafy.odab.mcpLLM.dto;

import lombok.*;

// 응답 DTO
@Setter
@Getter
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class FaissResponse {
    private Integer question_id;
    private Double similarity;
}