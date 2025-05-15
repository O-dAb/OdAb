package com.ssafy.odab.mcpLLM.toolFactory;

import com.ssafy.odab.mcpLLM.dto.ClaudeRequestApiDto;
import com.ssafy.odab.mcpLLM.dto.ClaudeResponseApiDto;
import com.ssafy.odab.mcpLLM.mcpServer.SequentialThinkingServer;
import lombok.AllArgsConstructor;
import org.springframework.stereotype.Component;

import java.util.ArrayList;
import java.util.List;
import java.util.Map;
import java.util.Objects;

@Component
@AllArgsConstructor
public class ToolUtil {
    private final SequentialThinkingServer sequentialThinkingServer;

    public boolean hasToolUse(ClaudeResponseApiDto.Content content) {
        if (content == null) {
            throw new IllegalArgumentException("content is null");
        }
        return Objects.equals(content.getType(), "tool_use");
    }

    /**
     * content 와 historyMessages 를 넣어줘야함
     */
    public void useTool(ClaudeResponseApiDto.Content content, List<ClaudeRequestApiDto.Message> historyMessages) {
        List<Object> contents = new ArrayList<>();
        switch (content.getName()) {
            case "sequentialThinking":
                Map<String, Object> result = sequentialThinkingServer.processThought(content.input, content.getId());
                contents.add(ClaudeRequestApiDto.ToolResultContent.builder()
                                .type("tool_result")
                                .tool_use_id(content.getId())
                                .content(List.of(result))
                        .build());
                ClaudeRequestApiDto.Message message = ClaudeRequestApiDto.Message.builder()
                        .role("user")
                        .content(contents)
                        .build();
                historyMessages.add(message);
                break;
        }
    }
}
