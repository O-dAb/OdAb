package com.ssafy.odab.domain.concept.service;

import com.ssafy.odab.common.dto.GradeConceptResponseDto;
import com.ssafy.odab.domain.concept.entity.MajorConcept;
import com.ssafy.odab.domain.concept.entity.SubConcept;
import com.ssafy.odab.domain.concept.repository.MajorConceptRepository;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.ArrayList;
import java.util.List;

@Service
public class ConceptServiceImpl implements ConceptService {

    private final MajorConceptRepository majorConceptRepository;

    public ConceptServiceImpl(MajorConceptRepository majorConceptRepository) {
        this.majorConceptRepository = majorConceptRepository;
    }

    /**
     * 모든 개념의 계층 구조를 조회하는 메소드
     * 대개념과 그에 속한 소개념들을 함께 조회하여 DTO로 변환
     *
     * @return 대개념과 소개념을 포함한 응답 DTO
     */
    @Override
    @Transactional(readOnly = true)
    public GradeConceptResponseDto getAllConcepts() {
        // 1. 모든 대개념과 연관된 소개념을 한 번에 조회 (N+1 문제 방지)
        List<MajorConcept> majorConcepts = majorConceptRepository.findAll();

        // 2. 대개념 DTO 리스트 생성
        List<GradeConceptResponseDto.MajorConceptDto> majorDtoList = new ArrayList<>();

        // 3. 각 대개념을 DTO로 변환
        for (MajorConcept majorConcept : majorConcepts) {
            // 4. 소개념 DTO 리스트 생성
            List<GradeConceptResponseDto.SubConceptDto> subDtoList = new ArrayList<>();

            // 5. 각 소개념을 DTO로 변환 및 리스트에 추가
            for (SubConcept subConcept : majorConcept.getSubConcepts()) {
                GradeConceptResponseDto.SubConceptDto subDto = GradeConceptResponseDto.SubConceptDto.builder()
                        .subConceptId(subConcept.getId())
                        .subConceptType(subConcept.getConceptType())
                        .build();

                subDtoList.add(subDto);
            }

            // 6. 대개념 DTO 생성 및 리스트에 추가
            GradeConceptResponseDto.MajorConceptDto majorDto = GradeConceptResponseDto.MajorConceptDto.builder()
                    .majorConceptId(majorConcept.getId())
                    .majorConceptType(majorConcept.getConceptType())
                    .subConceptList(subDtoList)
                    .build();

            majorDtoList.add(majorDto);
        }

        // 7. 최종 응답 DTO 생성 및 반환
        GradeConceptResponseDto responseDto = GradeConceptResponseDto.builder()
                .majorConceptList(majorDtoList)
                .build();

        return responseDto;
    }
}