package com.ssafy.odab.mcpLLM.dto;

import lombok.Builder;
import lombok.Data;
import lombok.Getter;
import lombok.Setter;

@Setter
@Getter
@Builder
@Data
public class FaissRequest {
        private String question;
    
        public FaissRequest(String question) {
            this.question = question;
        }

}