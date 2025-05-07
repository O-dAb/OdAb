package com.ssafy.server.mcpLLM.dto;

import lombok.*;
import java.util.List;
import java.util.Map;

@Data
public class ClaudeResponseApiDto {
    private String id;          // 고유아이디
    private String type;        // "message" or "error"
    private String role;        // 보통의 경우 모두 "assistant"
    private List<Content> content;
    private String model;       // 모델명
    private String stop_reason;     // (답변문장이 중간에 끊긴 경우 원인이 들어감) ["end_turn"(응답완료) / "max_tokens"(최대 토큰 수에 도달) / "stop_sequence"(stop_sequence 발현)] or null
    private String stop_sequence;   // [null / request에서 설정했던 stop_sequence값 ]
    private Usage usage;
//    private List<ToolUse> tool_use;

    @Data
    public static class Content {
        public String type;     // "tool_result" or "text" or error 정보
        public String text;     // 답변 내용
        public String id;
        public String name;
        public Map<String, Object> input;
    }

    @Data
    public static class Usage {
        public int input_tokens;    //input 토큰 수
        public int output_tokens;   //output 토큰 수
    }

//    @Data
//    public static class ToolUse {
//        public String id;
//        public String type;
//        public String name;
//        public Map<String, String> input; // Map<property_name, value>
//    }


    //error 답변인 경우 해당 함수 호출
    public static ClaudeResponseApiDto getClaudeErrorDto(String errorMessage) {
        ClaudeResponseApiDto claudeResponseApiDto = new ClaudeResponseApiDto();
        Content content = new Content();
        content.setText(errorMessage);
        claudeResponseApiDto.setType("error");
        claudeResponseApiDto.setContent(List.of(content));
        return claudeResponseApiDto;
    }

}
