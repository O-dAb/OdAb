package com.ssafy.odab.domain.question_result.repository;

import com.ssafy.odab.domain.question.dto.RetryQuestionResponseDto;
import com.ssafy.odab.domain.question.entity.Question;
import com.ssafy.odab.domain.question_result.entity.QuestionResult;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

import java.time.LocalDateTime;
import java.time.LocalDate;
import java.util.List;
import java.util.Optional;

public interface QuestionResultRepository extends JpaRepository<QuestionResult, Integer> {

    Optional<QuestionResult> findByQuestionId(@Param("questionId") Integer questionId);

    @Query("select distinct q from Question q join fetch q.questionResults qr where q.user.id = :userId")
    List<Question> findWrongQuestionsByUserId(@Param("userId") Integer userId);

    @Query(value = "select new com.ssafy.odab.domain.question.dto.RetryQuestionResponseDto("
            + " q.id, q.questionImg, q.questionText, q.answer, q.registedAt, "
            + " qr.isCorrect, qr.times, qr.solvedAt) "
            + " from Question q join q.questionResults qr "
            + " where q.id = :questionId order by qr.solvedAt desc")
    List<RetryQuestionResponseDto> findRecentQuestionResultByQuestionId(
            @Param("questionId") Integer questionId);

    @Query("select q from Question q join fetch q.questionConcepts qc join fetch qc.subConcept sc where q.user.id = :userId and sc.gradeLevel.grade in (:grades)")
    List<Question> findWrongQuestionsByUserIdAndSchoolLevel(@Param("userId") Integer userId,
                                                            @Param("grades") List<Integer> grades);

    @Query("select q from Question q join fetch q.questionConcepts qc join fetch qc.subConcept sc where q.user.id = :userId and sc.gradeLevel.grade in (:grades) and q.registedAt between :start and :end")
    List<Question> findRecentWrongQuestionsByUserIdAndSchoolLevel(
            @Param("userId") Integer userId,
            @Param("grades") List<Integer> grades,
            @Param("start") LocalDateTime start,
            @Param("end") LocalDateTime end);

    @Query(value = "SELECT sc.sub_concept_id, sc.sub_concept_type, DATE(qr.solved_at) as lastLearningDate " +
            "FROM question_result qr " +
            "JOIN question q ON qr.question_id = q.question_id " +
            "JOIN question_concept qc ON q.question_id = qc.question_id " +
            "JOIN sub_concept sc ON qc.sub_concept_id = sc.sub_concept_id " +
            "WHERE qr.user_id = :userId " +
            "AND DATE(qr.solved_at) IN (:reviewDates) " +
            "AND qr.is_correct = false " +
            "AND qr.times = 1 " +
            "GROUP BY sc.sub_concept_id, sc.sub_concept_type, DATE(qr.solved_at)",
            nativeQuery = true)
    List<Object[]> findReviewDtosByUserIdAndDatesWithFirstWrong(@Param("userId") Integer userId, @Param("reviewDates") List<LocalDate> reviewDates);
}