package com.ssafy.odab.mcpLLM.service;

import com.ssafy.odab.mcpLLM.config.ClaudeConfig;
import com.ssafy.odab.mcpLLM.dto.ApiRequestDto;
import com.ssafy.odab.mcpLLM.dto.ClaudeRequestApiDto;
import com.ssafy.odab.mcpLLM.dto.ClaudeResponseApiDto;
import com.ssafy.odab.mcpLLM.image.ImageEncode;
import com.ssafy.odab.mcpLLM.toolFactory.SequentialThinkingFactory;
import com.ssafy.odab.mcpLLM.toolFactory.ToolUtil;
import lombok.RequiredArgsConstructor;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.stereotype.Service;
import reactor.core.publisher.Mono;
import java.io.IOException;
import java.time.Duration;
import java.util.ArrayDeque;
import java.util.ArrayList;
import java.util.List;

@Service
@RequiredArgsConstructor
public class ClaudeServiceImpl implements ClaudeService{
    private final SequentialThinkingFactory sequentialThinkingFactory;
    private final ToolUtil toolUtil;
    private static final Logger logger = LoggerFactory.getLogger(ClaudeServiceImpl.class);
    private final ClaudeConfig claudeConfig;
    private String modelVersion = "claude-3-5-sonnet-20241022";	//사용할 모델명
//    private String modelVersion = "claude-3-7-sonnet-20250219";	//사용할 모델명
    private int maxTokens = 4000;					//최대 사용 가능한 토큰 수
    private final int MAX_DEPTH = 20;
    private final int REQUEST_TIMEOUT_SECONDS = 30; // 타임아웃 시간 (초)
    private final int MAX_RETRIES = 3; // 최대 재시도 횟수
    /**
     * historyMessages 에는 과거 메시지와 내가 현재 질문할
     *
     */
    public Mono<ClaudeResponseApiDto> sendMathProblem(ApiRequestDto apiRequestDto) {
        String userAsk = apiRequestDto.getUserAsk();
        // 이미지 인코딩하고 content 생성후 contents 에 넣음
        List<Object> contents = new ArrayList<>();
        // imagePath 에 데이터가 있을때만 imageContent를 만들어 넣는다.
        if (apiRequestDto.getImagePaths() != null && !apiRequestDto.getImagePaths().isEmpty()) {
            // Message 안에는 content 4종세트만 넣어야함.
            List<String> imagePaths = apiRequestDto.getImagePaths();
            // Object는 TextContent 또는 ImageContent가 들어감.
            String base64Image;
            String mimeType;
            for (String imagePath : imagePaths) {
                try {
                    base64Image = ImageEncode.encodeImageToBase64(imagePath);
                } catch (IOException e) {
                    e.printStackTrace();
                    throw new RuntimeException("일단 어쩔수 없이");
                }
                mimeType = ImageEncode.getMimeType(imagePath);
                ClaudeRequestApiDto.ImageContent content = ClaudeRequestApiDto.ImageContent.builder()
                        .type("image")
                        .source(ClaudeRequestApiDto.Source.builder()
                                .type("base64")
                                .media_type(mimeType)
                                .data(base64Image)
                                .build()
                        )
                        .build();
                contents.add(content);
            }
        }
        // 유저 대화내용 content 생성후 contents 에 넣음.
        contents.add(ClaudeRequestApiDto.TextContent.builder()
                .type("text")
                .text(userAsk)
                .build());

        // 보낼 메시지 생성
        List<ClaudeRequestApiDto.Message> sendMessages = new ArrayList<>();
        sendMessages.add(ClaudeRequestApiDto.Message.builder()
                .role("user")
                .content(contents)
                .build());


        // tool 추가해주기
        List<ClaudeRequestApiDto.Tool> tools = new ArrayList<>();
        sequentialThinkingFactory.addSequentialThinkingTools(tools);
        // 요청 DTO 생성하기
        ClaudeRequestApiDto request = ClaudeRequestApiDto.builder()
                .model(modelVersion)
                .max_tokens(maxTokens)
                .tools(tools)
                .messages(sendMessages)
                .build();
        return sendClaudeApi(request, sendMessages, 0);
    }

    /**
     * request 의 Messages 는 설정 안해도 됨.
     * sendMessages 로만 보낼 메시지 적용됨.
     */
    private Mono<ClaudeResponseApiDto> sendClaudeApi(
            ClaudeRequestApiDto request,
            List<ClaudeRequestApiDto.Message> sendMessages,
            int depth) {

        ArrayDeque<Integer> toolUseIndexQueue = new ArrayDeque<>();

        System.out.println("request = " + request.getMessages());
        //POST 요청하고 답변받기
        Mono<ClaudeResponseApiDto> a = claudeConfig.getWebClient().post()
                .bodyValue(request)
                .retrieve()
                .bodyToMono(ClaudeResponseApiDto.class)
                .timeout(Duration.ofSeconds(REQUEST_TIMEOUT_SECONDS))
                .doOnNext(response -> {
                    List<Object> contents = new ArrayList<>();
                    // 답변받은 내용 저장
                    for (int i = 0; i < response.getContent().size(); i++) {
                        ClaudeResponseApiDto.Content content = response.getContent().get(i);
                        if (!toolUtil.hasToolUse(content)) {
                            contents.add(ClaudeRequestApiDto.TextContent.builder()
                                    .type(content.getType())
                                    .text(content.getText())
                                    .build());
                        } else {
                            toolUseIndexQueue.add(i);
                            contents.add(ClaudeRequestApiDto.ToolUseContent.builder()
                                    .type(content.getType())
                                    .id(content.getId())
                                    .name(content.getName())
                                    .input(content.getInput())
                                    .build());
                        }
                    }
                    ClaudeRequestApiDto.Message responseMessage = ClaudeRequestApiDto.Message.builder()
                            .role(response.getRole())
                            .content(contents)
                            .build();
                    sendMessages.add(responseMessage);
                    // 답변받은 내용 저장 끝
                })
                .flatMap(response -> {
                    boolean isToolUse = !toolUseIndexQueue.isEmpty();
                    while (!toolUseIndexQueue.isEmpty()) {
                        int index = toolUseIndexQueue.poll();
                        ClaudeResponseApiDto.Content content = response.getContent().get(index);
                        toolUtil.useTool(content, sendMessages);
                    }
                    // 최대 왔다갔다 설정
                    if (depth > MAX_DEPTH) return Mono.just(response);
                    // 메시지 개수 설정
                    if (isToolUse && sendMessages.size() < 40) {
                        return sendClaudeApi(request, sendMessages, depth + 1);
                    } else {
                        // 여기 자동완성인데 이렇게 쓰면 어떻게 돼?
                        return Mono.just(response);
                    }
                })
                .retry(MAX_RETRIES)
                //에러날 시 error 답변 받기
                .onErrorResume(error -> {
                    error.printStackTrace();
                    String errorMessage = error.getMessage();
                    if (error instanceof java.util.concurrent.TimeoutException) {
                        errorMessage = "요청 시간이 초과되었습니다. 잠시 후 다시 시도해주세요.";
                        logger.error("Claude API 요청 타임아웃: {}", errorMessage);
                    } else {
                        logger.error("Claude Api Error: {}", errorMessage);
                    }
                    System.out.println("Claude Api Error: "+ errorMessage);
                    return Mono.just(ClaudeResponseApiDto.getClaudeErrorDto(errorMessage));
                });
        return a;
    }
}
