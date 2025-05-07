package com.ssafy.odab.domain.solution.entity;

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
@Table(name = "solution")
@Getter
@NoArgsConstructor
@AllArgsConstructor
public class Solution {

  @Id
  @GeneratedValue(strategy = GenerationType.IDENTITY)
  @Column(name = "solution_id")
  private Long id;

  @ManyToOne(fetch = FetchType.LAZY)
  @JoinColumn(name = "user_id", nullable = false)
  private User user;

  @ManyToOne(fetch = FetchType.LAZY)
  @JoinColumn(name = "question_id", nullable = false)
  private Question question;

  @Column(name = "solution_img", nullable = true)
  private String solutionImg;

  @Column(name = "drawing_last_modified", nullable = true)
  private LocalDateTime drawingLastModified;

  public void changeUser(User user) {
    if (this.user != null) {
      this.user.getSolutions().remove(this);
    }

    this.user = user;

    if (user != null) {
      user.getSolutions().add(this);
    }
  }

  public void changeQuestion(Question question) {
    if (this.question != null) {
      this.question.getSolutions().remove(this);
    }

    this.question = question;

    if (question != null) {
      question.getSolutions().add(this);
    }
  }

}
