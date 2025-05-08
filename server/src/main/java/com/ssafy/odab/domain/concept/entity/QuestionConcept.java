package com.ssafy.odab.domain.concept.entity;

import com.ssafy.odab.domain.question.entity.Question;
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
@Table(name = "question_concept")
@Getter
@NoArgsConstructor
@AllArgsConstructor
public class QuestionConcept {

  @Id
  @GeneratedValue(strategy = GenerationType.IDENTITY)
  @Column(name = "question_concept_id")
  private Integer id;

  @ManyToOne(fetch = FetchType.LAZY)
  @JoinColumn(name = "question_id")
  private Question question;

  @ManyToOne(fetch = FetchType.LAZY)
  @JoinColumn(name = "sub_concept_id")
  private SubConcept subConcept;

  public void changeQuestion(Question question) {
    if(this.question != null) {
      this.question.getQuestionConcepts().remove(this);
    }

    this.question = question;

    if(question != null) {
      question.getQuestionConcepts().add(this);
    }
  }

  public void changeSubConcept(Question question) {
    if(this.question != null) {
      this.question.getQuestionConcepts().remove(this);
    }

    this.question = question;

    if(question != null) {
      question.getQuestionConcepts().add(this);
    }
  }

}
