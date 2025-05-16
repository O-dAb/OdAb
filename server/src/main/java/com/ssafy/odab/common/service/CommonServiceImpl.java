package com.ssafy.odab.common.service;

import com.ssafy.odab.common.dto.GradeConceptResponseDto;
import com.ssafy.odab.domain.concept.entity.MajorConcept;
import com.ssafy.odab.domain.concept.entity.SubConcept;
import com.ssafy.odab.domain.concept.repository.MajorConceptRepository;
import com.ssafy.odab.domain.concept.repository.SubConceptRepository;
import com.ssafy.odab.domain.question.dto.ConceptQuestionResponseDto;
import com.ssafy.odab.domain.question.entity.Question;
import com.ssafy.odab.domain.question.repository.QuestionRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.ArrayList;
import java.util.HashMap;
import java.util.List;
import java.util.Map;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
public class CommonServiceImpl implements CommonService {
    private final MajorConceptRepository majorConceptRepository;
    private final QuestionRepository questionRepository;
    private final SubConceptRepository subConceptRepository;

    //학년별 개념 조회 
    @Override
    public GradeConceptResponseDto getGradeConceptDetail(Byte grade, Integer userId) {
        List<MajorConcept> majorConcepts = majorConceptRepository.findAllWithGradeLevel()
                .stream()
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
    @Transactional
    public ConceptQuestionResponseDto getConceptQuestionList(Integer subConceptId) {
        // subConceptId로 소주제에 해당하는 문제 리스트  조회
        List<Question> questions = questionRepository.findAllWithQuestionConcepts();

        // 조회한 문제 리스트의 풀이 조회
        List<ConceptQuestionResponseDto.QuestionWithSolutionDto> questionWithSolutionList = new ArrayList<>();
        for (Question q : questions) { // 조회한 문제 리스트 중 문제 하나마다 
            for (var sol : q.getQuestionSolutions()) { // 문제 해당 문제의 풀이 하나씩 
                var dto = ConceptQuestionResponseDto.QuestionWithSolutionDto.builder()
                    .questionId(q.getId())
                    .questionImg(q.getQuestionImg())
                    .questionText(q.getQuestionText())
                    .answer(q.getAnswer())
                    .questionSolutionId(sol.getId())
                    .solutionContent(sol.getSolutionContent())
                    .step(sol.getStep())
                    .build();
                questionWithSolutionList.add(dto);
            }
        }

        return ConceptQuestionResponseDto.builder()
            .httpStatus(200)
            .message("성공적으로 조회되었습니다.")
            .data(new ConceptQuestionResponseDto.Data(questionWithSolutionList))
            .build();
    }

    // 전체 개념 조회
    @Override
    public Object getAllConcepts() {
        List<MajorConcept> allMajorConcepts = majorConceptRepository.findAllWithGradeLevelAndSubConcepts();
        // grade별로 그룹핑
        Map<Byte, List<MajorConcept>> gradeMap = new HashMap<>();
        for (MajorConcept mc : allMajorConcepts) {
            if (mc.getGradeLevel() != null && mc.getGradeLevel().getGrade() != null) {
                gradeMap.computeIfAbsent(mc.getGradeLevel().getGrade(), k -> new ArrayList<>()).add(mc);
            }
        }
        List<Map<String, Object>> grades = new ArrayList<>();
        for (Byte grade : gradeMap.keySet()) {
            List<GradeConceptResponseDto.MajorConceptDto> majorConceptList = new ArrayList<>();
            for (MajorConcept majorConcept : gradeMap.get(grade)) {
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
            Map<String, Object> gradeObj = new HashMap<>();
            gradeObj.put("grade", grade);
            gradeObj.put("majorConceptList", majorConceptList);
            grades.add(gradeObj);
        }
        Map<String, Object> data = new HashMap<>();
        data.put("grades", grades);
        return data;
    }

    // 개념별 내용 조회
    @Override
    public Map<String, Object> getSubConceptContent(Integer subConceptId) {
        Map<String, Object> result = new HashMap<>();
        SubConcept subConcept = subConceptRepository.findById(subConceptId).orElse(null);
        if (subConcept == null) {
            result.put("httpStatus", 404);
            result.put("message", "해당 소개념이 존재하지 않습니다.");
            return result;
        }
        result.put("httpStatus", 200);
        result.put("message", "개념별 내용 조회 성공");
        Map<String, Object> data = new HashMap<>();
        data.put("subConceptId", subConcept.getId());
        data.put("subConceptOrder", subConcept.getConceptOrder());
        data.put("subConceptContent", subConcept.getConceptContent());
        result.put("data", data);
        return result;
    }
}