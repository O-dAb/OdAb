package com.ssafy.odab.domain.question.entity;

import com.ssafy.odab.domain.concept.entity.QuestionConcept;
import com.ssafy.odab.domain.question_result.entity.QuestionResult;
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
import java.time.LocalDateTime;
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
  private Integer id;

  @ManyToOne(fetch = FetchType.LAZY)
  @JoinColumn(name = "user_id", nullable = false)
  private User user;

  @Column(name = "question_img", nullable = true)
  private String questionImg;

  @Column(name = "question_text", nullable = true)
  private String questionText;

  @Column(name = "answer", nullable = true)
  private String answer;

  @Column(name = "registed_at", nullable = true)
  private LocalDateTime registedAt;

  @OneToMany(mappedBy = "question", fetch = FetchType.LAZY)
  private List<QuestionResult> questionResults = new ArrayList<>();

  @OneToMany(mappedBy = "question", fetch = FetchType.LAZY)
  private List<QuestionConcept> questionConcepts = new ArrayList<>();

  @OneToMany(mappedBy = "question", fetch = FetchType.LAZY)
  private List<QuestionSolution> questionSolutions = new ArrayList<>();

  public void changeUser(User user) {
    if (this.user != null) {
      this.user.getQuestions().remove(this);
    }

    this.user = user;

    if (user != null) {
      user.getQuestions().add(this);
    }
  }

}
