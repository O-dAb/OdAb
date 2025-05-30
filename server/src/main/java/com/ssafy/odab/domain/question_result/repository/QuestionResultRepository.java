package com.ssafy.odab.domain.question_result.repository;

import com.ssafy.odab.domain.question.dto.RetryQuestionResponseDto;
import com.ssafy.odab.domain.question.entity.Question;
import com.ssafy.odab.domain.question_result.entity.QuestionResult;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

import java.time.LocalDate;
import java.time.LocalDateTime;
import java.util.List;

public interface QuestionResultRepository extends JpaRepository<QuestionResult, Integer> {

    @Query("SELECT qr FROM QuestionResult qr WHERE qr.user.id = :userId AND qr.question.id = :questionId ORDER BY qr.times DESC")
    List<QuestionResult> findByQuestionIdAndUserId(@Param("questionId") Integer questionId, @Param("userId") Integer userId, Pageable pageable);

    @Query("select distinct q from Question q where q.user.id = :userId")
    List<Question> findWrongQuestionsByUserId(@Param("userId") Integer userId);

    @Query("select distinct q from Question q join fetch q.questionResults qr where q.user.id = :userId and q.registedAt between :start and :end")
    List<Question> findRecentWrongQuestionsByUserId(@Param("userId") Integer userId, @Param("start") LocalDateTime start, @Param("end") LocalDateTime end);

    @Query(value = "select new com.ssafy.odab.domain.question.dto.RetryQuestionResponseDto("
            + " q.id, q.questionImg, q.questionText, q.answer, q.registedAt, "
            + " qr.isCorrect, qr.times, qr.solvedAt) "
            + " from Question q join q.questionResults qr "
            + " where q.id = :questionId order by qr.solvedAt desc")
    List<RetryQuestionResponseDto> findRetryQuestionResultByQuestionId(
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
            "INNER JOIN ( " +
            "    SELECT question_id, user_id, MIN(solved_at) AS first_wrong_time " +
            "    FROM question_result " +
            "    WHERE is_correct = 0 " +
            "    GROUP BY question_id, user_id " +
            ") fw ON qr.question_id = fw.question_id AND qr.user_id = fw.user_id AND qr.solved_at = fw.first_wrong_time " +
            "WHERE qr.user_id = :userId " +
            "AND DATE(qr.solved_at) IN (:reviewDates) " +
            "AND qr.is_correct = 0 " +
            "GROUP BY sc.sub_concept_id, sc.sub_concept_type, DATE(qr.solved_at)",
            nativeQuery = true)
    List<Object[]> findReviewDtosByUserIdAndDatesWithFirstWrong(@Param("userId") Integer userId, @Param("reviewDates") List<LocalDate> reviewDates);
}