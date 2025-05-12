package com.ssafy.odab.mcpLLM.service;

import com.fasterxml.jackson.core.JsonProcessingException;
import com.fasterxml.jackson.databind.ObjectMapper;
import com.ssafy.odab.common.service.S3ServiceImpl;
import com.ssafy.odab.domain.question.entity.Question;
import com.ssafy.odab.domain.question.entity.QuestionSolution;
import com.ssafy.odab.domain.question.repository.QuestionRepository;
import com.ssafy.odab.domain.question.repository.QuestionSolutionRepository;
import com.ssafy.odab.domain.user.entity.User;
import com.ssafy.odab.domain.user.repository.UserRepository;
import com.ssafy.odab.mcpLLM.config.ClaudeConfig;
import com.ssafy.odab.mcpLLM.dto.ApiRequestDto;
import com.ssafy.odab.mcpLLM.dto.ClaudeRequestApiDto;
import com.ssafy.odab.mcpLLM.dto.ClaudeResponseApiDto;
import com.ssafy.odab.mcpLLM.dto.QuestionJsonDto;
import com.ssafy.odab.mcpLLM.image.ImageEncode;
import com.ssafy.odab.mcpLLM.toolFactory.SequentialThinkingFactory;
import com.ssafy.odab.mcpLLM.toolFactory.ToolUtil;
import lombok.RequiredArgsConstructor;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import reactor.core.publisher.Mono;

import java.io.IOException;
import java.time.Duration;
import java.time.LocalDateTime;
import java.util.ArrayDeque;
import java.util.ArrayList;
import java.util.List;

@Service
@RequiredArgsConstructor
public class ClaudeServiceImpl implements ClaudeService {
    private final SequentialThinkingFactory sequentialThinkingFactory;
    private final ToolUtil toolUtil;
    private static final Logger logger = LoggerFactory.getLogger(ClaudeServiceImpl.class);
    private final ClaudeConfig claudeConfig;
    private final ImageEncode imageEncode;
    private final QuestionRepository questionRepository;
    private final UserRepository userRepository;
    private final S3ServiceImpl s3ServiceImpl;
    private final QuestionSolutionRepository questionSolutionRepository;
    private String modelVersion = "claude-3-5-sonnet-20240620";    //사용할 모델명
    //    private String modelVersion = "claude-3-7-sonnet-20250219";	//사용할 모델명
    private int maxTokens = 4000;                    //최대 사용 가능한 토큰 수
    private final int MAX_DEPTH = 20;
    private final int REQUEST_TIMEOUT_SECONDS = 30; // 타임아웃 시간 (초)
    private final int MAX_RETRIES = 3; // 최대 재시도 횟수

    /**
     * historyMessages 에는 과거 메시지와 내가 현재 질문할
     */

    @Transactional
    public Mono<ClaudeResponseApiDto> sendMathProblem(ApiRequestDto apiRequestDto) {
        List<Object> contents = new ArrayList<>();
        if (apiRequestDto.getUserAsk() != null) {
            String userAsk = apiRequestDto.getUserAsk();
            // 유저 대화내용 content 생성후 contents 에 넣음.
            contents.add(ClaudeRequestApiDto.TextContent.builder()
                    .type("text")
                    .text(userAsk)
                    .build());
        }

        if (apiRequestDto.getImageData() != null) {
            try {
                String base64Image = imageEncode.encodeImageToBase64(apiRequestDto.getImageData());
                String mimeType = apiRequestDto.getImageData().getContentType();
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
            } catch (IOException e) {
                e.printStackTrace();
                throw new RuntimeException("이미지 인코딩 실패", e);
            }
        }

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
        return sendClaudeApi(request, sendMessages, 0)
                .flatMap(response -> {
                    Integer userId = 1;
                    User user = userRepository.findById(userId).orElseThrow(
                            () -> new RuntimeException("User not found")
                    );
                    String dirName = "product";
                    String imageUrl = s3ServiceImpl.uploadFile(apiRequestDto.getImageData(), dirName);

                    ClaudeRequestApiDto.Message message = sendMessages.get(sendMessages.size() - 1);
                    ClaudeRequestApiDto.TextContent content = (ClaudeRequestApiDto.TextContent) message.getContent().get(0);
                    String str = content.getText();
                    System.out.println("str = " + str);

                    ObjectMapper objectMapper = new ObjectMapper();
                    QuestionJsonDto questionJsonDto;
                    try {
                        questionJsonDto = objectMapper.readValue(str, QuestionJsonDto.class);
                    } catch (JsonProcessingException e) {
                        return Mono.error(new RuntimeException(e));
                    }
                    Question question = Question.builder()
                            .user(user)
                            .questionText(questionJsonDto.getQuestion())
                            .answer(questionJsonDto.getAnswer())
                            .questionImg(imageUrl)
                            .registedAt(LocalDateTime.now())
                            .build();

                    question = questionRepository.save(question); // 저장 후 반환된 엔티티를 받음
                    // QuestionSolution 생성 및 리스트에 추가
                    List<QuestionSolution> solutions = new ArrayList<>();
                    Byte i = 1;
                    for (String step : questionJsonDto.getSteps()) {
                        QuestionSolution questionSolution = QuestionSolution.builder()
                                .question(question)
                                .step(i)
                                .solution(step)
                                .build();
                        solutions.add(questionSolution);
                        i++;
                    }
                    // 한 번에 모든 QuestionSolution 저장
                    questionSolutionRepository.saveAll(solutions);

                    return Mono.just(response);
                });
    }

    /**
     * request 의 Messages 는 설정 안해도 됨.
     * sendMessages 로만 보낼 메시지 적용됨.
     */
    @Transactional
    public Mono<ClaudeResponseApiDto> sendClaudeApi(
            ClaudeRequestApiDto request,
            List<ClaudeRequestApiDto.Message> sendMessages,
            int depth) {
        ArrayDeque<Integer> toolUseIndexQueue = new ArrayDeque<>();

        System.out.println("request = " + request.getMessages());
        //POST 요청하고 답변받기
        // 답변받은 내용 저장
        // 답변받은 내용 저장 끝
        // 최대 왔다갔다 설정
        // 메시지 개수 설정
        // toolUse가 없을 때 마지막으로 요청을 한 번 더 보내 총 정리를 수행
        //에러날 시 error 답변 받기
        return claudeConfig.getWebClient().post()
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
                    if (sendMessages.size() > 40) {
                        return Mono.error(new RuntimeException("메시지가 너무 많습니다"));
                    }
                    if (isToolUse) {
                        return sendClaudeApi(request, sendMessages, depth + 1);
                    } else {
                        // toolUse가 없을 때 마지막으로 요청을 한 번 더 보내 총 정리를 수행
                        return sendClaudeApiForSummary(request, sendMessages);
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
                    System.out.println("Claude Api Error: " + errorMessage);
                    return Mono.just(ClaudeResponseApiDto.getClaudeErrorDto(errorMessage));
                });
    }


    @Transactional
    public Mono<ClaudeResponseApiDto> sendClaudeApiForSummary(
            ClaudeRequestApiDto request,
            List<ClaudeRequestApiDto.Message> sendMessages) {
        List<Object> summaryContents = new ArrayList<>();
        summaryContents.add(ClaudeRequestApiDto.TextContent.builder()
                .type("text")
                .text("""
                        아래에 맞춰 답변해줘.
                        1. 지금까지의 대화 내용을 바탕으로 정리해줘.
                        2. [[]] 안의 내용은 너가 채워 넣어야하는 부분이야.
                        3. question 은 문제야.
                        3. step 은 너가 문제 푼 내용이야. step10 이내로 만들어줘.
                        4. concept 은 사용된 수학 개념을 적어줘. 수학개념은 아래에서 가장 적절한 개념을 최대 5개 골라서 사용해줘. 적절한 것이 없을경우 "없음" 을 넣어줘.
                            4-1. 덧셈
                            4-2. 뺄셈
                            4-3. 곱셈
                            4-4. 나눗셈
                            4-5. 외접
                            4-6. 내접
                            4-7. 적분
                        5. 아래 형식에 맞춰서 정리해주고 형식 이외의 대답은 넣지마.
                        {
                          "question":"[[문제 내용]]",
                          "steps": [
                            "[[step1의 대한 내용]]",
                            "[[step2의 대한 내용]]",
                            "[[step3의 대한 내용]]",
                          ],
                          "answer":"[[정답]]"
                          "concept": [
                            "[[사용된 수학 개념1]]",
                            "[[사용된 수학 개념2]]"
                          ]
                        }
                        """)
                .build());
        ClaudeRequestApiDto.Message summaryMessage = ClaudeRequestApiDto.Message.builder()
                .role("user")
                .content(summaryContents)
                .build();
        sendMessages.add(summaryMessage);


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
                    System.out.println("Claude Api Error: " + errorMessage);
                    return Mono.just(ClaudeResponseApiDto.getClaudeErrorDto(errorMessage));
                });
        return a;
    }
}
