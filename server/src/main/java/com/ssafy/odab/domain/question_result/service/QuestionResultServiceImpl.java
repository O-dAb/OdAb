package com.ssafy.odab.domain.question_result.service;

import com.ssafy.odab.domain.concept.entity.SubConcept;
import com.ssafy.odab.domain.concept.repository.MajorConceptRepository;
import com.ssafy.odab.domain.concept.repository.SubConceptRepository;
import com.ssafy.odab.domain.question.entity.Question;
import com.ssafy.odab.domain.question_result.dto.SubConceptWrongQuestionResponseDto;
import com.ssafy.odab.domain.question_result.dto.SubConceptWrongQuestionResponseDto.SubConceptWrongQuestionDto;
import com.ssafy.odab.domain.question_result.dto.WrongQuestionResponseDto;
import com.ssafy.odab.domain.question_result.dto.WrongQuestionResponseDto.WrongQuestionDto;
import com.ssafy.odab.domain.question_result.dto.WrongQuestionResponseDto.WrongQuestionDto.WrongQuestionSolution;
import com.ssafy.odab.domain.question_result.dto.WrongQuestionResponseDto.WrongQuestionSubconcept;
import com.ssafy.odab.domain.question_result.repository.QuestionResultRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.LocalDateTime;
import java.util.Comparator;
import java.util.List;

@Service
@RequiredArgsConstructor
public class QuestionResultServiceImpl implements QuestionResultService {

    private final SubConceptRepository subConceptRepository;
    private final QuestionResultRepository questionResultRepository;
    private final MajorConceptRepository majorConceptRepository;

    @Override
    @Transactional
    public WrongQuestionResponseDto findWrongAnswersByGrade(Byte grade, Integer userId) {
        // 회원이 푼 문제들 중 소분류에서 학년이 grade인것
        // 오답은 틀린것들만
        // 문제들중 틀린문제 걸러와서 소분류에서 학년이 grade 인 친구들 filter
        // subConcept에 대한 Set도 필요함
        List<Question> wrongQuestions = questionResultRepository.findWrongQuestionsByUserId(userId);
        wrongQuestions = wrongQuestions.stream().filter(
                question -> question.getQuestionConcepts().stream().anyMatch(
                        questionConcept -> questionConcept.getSubConcept().getGradeLevel().getGrade()
                                .equals(grade))).toList();
        System.out.println();
        System.out.println("문제 크기 : "+wrongQuestions.size());
        List<Integer> wrongQuestionIds = wrongQuestions.stream().map(Question::getId).toList();
        List<SubConcept> subConcepts = subConceptRepository.findByQuestionIds(wrongQuestionIds);
        // grade인 majorConcept 가져오기
        List<WrongQuestionResponseDto.WrongQuestionMajorConcept> majorConcepts
                = majorConceptRepository.findAllByGrade(grade).stream().map(WrongQuestionResponseDto.WrongQuestionMajorConcept::from).toList();
        List<WrongQuestionDto> gradeWrongQuestionResponseDtos = wrongQuestions.stream()
                .map(question -> WrongQuestionDto.builder()
                        .questionId(question.getId())
                        .questionImg(question.getQuestionImg())
                        .questionText(question.getQuestionText())
                        .registDate(question.getRegistedAt())
                        .wrongQuestionSubconceptList(question.getQuestionConcepts().stream()
                                .map(questionConcept -> WrongQuestionSubconcept.from(questionConcept.getSubConcept())).toList())
                        .answer(question.getAnswer())
                        .wrongQuestionSolutions(question.getQuestionSolutions().stream().map(
                                        WrongQuestionSolution::from)
                                .sorted(Comparator.comparingInt(WrongQuestionSolution::getStep))
                                .toList())
                        .build()).toList();
        return WrongQuestionResponseDto.builder()
                .gradeWrongQuestionDtos(gradeWrongQuestionResponseDtos)
                .majorConcepts(majorConcepts).build();
    }

//    @Override
//    @Transactional
//    public WrongQuestionResponseDto findWrongAnswersBySchoolLevel(String schoolLevel,
//                                                                  Integer userId) {
//        // 회원이 틀린 전체 문제중 중학교, 고등학교 구분
//        // middle = 1, 2, 3
//        // high = 4, 5, 6
//        List<Integer> grades = new ArrayList<>();
//        if (schoolLevel.equals("middle")) {
//            for (int i = 0; i < 3; i++) {
//                grades.add(i + 1);
//            }
//        } else if (schoolLevel.equals("high")) {
//            for (int i = 0; i < 3; i++) {
//                grades.add(i + 4);
//            }
//        }
//
//        List<Question> wrongQuestions = questionResultRepository.findWrongQuestionsByUserIdAndSchoolLevel(
//                userId, grades);
//        List<WrongQuestionDto> gradeWrongQuestionResponseDtos = wrongQuestions.stream()
//                .map(question -> WrongQuestionDto.builder()
//                        .questionId(question.getId())
//                        .questionImg(question.getQuestionImg())
//                        .questionText(question.getQuestionText())
//                        .registDate(question.getRegistedAt())
//                        .wrongQuestionSubconceptList(question.getQuestionConcepts().stream()
//                                .map(questionConcept -> WrongQuestionSubconcept.from(questionConcept.getSubConcept())).toList())
//                        .answer(question.getAnswer())
//                        .wrongQuestionSolutions(
//                                question.getQuestionSolutions().stream()
//                                        .map(WrongQuestionSolution::from)
//                                        .sorted(Comparator.comparingInt(WrongQuestionSolution::getStep))
//                                        .toList())
//                        .build()).toList();
//
//        // subConcepts 필요
//        List<WrongQuestionResponseDto.WrongQuestionMajorConcept> majorConcepts
//                = majorConceptRepository.findAllByGrade(grade).stream().map(WrongQuestionResponseDto.WrongQuestionMajorConcept::from).toList();
//        List<Integer> wrongQuestionIds = wrongQuestions.stream().map(Question::getId).toList();
//        List<SubConcept> subConcepts = subConceptRepository.findByQuestionIds(wrongQuestionIds);
//
//        Set<WrongQuestionSubconcept> wrongQuestionSubconcepts = subConcepts.stream()
//                .map(subConcept -> new WrongQuestionSubconcept(
//                        subConcept.getId(),
//                        subConcept.getConceptType()
//                )).collect(Collectors.toSet());
//
//        return WrongQuestionResponseDto.builder()
//                .gradeWrongQuestionDtos(gradeWrongQuestionResponseDtos)
//                .wrongQuestionSubconcepts(wrongQuestionSubconcepts).build();
//    }

    @Override
    @Transactional
    public SubConceptWrongQuestionResponseDto findWrongAnswersBySubConcept(Integer subConceptId,
                                                                           Integer userId) {
        // 주제별로 사용자가 틀린 문제 조회
        List<Question> wrongQuestions = questionResultRepository.findWrongQuestionsByUserId(userId);
        // 틀린문제 가져오기
        SubConcept subConcept = subConceptRepository.findById(subConceptId)
                .orElseThrow(() -> new IllegalArgumentException("개념을 찾을 수 없습니다."));
        // 틀린문제중 주제별 필터링
        List<Question> subConceptWrongQuestions = wrongQuestions.stream()
                .filter(question -> question.getQuestionConcepts().stream()
                        .anyMatch(
                                questionConcept -> questionConcept.getSubConcept().getId().equals(subConceptId)))
                .toList();
        return SubConceptWrongQuestionResponseDto.builder().subConceptType(subConcept.getConceptType())
                .subConceptId(subConcept.getId()).wrongQuestionDtos(subConceptWrongQuestions.stream().map(
                        SubConceptWrongQuestionDto::from).toList()).build();
    }

//    @Override
//    @Transactional
//    public WrongQuestionResponseDto findRecentWrongAnswersBySchoolLevel(String schoolLevel,
//                                                                        Integer userId,
//                                                                        LocalDateTime startTime) {
//        List<Integer> grades = new ArrayList<>();
//        if (schoolLevel.equals("middle")) {
//            for (int i = 0; i < 3; i++) {
//                grades.add(i + 1);
//            }
//        } else if (schoolLevel.equals("high")) {
//            for (int i = 0; i < 3; i++) {
//                grades.add(i + 4);
//            }
//        }
//
//        List<Question> wrongQuestions = questionResultRepository.findRecentWrongQuestionsByUserIdAndSchoolLevel(
//                userId, grades, startTime, LocalDateTime.now());
//        List<WrongQuestionDto> gradeWrongQuestionResponseDtos = wrongQuestions.stream()
//                .map(question -> WrongQuestionDto.builder()
//                        .questionId(question.getId())
//                        .questionImg(question.getQuestionImg())
//                        .questionText(question.getQuestionText())
//                        .registDate(question.getRegistedAt())
//                        .wrongQuestionSubconceptList(question.getQuestionConcepts().stream()
//                                .map(questionConcept -> WrongQuestionSubconcept.from(questionConcept.getSubConcept())).toList())
//                        .answer(question.getAnswer())
//                        .wrongQuestionSolutions(
//                                question.getQuestionSolutions().stream()
//                                        .map(WrongQuestionSolution::from)
//                                        .sorted(Comparator.comparingInt(WrongQuestionSolution::getStep))
//                                        .toList())
//                        .build()).toList();
//
//        // subConcepts 필요
//        List<Integer> wrongQuestionIds = wrongQuestions.stream().map(Question::getId).toList();
//        List<SubConcept> subConcepts = subConceptRepository.findByQuestionIds(wrongQuestionIds);
//
//        Set<WrongQuestionSubconcept> wrongQuestionSubconcepts = subConcepts.stream()
//                .map(subConcept -> new WrongQuestionSubconcept(
//                        subConcept.getId(),
//                        subConcept.getConceptType()
//                )).collect(Collectors.toSet());
//
//        return WrongQuestionResponseDto.builder()
//                .gradeWrongQuestionDtos(gradeWrongQuestionResponseDtos)
//                .wrongQuestionSubconcepts(wrongQuestionSubconcepts).build();
//    }

    @Override
    @Transactional
    public WrongQuestionResponseDto findRecentWrongAnswersByGrade(Byte grade, Integer userId,
                                                                  LocalDateTime startTime) {
        List<Question> wrongQuestions = questionResultRepository.findRecentWrongQuestionsByUserId(userId, startTime, LocalDateTime.now());
        wrongQuestions = wrongQuestions.stream().filter(
                question -> question.getQuestionConcepts().stream().anyMatch(
                        questionConcept -> questionConcept.getSubConcept().getGradeLevel().getGrade()
                                .equals(grade))).toList();
        List<Integer> wrongQuestionIds = wrongQuestions.stream().map(Question::getId).toList();
        List<SubConcept> subConcepts = subConceptRepository.findByQuestionIds(wrongQuestionIds);
        List<WrongQuestionDto> gradeWrongQuestionResponseDtos = wrongQuestions.stream()
                .map(question -> WrongQuestionDto.builder()
                        .questionId(question.getId())
                        .questionImg(question.getQuestionImg())
                        .questionText(question.getQuestionText())
                        .registDate(question.getRegistedAt())
                        .wrongQuestionSubconceptList(question.getQuestionConcepts().stream()
                                .map(questionConcept -> WrongQuestionSubconcept.from(questionConcept.getSubConcept())).toList())
                        .answer(question.getAnswer())
                        .wrongQuestionSolutions(question.getQuestionSolutions().stream().map(
                                        WrongQuestionSolution::from)
                                .sorted(Comparator.comparingInt(WrongQuestionSolution::getStep))
                                .toList())
                        .build()).toList();
        List<WrongQuestionResponseDto.WrongQuestionMajorConcept> majorConcepts
                = majorConceptRepository.findAllByGrade(grade).stream().map(WrongQuestionResponseDto.WrongQuestionMajorConcept::from).toList();
        return WrongQuestionResponseDto.builder()
                .gradeWrongQuestionDtos(gradeWrongQuestionResponseDtos)
                .majorConcepts(majorConcepts).build();
    }
}
