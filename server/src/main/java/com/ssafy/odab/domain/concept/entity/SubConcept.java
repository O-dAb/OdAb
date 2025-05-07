package com.ssafy.odab.domain.concept.entity;

import com.ssafy.odab.domain.learning.entity.LastLearningDate;
import com.ssafy.odab.domain.question.entity.Question;
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
import java.util.ArrayList;
import java.util.List;
import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;

@Entity
@Table(name = "sub_concept")
@Getter
@NoArgsConstructor
@AllArgsConstructor
public class SubConcept {

  @Id
  @GeneratedValue(strategy = GenerationType.IDENTITY)
  @Column(name = "sub_concept_id")
  private Long id;

  @ManyToOne(fetch = FetchType.LAZY)
  @JoinColumn(name = "major_concept_id")
  private MajorConcept majorConcept;

  @Column(name = "sub_concept_type", nullable = true)
  private String conceptType;

  @Column(name = "grade", nullable = true)
  private Integer grade;

  @Column(name = "concept_order", nullable = true)
  private Integer conceptOrder;

  @Column(name = "concept_content", nullable = true)
  private String conceptContent;

  @OneToMany(mappedBy = "subConcept", fetch = FetchType.LAZY)
  private List<LastLearningDate> lastLearningDates = new ArrayList<>();

  @OneToMany(mappedBy = "subConcept", fetch = FetchType.LAZY)
  private List<Question> questions = new ArrayList<>();

  public void changeMajorConcept(MajorConcept majorConcept) {
    if(this.majorConcept != null) {
      this.majorConcept.getSubConcepts().remove(this);
    }

    this.majorConcept = majorConcept;

    if(majorConcept != null) {
      majorConcept.getSubConcepts().add(this);
    }
  }

}
