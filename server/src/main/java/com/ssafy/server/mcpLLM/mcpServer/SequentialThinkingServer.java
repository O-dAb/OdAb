package com.ssafy.server.mcpLLM.mcpServer;
import com.ssafy.server.mcpLLM.dto.ThoughtData;
import org.springframework.stereotype.Component;

import java.util.*;
import java.util.stream.Collectors;

@Component
public class SequentialThinkingServer {
    private final List<ThoughtData> thoughtHistory = new ArrayList<>();
    private final Map<String, List<ThoughtData>> branches = new HashMap<>();

    private ThoughtData validateThoughtData(Map<String, Object> input) {
        if (!(input.get("thought") instanceof String)) {
            throw new IllegalArgumentException("Invalid thought: must be a string");
        }
        if (!(input.get("thoughtNumber") instanceof Number)) {
            throw new IllegalArgumentException("Invalid thoughtNumber: must be a number");
        }
        if (!(input.get("totalThoughts") instanceof Number)) {
            throw new IllegalArgumentException("Invalid totalThoughts: must be a number");
        }
        if (!(input.get("nextThoughtNeeded") instanceof Boolean)) {
            throw new IllegalArgumentException("Invalid nextThoughtNeeded: must be a boolean");
        }

        return new ThoughtData(
                (String) input.get("thought"),
                ((Number) input.get("thoughtNumber")).intValue(),
                ((Number) input.get("totalThoughts")).intValue(),
                (Boolean) input.get("nextThoughtNeeded"),
                (Boolean) input.getOrDefault("isRevision", null),
                (Integer) input.getOrDefault("revisesThought", null),
                (Integer) input.getOrDefault("branchFromThought", null),
                (String) input.getOrDefault("branchId", null),
                (Boolean) input.getOrDefault("needsMoreThoughts", null)
        );
    }

    private String formatThought(ThoughtData td) {
        String prefix;
        String context = "";

        if (Boolean.TRUE.equals(td.isRevision)) {
            prefix = "🔄 Revision";
            context = " (revising thought " + td.revisesThought + ")";
        } else if (td.branchFromThought != null) {
            prefix = "🌿 Branch";
            context = " (from thought " + td.branchFromThought + ", ID: " + td.branchId + ")";
        } else {
            prefix = "💭 Thought";
        }

        String header = prefix + " " + td.thoughtNumber + "/" + td.totalThoughts + context;
        int borderLen = Math.max(header.length(), td.thought.length()) + 4;
        String border = "─".repeat(borderLen);

// 동적으로 포맷 문자열 생성
        String lineFormat = "│ %-" + (borderLen - 2) + "s │\n";

        return String.format(
                "┌%s┐\n" +
                        "│ %s │\n" +
                        "├%s┤\n" +
                        lineFormat +
                        "└%s┘",
                border, header, border, td.thought, border);
    }

    public Map<String, Object> processThought(Map<String, Object> input, String toolUseId) {
        Map<String, Object> result = new HashMap<>();
        try {
            ThoughtData data = validateThoughtData(input);

            if (data.thoughtNumber > data.totalThoughts) {
                data.totalThoughts = data.thoughtNumber;
            }

            thoughtHistory.add(data);

            if (data.branchFromThought != null && data.branchId != null) {
                branches.computeIfAbsent(data.branchId, k -> new ArrayList<>()).add(data);
            }

            System.err.println(formatThought(data));

            Map<String, Object> content = new LinkedHashMap<>();
            content.put("thoughtNumber", data.thoughtNumber);
            content.put("totalThoughts", data.totalThoughts);
            content.put("nextThoughtNeeded", data.nextThoughtNeeded);
            content.put("branches", branches.keySet());
            content.put("thoughtHistoryLength", thoughtHistory.size());

            result.put("type", "text");
            result.put("text", prettyPrintJson(content));
        } catch (Exception e) {
            e.printStackTrace();
            result.put("isError", true);
            result.put("type", "error");
            result.put("text", prettyPrintJson(Map.of(
                    "error", e.getMessage(),
                    "status", "failed")));
        }
        return result;
    }

    private String prettyPrintJson(Object obj) {
        try {
            return new com.fasterxml.jackson.databind.ObjectMapper()
                    .writerWithDefaultPrettyPrinter()
                    .writeValueAsString(obj);
        } catch (Exception e) {
            return obj.toString();
        }
    }
}
