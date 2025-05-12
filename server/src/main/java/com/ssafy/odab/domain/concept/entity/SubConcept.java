package com.ssafy.odab.domain.concept.entity;

import com.ssafy.odab.domain.learning.entity.LastLearningTime;
import jakarta.persistence.*;
import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;

import java.util.ArrayList;
import java.util.List;

@Entity
@Table(name = "sub_concept")
@Getter
@NoArgsConstructor
@AllArgsConstructor
public class SubConcept {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "sub_concept_id")
    private Integer id;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "major_concept_id")
    private MajorConcept majorConcept;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "grade_id")
    private GradeLevel gradeLevel;

    @Column(name = "sub_concept_type", nullable = true)
    private String conceptType;

    @Column(name = "concept_order", nullable = true)
    private Integer conceptOrder;

    @Column(name = "concept_content", nullable = true)
    private String conceptContent;

    @OneToMany(mappedBy = "subConcept", fetch = FetchType.LAZY)
    private List<LastLearningTime> lastLearningTimes = new ArrayList<>();

    @OneToMany(mappedBy = "subConcept", fetch = FetchType.LAZY)
    private List<QuestionConcept> questionConcepts = new ArrayList<>();

    public void changeMajorConcept(MajorConcept majorConcept) {
        if (this.majorConcept != null) {
            this.majorConcept.getSubConcepts().remove(this);
        }

        this.majorConcept = majorConcept;

        if (majorConcept != null) {
            majorConcept.getSubConcepts().add(this);
        }
    }

    public void changeGrade(GradeLevel gradeLevel) {
        if (this.gradeLevel != null) {
            this.gradeLevel.getSubConcepts().remove(this);
        }

        this.gradeLevel = gradeLevel;

        if (gradeLevel != null) {
            gradeLevel.getSubConcepts().add(this);
        }
    }

}
