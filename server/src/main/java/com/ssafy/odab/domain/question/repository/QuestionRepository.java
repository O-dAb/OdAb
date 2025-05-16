package com.ssafy.odab.domain.question.repository;

import com.ssafy.odab.domain.question.entity.Question;
import java.util.List;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

public interface QuestionRepository extends JpaRepository<Question, Integer> {

    @Query(value = "select q from Question q join q.questionConcepts qc where qc.subConcept.id = :subConceptId",
            countQuery = "select count(q) from Question q join q.questionConcepts qc where qc.subConcept.id = :subConceptId")
    Page<Question> findSubConceptRelatedQuestionBySubConceptId(@Param("subConceptId") Integer subConceptId, Pageable pageable);

    //개념별 문제 조회 
    @Query("SELECT DISTINCT q FROM Question q LEFT JOIN FETCH q.questionConcepts qc LEFT JOIN FETCH qc.subConcept LEFT JOIN FETCH q.questionSolutions qs")
    List<Question> findAllWithQuestionConcepts();


}
