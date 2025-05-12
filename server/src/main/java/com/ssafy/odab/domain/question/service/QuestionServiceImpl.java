package com.ssafy.odab.domain.question.service;

import com.ssafy.odab.domain.question.dto.VerifyAnswerRequestDto;
import com.ssafy.odab.domain.question.entity.Question;
import com.ssafy.odab.domain.question.repository.QuestionRepository;
import com.ssafy.odab.domain.question_result.entity.QuestionResult;
import com.ssafy.odab.domain.question_result.repository.QuestionResultRepository;

import java.io.File;
import java.time.LocalDateTime;
import java.util.UUID;

import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.web.multipart.MultipartFile;

@Service
@RequiredArgsConstructor
public class QuestionServiceImpl implements QuestionService {

  private final QuestionRepository questionRepository;
  private final QuestionResultRepository questionResultRepository;

  @Override
  public Boolean verifyAnswer(VerifyAnswerRequestDto verifyAnswerRequestDto) {

    // 문제에서 정답 여부 확인
    Question question = questionRepository.findById(verifyAnswerRequestDto.getQuestionId())
        .orElseThrow(() -> new IllegalArgumentException("문제를 찾을 수 없습니다."));

    // 정답결과 테이블에서 회원의 문제 조회
    QuestionResult questionResult = questionResultRepository.findByQuestionId(question.getId())
        .orElseThrow(() -> new IllegalArgumentException("문제 결과를 찾을 수 없습니다."));
    Boolean isCorrect = question.getAnswer().equals(verifyAnswerRequestDto.getAnswer());
    // 정답이 맞으면 풀이일자 수정, 정답여부 true
    // 정답이 틀리면 풀이일자 수정, 정답여부 false
    questionResult.changeVerifyAnswer(isCorrect, LocalDateTime.now());

    // 정답이 맞으면 true
    // 정답이 틀리면 false를 리턴
    return isCorrect;
  }
  @Override
  public Boolean createQuestion(MultipartFile file, String questionText) {

    return isCorrect;
  }
  private void saveQuestionImage(Question question, MultipartFile file) {
    // 배포할때는 위로 바꿔야 함
    String uploadDir = "/images/question";
//        String uploadDir = "c:/images/portfolio";
    if (file != null) {
      // 변수들
      String oriname = file.getOriginalFilename();
      String systemName = UUID.randomUUID().toString() + "_" + oriname;

      String imagePath = uploadDir + "/" + systemName;
      // 저장폴더 생성
      File dir = new File(uploadDir);
      boolean a = dir.mkdirs();
      // 실제 파일객체 생성
      File destFile = new File(imagePath);
      try {
        // 파일 저장
        file.transferTo(destFile);
        //파일 저장되면 객체 변경해서
        question.updateQuestionImg(imagePath);
      } catch (Exception e) {
        e.printStackTrace();
      }
    }
  }
}
