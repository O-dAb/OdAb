package com.ssafy.odab.domain.question_result.repository;

import com.ssafy.odab.domain.question.dto.RetryQuestionResponseDto;
import com.ssafy.odab.domain.question.entity.Question;
import com.ssafy.odab.domain.question_result.entity.QuestionResult;
import java.util.List;
import java.util.Optional;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

public interface QuestionResultRepository extends JpaRepository<QuestionResult, Integer> {

  Optional<QuestionResult> findByQuestionId(@Param("questionId") Integer questionId);

  @Query("select distinct q from Question q join fetch q.questionResults qr where q.user.id = :userId")
  List<Question> findWrongQuestionsByUserId(@Param("userId") Integer userId);

  @Query(value = "select new com.ssafy.odab.domain.question.dto.RetryQuestionResponseDto("
      + " q.id, q.questionImg, q.questionText, q.answer, q.registedAt, "
      + " qr.isCorrect, qr.times, qr.solvedAt) "
      + " from Question q join q.questionResults qr "
      + " where q.id = :questionId order by qr.solvedAt desc")
  List<RetryQuestionResponseDto> findRecentQuestionResultByQuestionId(@Param("questionId") Integer questionId);

  @Query("select q from Question q join fetch q.questionConcepts qc join fetch qc.subConcept sc where q.user.id = :userId and sc.gradeLevel.grade in (:grades)")
  List<Question> findWrongQuestionsByUserIdAndSchoolLevel(@Param("userId") Integer userId, @Param("grades") List<Integer> grades);
}