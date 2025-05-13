package com.ssafy.odab.domain.concept.controller;

import com.ssafy.odab.common.dto.GradeConceptResponseDto;
import com.ssafy.odab.domain.concept.service.ConceptService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

@RestController
@RequiredArgsConstructor
@RequestMapping("/api/v1/concept")
public class ConceptController {

    private final ConceptService conceptService;

    /**
     * 모든 개념 계층 구조를 조회하는 API
     * 전체 학년의 모든 대개념과 그에 속한 소개념들을 조회
     *
     * @return 대개념과 소개념을 포함한 계층 구조
     */
    @GetMapping("/all")
    public ResponseEntity<GradeConceptResponseDto> getAllConcepts() {
        return ResponseEntity.ok(conceptService.getAllConcepts());
    }

}
