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

  @Query("select distinct q from Question q join fetch q.questionResults qr where q.user.id = :userId and q.subConcept.gradeLevel.grade in (:grades)")
  List<Question> findWrongQuestionsByUserIdAndSchoolLevel(@Param("userId") Integer userId, @Param("grades") List<Integer> grades);

  @Query(value = "select new com.ssafy.odab.question.dto.RetryQuestionResponseDto("
      + " q.questionId, q.questionImg, q.questionText, q.questionSolution, q.answer, q.level, q.registDate, "
      + " qr.isCorrect, qr.times, qr.solvedAt) "
      + " from Question q join q.questionResult qr "
      + " where q.questionId = :questionId order by qr.solvedAt desc limit 1", nativeQuery = true)
  RetryQuestionResponseDto findRecentQuestionResultByQuestionId(@Param("questionId") Integer questionId);

}
