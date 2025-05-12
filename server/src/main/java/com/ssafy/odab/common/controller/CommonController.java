package com.ssafy.odab.common.controller;

import com.ssafy.odab.common.service.CommonService;
import com.ssafy.odab.domain.question.dto.ConceptQuestionResponseDto;
import java.util.HashMap;
import java.util.Map;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

@RestController
@RequiredArgsConstructor
@RequestMapping("/api/v1/common/")
public class CommonController {
    private final CommonService commonService;

    //학년별 개념 조회 
    @GetMapping("{grade}/grade")
    public ResponseEntity<?> getGradeConceptDetail(@PathVariable("grade") Byte grade) {
        Integer userId = 1; // TODO: 실제 로그인 유저로 교체
        var data = commonService.getGradeConceptDetail(grade, userId);
        Map<String, Object> response = new HashMap<>();
        response.put("httpStatus", 200);
        response.put("message", "학년별 개념 조회 성공");
        response.put("data", data);
        return ResponseEntity.ok(response);
    }
    
    //개념별 문제 조회
    @GetMapping("{subConceptId}/concept")
    public ResponseEntity<ConceptQuestionResponseDto> getConceptQuestionList(@PathVariable("subConceptId") Integer subConceptId) {
        return ResponseEntity.ok(commonService.getConceptQuestionList(subConceptId));
    }
} 