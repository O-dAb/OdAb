package com.ssafy.odab.domain.concept.entity;

import jakarta.persistence.CascadeType;
import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.FetchType;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.GenerationType;
import jakarta.persistence.Id;
import jakarta.persistence.OneToMany;
import jakarta.persistence.Table;
import java.util.ArrayList;
import java.util.List;
import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;

@Entity
@Table(name = "major_concept")
@Getter
@NoArgsConstructor
@AllArgsConstructor
public class MajorConcept {

  @Id
  @GeneratedValue(strategy = GenerationType.IDENTITY)
  @Column(name = "major_concept_id")
  private Long id;

  @Column(name = "major_concept_type", nullable = true)
  private String conceptType;

  @Column(name = "grade", nullable = true)
  private Integer grade;

  @Column(name = "concept_order", nullable = true)
  private Integer conceptOrder;

  @OneToMany(mappedBy = "majorConcept", fetch = FetchType.LAZY, cascade = CascadeType.ALL)
  private List<SubConcept> subConcepts = new ArrayList<>();

}
