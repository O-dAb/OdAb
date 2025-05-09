package com.ssafy.odab.common.service;

import com.ssafy.odab.common.dto.ConceptQuestionListResponseDto;
import com.ssafy.odab.common.dto.GradeConceptResponseDto;
import com.ssafy.odab.domain.concept.entity.MajorConcept;
import com.ssafy.odab.domain.concept.entity.SubConcept;
import com.ssafy.odab.domain.concept.repository.MajorConceptRepository;
import com.ssafy.odab.domain.question.repository.QuestionRepository;
import java.util.ArrayList;
import java.util.List;
import java.util.stream.Collectors;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

@Service
@RequiredArgsConstructor
public class CommonServiceImpl implements CommonService {
    private final MajorConceptRepository majorConceptRepository;
    private final QuestionRepository questionRepository;

    //학년별 개념 조회 
    @Override
    public GradeConceptResponseDto getGradeConceptDetail(Byte grade, Integer userId) {
        List<MajorConcept> majorConcepts = majorConceptRepository.findAll().stream()
            .filter(mc -> mc.getGradeLevel() != null && grade.equals(mc.getGradeLevel().getGrade()))
            .collect(Collectors.toList());

        List<GradeConceptResponseDto.MajorConceptDto> majorConceptList = new ArrayList<>();
        for (MajorConcept majorConcept : majorConcepts) {
            List<GradeConceptResponseDto.SubConceptDto> subConceptList = new ArrayList<>();
            for (SubConcept subConcept : majorConcept.getSubConcepts()) {
                subConceptList.add(GradeConceptResponseDto.SubConceptDto.builder()
                    .subConceptId(subConcept.getId())
                    .subConceptType(subConcept.getConceptType())
                    .build());
            }
            majorConceptList.add(GradeConceptResponseDto.MajorConceptDto.builder()
                .majorConceptId(majorConcept.getId())
                .majorConceptType(majorConcept.getConceptType())
                .subConceptList(subConceptList)
                .build());
        }
        return GradeConceptResponseDto.builder()
            .majorConceptList(majorConceptList)
            .build();
    }
    //개념별 문제 조회
    @Override
    public ConceptQuestionListResponseDto getConceptQuestionList(Integer subConceptId, Integer userId) {
//        List<Question> questions = questionRepository.findAll().stream()
//            .filter(q -> q.getSubConcept().getId().equals(subConceptId))
//            .collect(Collectors.toList());
//
//        List<ConceptQuestionListResponseDto.QuestionDto> questionList = new ArrayList<>();
//        for (Question question : questions) {
//            questionList.add(ConceptQuestionListResponseDto.QuestionDto.builder()
//                .questionId(question.getId())
//                .subConcept(question.getSubConcept().getConceptType())
//                .questionImg(question.getQuestionImg())
//                .questionText(question.getQuestionText())
//                .questionSolution(question.getQuestionSolution())
//                .answer(question.getAnswer())
//                .registAt(question.getRegistAt() != null ? question.getRegistAt() : null)
//                .build());
//        }
//        return ConceptQuestionListResponseDto.builder()
//            .questionList(questionList)
//            .build();
        return null;
    }
}