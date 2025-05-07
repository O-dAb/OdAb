package com.ssafy.odab.domain.question_result.repository;

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


  @Query("select distinct q from Question q join fetch q.questionResults qr where q.user.id = :userId and qr.isCorrect = false")
  List<Question> findWrongQuestionsByUserId(@Param("userId") Integer userId);
}
