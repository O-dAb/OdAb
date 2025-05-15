package com.ssafy.odab.domain.concept.entity;

import jakarta.persistence.*;
import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;

import java.util.ArrayList;
import java.util.List;

@Entity
@Table(name = "major_concept")
@Getter
@NoArgsConstructor
@AllArgsConstructor
public class MajorConcept {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "major_concept_id")
    private Integer id;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "grade_id")
    private GradeLevel gradeLevel;

    @Column(name = "major_concept_type", nullable = true)
    private String conceptType;

    @Column(name = "concept_order", nullable = true)
    private Integer conceptOrder;

    @OneToMany(mappedBy = "majorConcept", fetch = FetchType.LAZY, cascade = CascadeType.ALL)
    private List<SubConcept> subConcepts = new ArrayList<>();

    public void changeGrade(GradeLevel gradeLevel) {
        if (this.gradeLevel != null) {
            this.gradeLevel.getMajorConcepts().remove(this);
        }

        this.gradeLevel = gradeLevel;

        if (gradeLevel != null) {
            gradeLevel.getMajorConcepts().add(this);
        }
    }

}
