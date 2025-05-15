package com.ssafy.odab.domain.question.repository;

import com.ssafy.odab.domain.question.entity.Question;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

public interface QuestionRepository extends JpaRepository<Question, Integer> {

    @Query(value = "select q from Question q join q.questionConcepts qc where qc.subConcept.id = :subConceptId",
            countQuery = "select count(q) from Question q join q.questionConcepts qc where qc.subConcept.id = :subConceptId")
    Page<Question> findSubConceptRelatedQuestionBySubConceptId(@Param("subConceptId") Integer subConceptId, Pageable pageable);
}
