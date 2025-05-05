package com.ssafy.odab.domain.learning.entity;

import com.ssafy.odab.domain.concept.entity.SubConcept;
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
import java.time.LocalDate;
import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;

@Entity
@Table(name = "last_learning_date")
@Getter
@NoArgsConstructor
@AllArgsConstructor
public class LastLearningDate {

  @Id
  @GeneratedValue(strategy = GenerationType.IDENTITY)
  @Column(name = "last_learning_date_id")
  private Long id;

  @ManyToOne(fetch = FetchType.LAZY)
  @JoinColumn(name = "user_id", nullable = false)
  private User user;

  @ManyToOne(fetch = FetchType.LAZY)
  @JoinColumn(name = "sub_concept_id", nullable = false)
  private SubConcept subConcept;

  @Column(name = "last_learning_date", nullable = true)
  private LocalDate lastLearningDate;

  public void changeUser(User user) {
    if(this.user != null) {
      this.user.getLastLearningDates().remove(this);
    }

    this.user = user;

    if(user != null) {
      user.getLastLearningDates().add(this);
    }
  }

  public void changeSubConcept(SubConcept subConcept) {
    if(this.subConcept != null) {
      this.subConcept.getLastLearningDates().remove(this);
    }

    this.subConcept = subConcept;

    if(subConcept != null) {
      subConcept.getLastLearningDates().add(this);
    }
  }

}
