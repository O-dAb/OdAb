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

//  Optional<QuestionResult> findByQuestionId(@Param("questionId") Integer questionId);
  Optional<QuestionResult> findByQuestion_Id(@Param("questionId") Integer questionId);

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

  // JPQL에서 날짜 변환(CAST, DATE 등)이 DB 방언에 따라 동작하지 않아 네이티브 쿼리로 변경함
  @Query(value = "SELECT sc.id AS subConceptId, sc.concept_type AS subConceptType, MIN(DATE(qr.solved_at)) AS lastLearningDate " +
          "FROM question_result qr " +
          "JOIN question q ON qr.question_id = q.id " +
          "JOIN question_concept qc ON q.id = qc.question_id " +
          "JOIN sub_concept sc ON qc.sub_concept_id = sc.id " +
          "WHERE qr.user_id = :userId " +
          "AND qr.is_correct = false " +
          "AND DATE(qr.solved_at) IN (:dates) " +
          "GROUP BY sc.id, sc.concept_type",
          nativeQuery = true)
  List<Object[]> findReviewDtosByUserIdAndDatesWithFirstWrong(
      @Param("userId") Integer userId,
      @Param("dates") List<java.time.LocalDate> dates
  );
}