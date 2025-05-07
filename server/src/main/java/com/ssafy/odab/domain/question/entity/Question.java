package com.ssafy.odab.domain.question.entity;

import com.ssafy.odab.domain.concept.entity.SubConcept;
import com.ssafy.odab.domain.question_result.entity.QuestionResult;
import com.ssafy.odab.domain.solution.entity.Solution;
import com.ssafy.odab.domain.user.entity.User;
import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.FetchType;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.GenerationType;
import jakarta.persistence.Id;
import jakarta.persistence.JoinColumn;
import jakarta.persistence.ManyToOne;
import jakarta.persistence.OneToMany;
import jakarta.persistence.Table;
import java.time.LocalDate;
import java.util.ArrayList;
import java.util.List;
import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;

@Entity
@Table(name = "question")
@Getter
@NoArgsConstructor
@AllArgsConstructor
public class Question {

  @Id
  @GeneratedValue(strategy = GenerationType.IDENTITY)
  @Column(name = "question_id")
  private Long questionId;

  @ManyToOne(fetch = FetchType.LAZY)
  @JoinColumn(name = "user_id", nullable = false)
  private User user;

  @ManyToOne(fetch = FetchType.LAZY)
  @JoinColumn(name = "sub_concept_id", nullable = false)
  private SubConcept subConcept;

  @Column(name = "question_img", nullable = true)
  private String questionImg;

  @Column(name = "question_text", nullable = true)
  private String questionText;

  @Column(name = "question_solution", nullable = true)
  private String questionSolution;

  @Column(name = "answer", nullable = true)
  private String answer;

  @Column(name = "level", nullable = true)
  private Integer level;

  @Column(name = "regit_at", nullable = true)
  private LocalDate regitAt;

  @OneToMany(mappedBy = "question", fetch = FetchType.LAZY)
  private List<Solution> solutions = new ArrayList<>();

  @OneToMany(mappedBy = "question", fetch = FetchType.LAZY)
  private List<QuestionResult> questionResults = new ArrayList<>();

  public void changeUser(User user) {
    if (this.user != null) {
      this.user.getQuestions().remove(this);
    }

    this.user = user;

    if (user != null) {
      user.getQuestions().add(this);
    }
  }

  public void changeSubConcept(SubConcept subConcept) {
    if (this.subConcept != null) {
      this.subConcept.getQuestions().remove(this);
    }

    this.subConcept = subConcept;

    if (subConcept != null) {
      subConcept.getQuestions().add(this);
    }
  }
}
