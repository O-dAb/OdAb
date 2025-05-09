package com.ssafy.odab.domain.question.entity;

import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.FetchType;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.GenerationType;
import jakarta.persistence.Id;
import jakarta.persistence.JoinColumn;
import jakarta.persistence.ManyToOne;
import jakarta.persistence.Table;
import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;

@Entity
@Table(name = "question_solution")
@Getter
@NoArgsConstructor
@AllArgsConstructor
public class QuestionSolution {

  @Id
  @GeneratedValue(strategy = GenerationType.IDENTITY)
  @Column(name = "question_solution_id")
  private Integer id;

  @Column(name = "solution", nullable = true)
  private String solution;

  @Column(name = "step", nullable = true)
  private Byte step;

  @Column(name = "solution_content", nullable = true)
  private String solutionContent;

  @ManyToOne(fetch = FetchType.LAZY)
  @JoinColumn(name = "question_id", nullable = false)
  private Question question;

  public void changeMajorConcept(Question question) {
    if (this.question != null) {
      this.question.getQuestionSolutions().remove(this);
    }

    this.question = question;

    if (question != null) {
      question.getQuestionSolutions().add(this);
    }
  }

}
