package com.ssafy.odab.domain.concept.entity;

import jakarta.persistence.*;
import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;

import java.util.ArrayList;
import java.util.List;

@Entity
@Table(name = "grade_level")
@Getter
@NoArgsConstructor
@AllArgsConstructor
public class GradeLevel {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "grade_level_id")
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
