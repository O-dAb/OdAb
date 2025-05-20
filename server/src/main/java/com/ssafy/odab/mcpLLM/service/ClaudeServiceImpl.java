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
import com.ssafy.odab.domain.question_result.entity.QuestionResult;
import com.ssafy.odab.domain.question_result.repository.QuestionResultRepository;
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
    private final QuestionResultRepository questionResultRepository;
    // !!!!!!수정포인트!!!!!!
    private String modelVersion = "claude-3-5-sonnet-20240620";    //사용할 모델명
//        private String modelVersion = "claude-3-7-sonnet-20250219";	//사용할 모델명
    private int maxTokens = 4000;                    //최대 사용 가능한 토큰 수
    private final int MAX_DEPTH = 15;
    private final int REQUEST_TIMEOUT_SECONDS = 30; // 타임아웃 시간 (초)
    private final int MAX_RETRIES = 3; // 최대 재시도 횟수
    @Transactional
    public Mono<FixProblemResponseDto> fixProblem(FixProblemRequestDto fixProblemRequestDto, Integer userId) {
        List<Object> contents = new ArrayList<>();
        String prompt = String.format("""
                아래 문제를 사용자 요청에 따라 수정해줘.
                수정된 문제를 반환해줘.
                문제 이외의 다른 대답은 하지마.
                
                수정될 문제 :
                %s
                
                사용자 요청 :
                %s
                """, fixProblemRequestDto.getProblem(), fixProblemRequestDto.getUserAsk());
        // 유저 대화내용 content 생성후 contents 에 넣음.
        contents.add(ClaudeRequestApiDto.TextContent.builder()
                .type("text")
                .text(prompt)
                .build());
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


        return sendClaudeApi(request, sendMessages, 0, true, userId)
                .flatMap(response -> {
                    System.out.println("response = " + response.getContent().get(0).getText());;
                    FixProblemResponseDto fixProblemResponseDto = FixProblemResponseDto.builder()
                            .problem(response.getContent().get(0).getText())
                            .build();
                    return Mono.just(fixProblemResponseDto);
                });
    }

    @Transactional
    public Mono<ClaudeTextApiResponseDto> extractProblem(ApiRequestDto apiRequestDto, Integer userId) {
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


        return sendClaudeApi(request, sendMessages, 0, true, userId)
                .flatMap(response -> {
                    String problem = response.getContent().get(0).getText();
                    ClaudeTextApiResponseDto apiResponseDto = ClaudeTextApiResponseDto.builder()
                            .questionText(problem)
                            .build();
                    return Mono.just(apiResponseDto);
                });
    }

    @Override
    @Transactional
    public Mono<Boolean> isCorrectAnswer(String answer, String questionText, String userAnswerImg, Integer userId) {
        List<Object> contents = new ArrayList<>();
        // 정답을 추출하기 위한 프롬프트
        String extractPrompt = String.format("""
                이 이미지는 학생이 제출한 수학 문제 답안입니다.
                 \s
                        당신은 수학 OCR 전문가입니다. 이미지에서 수학 표현식을 정확하게 추출하고 분석하는 임무를 맡았습니다.
                       \s
                        이 이미지는 학생이 제출한 수학 문제 답안입니다. 최대한 정확하게 이미지의 수학 표현식을 추출해주세요.
                       \s
                        이 과정은 두 단계로 나누어 진행합니다:
                       \s
                        1단계: OCR 추출\s
                        - 이미지에 보이는 모든 수학 기호, 숫자, 문자를 있는 그대로 정확히 추출하세요.
                        - 분수는 반드시 '분자/분모' 형태로 추출하세요.
                        - 분자와 분모는 정확하게 추출하세요.
                        - 숫자, 변수, 연산자 사이의 관계를 정확히 유지하세요.
                        - 보이는 그대로 추출하고, 수학적 해석이나 변환은 하지 마세요.
                       \s
                        2단계: 정답 비교
                        - 추출한 표현식이 아래 정답과 정확히 일치하는지 확인하세요.
                        - 수학적으로 동등한 표현(예: 2/4와 1/2)도 형태가 다르면 불일치로 판단하세요.
                        - 분수의 경우 분자와 분모가 바뀌면 반드시 불일치입니다.
                        - 부분적 답변(수식의 일부만 있는 경우)은 불일치입니다.
                 \s
                  문제 내용: %s
                  실제 정답: %s
                 \s
                  응답은 아래 형식을 정확히 따라주세요:
                  추출된 답변: [추출한 답변 - 없으면 "추출 불가"라고 표시]
                  완전 일치 여부: [완전 일치/불일치]
                  불일치 이유: [불일치인 경우 구체적인 이유 - 일치라면 "해당 없음"]
                  최종 판정: [정답/오답]
                 \s
                  주의:\s
                  - 정답으로 판정하려면 추출된 답변이 제시된 정답과 완전히 일치해야 합니다.
                  - 같은 수학적 의미라도 표현이 다르면 불일치입니다. (예: 2x 대신 x+x는 불일치)
                  - 수식의 일부만 작성된 경우는 오답입니다. (예: f(x) = 6x - 2에서 f(x)만 있다면 오답)
                  - 변수나 기호가 잘못된 경우도 오답입니다. (예: f(x) 대신 f(y)는 오답)
                  - 분수의 경우 분자와 분모의 위치가 바뀌면 다른 값이므로 반드시 오답으로 처리해야 합니다.
                """, questionText, answer);

        contents.add(ClaudeRequestApiDto
                .TextContent
                .builder()
                .type("text")
                .text(extractPrompt)
                .build());

        try {
            contents.add(ClaudeRequestApiDto
                    .ImageContent.builder()
                    .type("image")
                    .source(ClaudeRequestApiDto
                            .Source
                            .builder()
                            .type("base64")
                            .media_type("image/png")
                            .data(userAnswerImg)
                            .build())
                    .build());
        } catch (Exception e) {
            e.printStackTrace();
            throw new RuntimeException("이미지 인코딩 실패", e);
        }

        // 메시지 생성
        List<ClaudeRequestApiDto.Message> sendMessages = new ArrayList<>();
        sendMessages.add(ClaudeRequestApiDto.
                Message
                .builder()
                .role("user")
                .content(contents)
                .build());
        ClaudeRequestApiDto request = ClaudeRequestApiDto.builder()
                .model("claude-3-7-sonnet-20250219")
                .max_tokens(maxTokens)
                .messages(sendMessages)
                .build();
        // 응답 처리
// 응답 처리
        Mono<Boolean> isCorrect = sendClaudeApi(request, sendMessages, 0, true, userId)
                .map(response -> {
                    String fullResponse = response.getContent().get(0).getText().trim();
//                    System.out.println("===== Claude 응답 시작 =====");
//                    System.out.println(fullResponse);
//                    System.out.println("===== Claude 응답 끝 =====");

                    // 정답 추출 및 판단
                    String extractedAnswer = extractFromResponse(fullResponse, "추출된 답변:");
                    String completeMatch = extractFromResponse(fullResponse, "완전 일치 여부:");
                    String mismatchReason = extractFromResponse(fullResponse, "불일치 이유:");
                    String finalJudgment = extractFromResponse(fullResponse, "최종 판정:");

//                    System.out.println("추출된 답변: " + extractedAnswer);
//                    System.out.println("완전 일치 여부: " + completeMatch);
//                    System.out.println("불일치 이유: " + mismatchReason);
//                    System.out.println("최종 판정: " + finalJudgment);

                    // 엄격한 판정 조건 적용
                    boolean isFullMatch = completeMatch.contains("완전 일치");
                    boolean isFinalCorrect = finalJudgment.contains("정답");

                    if (!isFullMatch || !isFinalCorrect) {
//                        System.out.println("엄격한 기준에 따라 오답으로 판정합니다.");
                        return false;
                    }


//                    System.out.println("정답으로 최종 판정합니다.");
                    return true;
                })
                .onErrorResume(e -> {
                    System.err.println("정답 확인 중 오류 발생: " + e.getMessage());
                    e.printStackTrace();
                    return Mono.just(false);
                });


        return isCorrect;
    }

    // 응답에서 특정 라벨 다음의 내용을 추출하는 헬퍼 메서드
    private String extractFromResponse(String response, String label) {
        if (!response.contains(label)) {
            return "";
        }

        int startIndex = response.indexOf(label) + label.length();
        int endIndex = response.indexOf("\n", startIndex);

        if (endIndex == -1) {
            return response.substring(startIndex).trim();
        } else {
            return response.substring(startIndex, endIndex).trim();
        }
    }


    @Transactional
    // FAISS 서버에 질문을 보내고 유사한 문제 ID와 유사도 점수를 받는 메소드 (동기 방식)
    public Mono<ApiResponseDto> searchSimilarQuestions(ApiRequestDto apiRequestDto, Integer userId) {
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
            // !!!!!!수정포인트!!!!!!
            ResponseEntity<FaissResponse> response = restTemplate.exchange(
//                    "https://k12b103.p.ssafy.io/api/python/search",
                    "http://localhost:8000/search",
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

            return sendMathProblem(requestDto, userId);
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
    public Mono<ApiResponseDto> sendMathProblem(ApiRequestDto apiRequestDto, Integer userId) {
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
        return sendClaudeApi(request, sendMessages, 0, false, userId)
                .flatMap(response -> {
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
                    QuestionResult questionResult = QuestionResult.builder()
                            .question(question)
                            .user(user)
                            .solvedAt(LocalDateTime.now())
                            .isCorrect(false)
                            .solutionImage(null)
                            .solutionImage("https://odab-s3-1.s3.ap-northeast-2.amazonaws.com/product/defaultImg.png")
                            .times(0)
                            .build();
                    questionResultRepository.save(questionResult);
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
            boolean isFirst,
            Integer userId) {
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
                        return sendClaudeApi(request, sendMessages, depth + 1, false, userId);
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
