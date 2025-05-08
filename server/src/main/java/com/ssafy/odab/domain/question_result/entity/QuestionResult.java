package com.ssafy.odab.domain.question_result.entity;

import com.ssafy.odab.domain.question.entity.Question;
import com.ssafy.odab.domain.user.entity.User;
import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.FetchType;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.GenerationType;
import jakarta.persistence.Id;
import jakarta.persistence.JoinColumn;
import jakarta.persistence.ManyToOne;
import jakarta.persistence.Table;
import java.time.LocalDateTime;
import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;

@Entity
@Table(name = "question_result")
@Getter
@NoArgsConstructor
@AllArgsConstructor
public class QuestionResult {

  @Id
  @GeneratedValue(strategy = GenerationType.IDENTITY)
  @Column(name = "question_result_id")
  private Integer id;

  @ManyToOne(fetch = FetchType.LAZY)
  @JoinColumn(name = "question_id", nullable = false)
  private Question question;

  @ManyToOne(fetch = FetchType.LAZY)
  @JoinColumn(name = "user_id", nullable = false)
  private User user;

  @Column(name = "solved_at", nullable = true)
  private LocalDateTime solvedAt;

  @Column(name = "is_correct", nullable = true)
  private Boolean isCorrect;

  public void changeQuestion(Question question) {
    if (this.question != null) {
      this.question.getQuestionResults().remove(this);
    }

    this.question = question;

    if (question != null) {
      question.getQuestionResults().add(this);
    }
  }

  public void changeUser(User user) {
    if (this.user != null) {
      this.user.getQuestionResults().remove(this);
    }

    this.user = user;

    if (user != null) {
      user.getQuestionResults().add(this);
    }
  }

  public void changeVerifyAnswer(Boolean isCorrect, LocalDateTime solvedAt) {
    this.isCorrect = isCorrect;
    this.solvedAt = solvedAt;
  }

}
