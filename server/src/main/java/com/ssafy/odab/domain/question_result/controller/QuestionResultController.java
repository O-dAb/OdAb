package com.ssafy.odab.domain.question_result.controller;

import com.ssafy.odab.domain.question_result.dto.SubConceptWrongQuestionResponseDto;
import com.ssafy.odab.domain.question_result.dto.WrongQuestionResponseDto;
import com.ssafy.odab.domain.question_result.service.QuestionResultService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.time.LocalDateTime;

@RestController
@RequiredArgsConstructor
@RequestMapping("/api/v1/question-result/")
public class QuestionResultController {

    private final QuestionResultService questionResultService;

    @GetMapping("{grade}/grade")
    public ResponseEntity<WrongQuestionResponseDto> findGradeWrongAnswersByGrade(
            @PathVariable("grade") Byte grade) {
        Integer userId = 2;
        WrongQuestionResponseDto wrongQuestionResponseDto
                = questionResultService.findWrongAnswersByGrade(grade, userId);
        return ResponseEntity.ok(wrongQuestionResponseDto);
    }

    @GetMapping("{schoolLevel}")
    public ResponseEntity<WrongQuestionResponseDto> findWrongAnswersBySchoolLevel(
            @PathVariable("schoolLevel") String schoolLevel) {
        Integer userId = 2;
        WrongQuestionResponseDto wrongQuestionResponseDto =
                questionResultService.findWrongAnswersBySchoolLevel(schoolLevel, userId);
        return ResponseEntity.ok(wrongQuestionResponseDto);
    }

    @GetMapping("{subConceptId}/subconcept")
    public ResponseEntity<SubConceptWrongQuestionResponseDto> findWrongAnswersBySubConcept(
            @PathVariable("subConceptId") Integer subConceptId) {
        Integer userId = 2;
        return ResponseEntity.ok(
                questionResultService.findWrongAnswersBySubConcept(subConceptId, userId));
    }

    // 전체 최근 오답 조회
    @GetMapping("{schoolLevel}/recent")
    public ResponseEntity<WrongQuestionResponseDto> findRecentWrongAnswersBySchoolLevel(
            @PathVariable("schoolLevel") String schoolLevel, @RequestParam(name = "days", defaultValue = "25") Integer days) {
        Integer userId = 2;
        LocalDateTime startTime = LocalDateTime.now().minusDays(days);
        WrongQuestionResponseDto wrongQuestionResponseDto =
                questionResultService.findRecentWrongAnswersBySchoolLevel(schoolLevel, userId, startTime);
        return ResponseEntity.ok(wrongQuestionResponseDto);
    }

    // 학년별 최근 오답 조회
    @GetMapping("{grade}/recent/grade")
    public ResponseEntity<WrongQuestionResponseDto> findRecentWrongAnswersByGrade(@PathVariable("grade") Byte grade,
                                                                                  @RequestParam(name = "days", defaultValue = "25") Integer days) {
        Integer userId = 2;
        LocalDateTime startTime = LocalDateTime.now().minusDays(days);
        WrongQuestionResponseDto wrongQuestionResponseDto =
                questionResultService.findRecentWrongAnswersByGrade(grade, userId, startTime);
        return ResponseEntity.ok(wrongQuestionResponseDto);
    }

    // 주제별 최근 오답 조회


}
