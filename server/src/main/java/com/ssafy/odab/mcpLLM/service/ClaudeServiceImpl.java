package com.ssafy.odab.mcpLLM.service;

import com.fasterxml.jackson.core.JsonProcessingException;
import com.fasterxml.jackson.databind.ObjectMapper;
import com.ssafy.odab.common.service.S3ServiceImpl;
import com.ssafy.odab.domain.concept.entity.QuestionConcept;
import com.ssafy.odab.domain.concept.entity.SubConcept;
import com.ssafy.odab.domain.concept.repository.QuestionConceptRepository;
import com.ssafy.odab.domain.concept.repository.SubConceptRepository;
import com.ssafy.odab.domain.learning.entity.LastLearningTime;
import com.ssafy.odab.domain.learning.repository.LastLearningDateRepository;
import com.ssafy.odab.domain.question.entity.Question;
import com.ssafy.odab.domain.question.entity.QuestionSolution;
import com.ssafy.odab.domain.question.repository.QuestionRepository;
import com.ssafy.odab.domain.question.repository.QuestionSolutionRepository;
import com.ssafy.odab.domain.user.entity.User;
import com.ssafy.odab.domain.user.repository.UserRepository;
import com.ssafy.odab.domain.user.service.JwtService;
import com.ssafy.odab.mcpLLM.config.ClaudeConfig;
import com.ssafy.odab.mcpLLM.dto.*;
import com.ssafy.odab.mcpLLM.image.ImageEncode;
import com.ssafy.odab.mcpLLM.rag.entity.RagQuestion;
import com.ssafy.odab.mcpLLM.rag.entity.RagQuestionSolution;
import com.ssafy.odab.mcpLLM.rag.repository.RagQuestionRepository;
import com.ssafy.odab.mcpLLM.toolFactory.SequentialThinkingFactory;
import com.ssafy.odab.mcpLLM.toolFactory.ToolUtil;
import lombok.RequiredArgsConstructor;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import reactor.core.publisher.Mono;
import org.springframework.http.HttpEntity;
import org.springframework.http.HttpHeaders;
import org.springframework.http.HttpMethod;
import org.springframework.http.ResponseEntity;
import org.springframework.web.client.RestTemplate;

import java.io.IOException;
import java.time.Duration;
import java.time.LocalDateTime;
import java.util.*;

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
    private final SubConceptRepository subConceptRepository;
    private final QuestionConceptRepository questionConceptRepository;
    private final LastLearningDateRepository lastLearningDateRepository;
    private final RagQuestionRepository ragQuestionRepository;
    private final JwtService jwtService;
    private String modelVersion = "claude-3-5-sonnet-20240620";    //사용할 모델명
    //    private String modelVersion = "claude-3-7-sonnet-20250219";	//사용할 모델명
    private int maxTokens = 4000;                    //최대 사용 가능한 토큰 수
    private final int MAX_DEPTH = 20;
    private final int REQUEST_TIMEOUT_SECONDS = 30; // 타임아웃 시간 (초)
    private final int MAX_RETRIES = 3; // 최대 재시도 횟수



    @Transactional
    public Mono<ApiResponseDto> extractProblem(ApiRequestDto apiRequestDto) {
        List<Object> contents = new ArrayList<>();
        String prompt = """
                해당 이미지를 텍스트로 변환해줘.
                텍스트 이외의 다른 대답은 하지마.
                """;
        // 유저 대화내용 content 생성후 contents 에 넣음.
        contents.add(ClaudeRequestApiDto.TextContent.builder()
                .type("text")
                .text(prompt)
                .build());
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
        // 보낼 메시지 생성
        List<ClaudeRequestApiDto.Message> sendMessages = new ArrayList<>();
        sendMessages.add(ClaudeRequestApiDto.Message.builder()
                .role("user")
                .content(contents)
                .build());
        ClaudeRequestApiDto request = ClaudeRequestApiDto.builder()
                .model(modelVersion)
                .max_tokens(maxTokens)
                .messages(sendMessages)
                .build();


        return sendClaudeApi(request, sendMessages, 0, true)
                .flatMap(response -> {
                    String problem = response.getContent().get(0).getText();
                    apiRequestDto.setUserAsk(problem);
                    return searchSimilarQuestions(apiRequestDto);
                });
    }

    @Transactional
    // FAISS 서버에 질문을 보내고 유사한 문제 ID와 유사도 점수를 받는 메소드 (동기 방식)
    public Mono<ApiResponseDto> searchSimilarQuestions(ApiRequestDto apiRequestDto) {
        try {
            // RestTemplate 생성
            RestTemplate restTemplate = new RestTemplate();

            // 요청 헤더 설정
            HttpHeaders headers = new HttpHeaders();
            headers.setContentType(org.springframework.http.MediaType.APPLICATION_JSON);
            String problem = apiRequestDto.getUserAsk();
            // 요청 본문 생성
            FaissRequest request = new FaissRequest(problem);

            // HTTP 요청 엔티티 생성
            HttpEntity<FaissRequest> entity = new HttpEntity<>(request, headers);

            // FAISS 서버에 POST 요청 보내기
            ResponseEntity<FaissResponse> response = restTemplate.exchange(
                    "https://k12b103.p.ssafy.io/api/python/search",
                    HttpMethod.POST,
                    entity,
                    FaissResponse.class
            );
            Integer questionId = Objects.requireNonNull(response.getBody()).getQuestion_id();
            RagQuestion question = ragQuestionRepository.findByIdWithSolutions(questionId).orElseThrow(
                    () -> new RuntimeException("not find question by questionId")
            );
            StringBuilder sb = new StringBuilder();
            sb.append("너는 최고의 선생님이야 다음 로직을 따라서 문제를 풀어줘.\n")
                    .append("문제 : \n")
                    .append(problem)
                    .append("\n")
                    .append("다음은 기존 데이터 베이스에서 유사한 문제를 찾아서 보여주는거야.\n")
                    .append("필요하다면 활용해서 풀어도 돼.\n");
            sb.append(String.format("""
                                문제 : %s
                                다음은 기존 데이터 베이스에서 유사한 문제를 찾아서 보여주는거야. 필요하다면 활용해서 풀어도 돼.
                                참고문제 : %s
                                """, problem, question.getQuestionText()));

            for (RagQuestionSolution solution : question.getQuestionSolutions()) {
                sb.append(String.format("""
                                참고 문제 풀이
                                step %d : %s
                                """, solution.getStep(), solution.getSolutionContent()));
            }
            ApiRequestDto requestDto = new ApiRequestDto();
            requestDto.setUserAsk(sb.toString());
            requestDto.setImageData(apiRequestDto.getImageData());

            return sendMathProblem(requestDto);
        } catch (Exception e) {
            e.printStackTrace();
            System.out.println("FAISS 서버 요청 오류: " + e.getMessage());
            return null;
        }
    }




    /**
     * historyMessages 에는 과거 메시지와 내가 현재 질문할
     */
    @Transactional
    public Mono<ApiResponseDto> sendMathProblem(ApiRequestDto apiRequestDto) {
        List<Object> contents = new ArrayList<>();
        // 유저 대화내용 content 생성후 contents 에 넣음.
        contents.add(ClaudeRequestApiDto.TextContent.builder()
                .type("text")
                .text(apiRequestDto.getUserAsk())
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
        return sendClaudeApi(request, sendMessages, 0, false)
                .flatMap(response -> {
                    // 유저 찾기
                    Integer userId = jwtService.getUserId();
                    User user = userRepository.findByIdWithLastLearningTimes(userId).orElseThrow(
                            () -> new RuntimeException("User not found")
                    );
                    String dirName = "product";
                    String imageUrl = s3ServiceImpl.uploadFile(apiRequestDto.getImageData(), dirName);

                    ClaudeRequestApiDto.Message message = sendMessages.get(sendMessages.size() - 1);
                    ClaudeRequestApiDto.TextContent content = (ClaudeRequestApiDto.TextContent) message.getContent().get(0);
                    String str = content.getText();

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
                    List<String> solutionsForDto = new ArrayList<>();
                    Byte i = 1;
                    for (String step : questionJsonDto.getSteps()) {
                        solutionsForDto.add(step);
                        QuestionSolution questionSolution = QuestionSolution.builder()
                                .question(question)
                                .step(i)
                                .solutionContent(step)
                                .build();
                        solutions.add(questionSolution);
                        i++;
                    }
                    // 한 번에 모든 QuestionSolution 저장
                    questionSolutionRepository.saveAll(solutions);

                    List<QuestionConcept> concepts = new ArrayList<>();
                    List<String> conceptsForDto = new ArrayList<>();
                    for (Integer concept : questionJsonDto.getConcept()) {
                        SubConcept subConcept = subConceptRepository.findById(concept).orElseThrow(
                                () -> new RuntimeException("Sub concept not found")
                        );
                        // 마지막 학습시간을 현재시간으로 업데이트
                        for (LastLearningTime lastLearningTime : user.getLastLearningTimes()) {
                            if (Objects.equals(lastLearningTime.getSubConcept().getId(), subConcept.getId())) {
                                lastLearningTime.updateLastLearningDate(LocalDateTime.now());
                                lastLearningDateRepository.save(lastLearningTime);
                            }
                        }
                        conceptsForDto.add(subConcept.getConceptType());
                        QuestionConcept questionConcept = QuestionConcept.builder()
                                .question(question)
                                .subConcept(subConcept)
                                .build();
                        concepts.add(questionConcept);
                    }
                    questionConceptRepository.saveAll(concepts);
                    ApiResponseDto apiResponseDto = ApiResponseDto.builder()
                            .questionText(questionJsonDto.getQuestion())
                            .answer(questionJsonDto.getAnswer())
                            .imageUrl(imageUrl)
                            .questionSolution(solutionsForDto)
                            .subConcepts(conceptsForDto)
                            .build();
                    return Mono.just(apiResponseDto);
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
            int depth,
            boolean isFirst) {
        System.out.println("request = " + request);
        ArrayDeque<Integer> toolUseIndexQueue = new ArrayDeque<>();
//        System.out.println("request = " + request.getMessages());
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
                        return sendClaudeApi(request, sendMessages, depth + 1, false);
                    } else if (!isFirst) {
                        // toolUse가 없을 때 마지막으로 요청을 한 번 더 보내 총 정리를 수행
                        return sendClaudeApiForSummary(request, sendMessages);
                    } else {
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
                    System.out.println("Claude Api Error: " + errorMessage);
                    return Mono.just(ClaudeResponseApiDto.getClaudeErrorDto(errorMessage));
                });
    }


    @Transactional
    public Mono<ClaudeResponseApiDto> sendClaudeApiForSummary(
            ClaudeRequestApiDto request,
            List<ClaudeRequestApiDto.Message> sendMessages) {
        List<Object> summaryContents = new ArrayList<>();
        List<SubConcept> subConcepts = subConceptRepository.findAll();
        StringBuilder sb = new StringBuilder();

        sb.append("""
                아래에 맞춰 답변해줘.
                1. 지금까지의 대화 내용을 바탕으로 정리해줘.
                2. [[]] 안의 내용은 너가 채워 넣어야하는 부분이야.
                3. question 은 문제야.
                4. step 은 너가 문제 푼 내용이야. step10 이내로 만들어줘.
                5. concept 은 사용된 수학 개념을 적어줘. 수학개념은 아래에서 가장 적절한 개념을 최대 5개 골라서 사용해줘. 적절한 것이 없을경우 빈배열로 반환해줘. 각 개념에 맞는 숫자로 반환해줘.
                """);

        int conceptIndex = 1;
        for (SubConcept concept : subConcepts) {
            sb.append(String.format("""
                            5-%d. %s = %d%n
                    """, conceptIndex++, concept.getConceptType(), concept.getId()));
        }


        sb.append("""
                6. 아래 형식에 맞춰서 정리해주고 형식 이외의 대답은 넣지마.
                
                {
                  "question":"[[문제 내용]]",
                  "steps": [
                    "[[step1의 대한 내용]]",
                    "[[step2의 대한 내용]]",
                    "[[step3의 대한 내용]]"
                  ],
                  "answer":"[[정답]]",
                  "concept": [
                    "[[사용된 수학 개념1. ex) 1]]",
                    "[[사용된 수학 개념2. ex) 2]]"
                  ]
                }
                """);
        System.out.println("sb.toString() = " + sb);
        summaryContents.add(ClaudeRequestApiDto.TextContent.builder()
                .type("text")
                .text(sb.toString())
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
