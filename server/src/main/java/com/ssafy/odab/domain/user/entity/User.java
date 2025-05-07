package com.ssafy.odab.domain.user.entity;

import com.ssafy.odab.domain.learning.entity.LastLearningDate;
import com.ssafy.odab.domain.question.entity.Question;
import com.ssafy.odab.domain.question_result.entity.QuestionResult;
import com.ssafy.odab.domain.solution.entity.Solution;
import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.FetchType;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.GenerationType;
import jakarta.persistence.Id;
import jakarta.persistence.OneToMany;
import jakarta.persistence.Table;
import java.time.LocalDateTime;
import java.util.ArrayList;
import java.util.List;
import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;

@Entity
@Table(name = "users")
@Getter
@NoArgsConstructor
@AllArgsConstructor
public class User {

  @Id
  @GeneratedValue(strategy = GenerationType.IDENTITY)
  @Column(name = "user_id")
  private Long id;

  @Column(name = "kakao_id", unique = true, nullable = false)
  private Long kakaoId;

  @Column(name = "profile_url", nullable = true)
  private String profileUrl;

  @Column(name = "user_name", nullable = true)
  private String userName;

  @Column(name = "created_at", nullable = true)
  private LocalDateTime createdAt;

  @Column(name = "grade", nullable = true)
  private Integer grade;

  @OneToMany(mappedBy = "user", fetch = FetchType.LAZY)
  private List<LastLearningDate> lastLearningDates = new ArrayList<>();

  @OneToMany(mappedBy = "user", fetch = FetchType.LAZY)
  private List<QuestionResult> questionResults = new ArrayList<>();

  @OneToMany(mappedBy = "user", fetch = FetchType.LAZY)
  private List<Question> questions = new ArrayList<>();

  @OneToMany(mappedBy = "user", fetch = FetchType.LAZY)
  private List<Solution> solutions = new ArrayList<>();

}