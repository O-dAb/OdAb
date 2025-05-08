package com.ssafy.odab.domain.concept.entity;

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
@Table(name = "grade_level")
@Getter
@NoArgsConstructor
@AllArgsConstructor
public class GradeLevel {

  @Id
  @GeneratedValue(strategy = GenerationType.IDENTITY)
  @Column(name = "grade_id")
  private Integer id;

  @Column(name = "grade", nullable = true)
  private Byte grade;

  @Column(name = "grade_name", nullable = true)
  private String gradeName;

  @OneToMany(mappedBy = "gradeLevel", fetch = FetchType.LAZY)
  private List<MajorConcept> majorConcepts = new ArrayList<>();

  @OneToMany(mappedBy = "gradeLevel", fetch = FetchType.LAZY)
  private List<SubConcept> subConcepts = new ArrayList<>();

}
