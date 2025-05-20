package com.ssafy.odab.mcpLLM.dto;

import lombok.Data;
import lombok.Getter;
import lombok.Setter;
import org.springframework.web.multipart.MultipartFile;

@Getter
@Setter
@Data
public class ClaudeTextApiRequestDto {
    private String userAsk;
}