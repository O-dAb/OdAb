package com.ssafy.odab.domain.concept.repository;

import com.ssafy.odab.domain.concept.entity.SubConcept;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

import java.util.List;

public interface SubConceptRepository extends JpaRepository<SubConcept, Integer> {

    @Query("select qc.subConcept from QuestionConcept qc where qc.question.id = :questionId")
    List<SubConcept> findByQuestionId(@Param("questionId") Integer questionId);

    @Query("select qc.subConcept from QuestionConcept qc where qc.question.id in (:wrongQuestionIds)")
    List<SubConcept> findByQuestionIds(@Param("wrongQuestionIds") List<Integer> wrongQuestionIds);
}
