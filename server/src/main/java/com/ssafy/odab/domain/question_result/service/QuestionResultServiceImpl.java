package com.ssafy.odab.domain.question_result.service;

import com.ssafy.odab.domain.question.entity.Question;
import com.ssafy.odab.domain.question_result.dto.WrongQuestionResponseDto;
import com.ssafy.odab.domain.question_result.dto.WrongQuestionResponseDto.WrongQuestionDto;
import com.ssafy.odab.domain.question_result.repository.QuestionResultRepository;
import java.util.ArrayList;
import java.util.List;
import java.util.Set;
import java.util.stream.Collectors;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

@Service
@RequiredArgsConstructor
public class QuestionResultServiceImpl implements QuestionResultService {

  private final QuestionResultRepository questionResultRepository;

  @Override
  public WrongQuestionResponseDto findWrongAnswersByGrade(Byte grade, Integer userId) {
    // 회원이 푼 문제들 중 소분류에서 학년이 grade인것
    // 오답은 틀린것들만
    // 문제들중 틀린문제 걸러와서 소분류에서 학년이 grade 인 친구들 filter
    // subConcept에 대한 Set도 필요함
    List<Question> wrongQuestions = questionResultRepository.findWrongQuestionsByUserId(userId);
    System.out.println("=".repeat(100));
    System.out.println(wrongQuestions.size());
    System.out.println("=".repeat(100));
    List<WrongQuestionDto> gradeWrongQuestionResponseDtos = wrongQuestions.stream()
        .filter(question -> question.getSubConcept().getGradeLevel().getGrade().equals(grade))
        .map(question -> WrongQuestionDto.builder()
            .questionId(question.getId())
            .questionImg(question.getQuestionImg())
            .questionText(question.getQuestionText())
            .subConceptType(question.getSubConcept().getConceptType())
            .registDate(question.getRegistAt())
            .build()).collect(Collectors.toList());
    Set<String> subConceptTypes = gradeWrongQuestionResponseDtos.stream()
        .map(WrongQuestionDto::getSubConceptType).collect(Collectors.toSet());

    return WrongQuestionResponseDto.builder()
        .gradeWrongQuestionDtos(gradeWrongQuestionResponseDtos).subConceptTypes(subConceptTypes)
        .build();
  }

  @Override
  public WrongQuestionResponseDto findWrongAnswersBySchoolLevel(String schoolLevel, Integer userId) {
    // 회원이 틀린 전체 문제중 중학교, 고등학교 구분
    // middle = 1, 2, 3
    // high = 4, 5, 6
    List<Integer> grades = new ArrayList<>();
    if (schoolLevel.equals("middle")) {
      for(int i = 0; i < 3; i++) {
        grades.add(i + 1);
      }
    } else if(schoolLevel.equals("high")) {
      for(int i = 0; i < 3; i++) {
        grades.add(i + 4);
      }
    }
    List<Question> wrongQuestions = questionResultRepository.findWrongQuestionsByUserIdAndSchoolLevel(userId, grades);
    List<WrongQuestionDto> gradeWrongQuestionResponseDtos = wrongQuestions.stream()
        .map(question -> WrongQuestionDto.builder()
            .questionId(question.getId())
            .questionImg(question.getQuestionImg())
            .questionText(question.getQuestionText())
            .subConceptType(question.getSubConcept().getConceptType())
            .registDate(question.getRegistAt())
            .build()).collect(Collectors.toList());
    Set<String> subConceptTypes = gradeWrongQuestionResponseDtos.stream()
        .map(WrongQuestionDto::getSubConceptType).collect(Collectors.toSet());

    return WrongQuestionResponseDto.builder()
        .gradeWrongQuestionDtos(gradeWrongQuestionResponseDtos).subConceptTypes(subConceptTypes)
        .build();
  }
}
