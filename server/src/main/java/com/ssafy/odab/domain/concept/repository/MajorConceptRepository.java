package com.ssafy.odab.domain.concept.repository;

import com.ssafy.odab.domain.concept.entity.MajorConcept;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

import java.util.List;

/**
 * 대개념(MajorConcept) 엔티티에 접근하기 위한 리포지토리
 * 개념 계층 구조 조회를 위한 쿼리 메소드 제공
 */
public interface MajorConceptRepository extends JpaRepository<MajorConcept, Integer> {

    /**
     * 모든 대개념과 연관된 소개념들을 함께 조회하는 메소드
     * LEFT JOIN FETCH를 사용하여 N+1 문제를 방지
     *
     * @return 소개념을 포함한 모든 대개념 목록
     */
    @Query("SELECT m FROM MajorConcept m LEFT JOIN FETCH m.subConcepts")
    List<MajorConcept> findAllWithSubConcepts();

    @Query("SELECT m FROM MajorConcept m JOIN FETCH m.gradeLevel")
    List<MajorConcept> findAllWithGradeLevel();

    @Query("SELECT DISTINCT m FROM MajorConcept m JOIN FETCH m.gradeLevel LEFT JOIN FETCH m.subConcepts")
    List<MajorConcept> findAllWithGradeLevelAndSubConcepts();

    @Query("select m from MajorConcept m where m.gradeLevel.grade = :grade order by m.conceptOrder")
    List<MajorConcept> findAllByGrade(@Param("grade") Byte grade);
}
