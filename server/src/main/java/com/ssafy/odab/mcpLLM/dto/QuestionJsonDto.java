package com.ssafy.odab.mcpLLM.dto;

import lombok.Builder;
import lombok.Data;
import lombok.Getter;
import lombok.Setter;
import lombok.NoArgsConstructor;
import lombok.AllArgsConstructor;

import java.util.List;

@Builder
@Data
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
public class QuestionJsonDto {
    private String question;
    private String answer;
    private List<String> steps;
    private List<String> concept;
}
