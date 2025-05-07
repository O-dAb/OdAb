package com.ssafy.odab.domain.question_result.repository;

import com.ssafy.odab.domain.question_result.entity.QuestionResult;
import java.util.Optional;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.repository.query.Param;

public interface QuestionResultRepository extends JpaRepository<QuestionResult, Long> {

  Optional<QuestionResult> findByQuestionId(@Param("questionId") Long questionId);
Optional<QuestionResult> findByQuestion_QuestionId(@Param("questionId") Long questionId);
}
