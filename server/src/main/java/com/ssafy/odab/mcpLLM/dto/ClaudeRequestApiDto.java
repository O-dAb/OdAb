package com.ssafy.odab.mcpLLM.dto;

import com.fasterxml.jackson.annotation.JsonInclude;
import lombok.Builder;
import lombok.Data;
import java.util.List;
import java.util.Map;

@Builder
@Data
@JsonInclude(JsonInclude.Include.NON_NULL)
public class ClaudeRequestApiDto {
    private String model;
    private int max_tokens;
    private List<Tool> tools;
    private List<Message> messages;

    @Data
    @Builder
    public static class Tool {
        String name;
        String description;
        InputSchema input_schema;
    }
    @Data
    @Builder
    public static class InputSchema {
        String type; // object
        Map<String, Property> properties;
        List<String> required;
    }
    /**
     * null넣으면 사라짐
     * 이후 추가적으로 필요한 속성들은 추가하고 사용.
     */
    @Data
    @Builder
    @JsonInclude(JsonInclude.Include.NON_NULL)
    public static class Property {
        String type; // string, boolean, integer 등등
        String description;
        Integer minimum;
    }





    @Data
    @Builder
    public static class Message {
        private String role;
        // TextContent 또는 ImageContent 또는 ToolUseContent 또는 ToolResultContent
        private List<Object> content;
    }
    @Data
    @Builder
    public static class TextContent {
        private String type; // text
        private String text; // LLM에 보낼 텍스트
    }
    @Data
    @Builder
    public static class ImageContent {
        private String type; // image
        private Source source; // 이미지가 있을때 사용
    }
    @Data
    @Builder
    public static class ToolUseContent {
        private String type; // tool_use
        private String id;
        private String name; // 툴 이름을 넣어주면됨
        private Map<String, Object> input;
    }
    @Data
    @Builder
    public static class ToolResultContent {
        private String type; // tool_result
        private String tool_use_id;
        // 무조건 SequentialThinkingServer 의 processThought 를 사용해야함
        private List<Map<String, Object>> content;
    }

    @Data
    @Builder
    public static class Source {
        private String type; // "base64"
        private String media_type; // MIME 타입 (예: "image/jpeg")
        private String data; // Base64로 인코딩된 이미지 데이터
    }
}