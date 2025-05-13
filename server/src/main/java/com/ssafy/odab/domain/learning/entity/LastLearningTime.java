package com.ssafy.odab.domain.learning.entity;

import com.ssafy.odab.domain.concept.entity.SubConcept;
import com.ssafy.odab.domain.user.entity.User;
import jakarta.persistence.*;
import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;

import java.time.LocalDateTime;

@Entity
@Table(name = "last_learning_time")
@Getter
@NoArgsConstructor
@AllArgsConstructor
public class LastLearningTime {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "last_learning_time_id")
    private Integer id;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "user_id", nullable = false)
    private User user;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "sub_concept_id", nullable = false)
    private SubConcept subConcept;

    @Column(name = "last_learning_time", nullable = true)
    private LocalDateTime lastLearningDate;

    public void changeUser(User user) {
        if (this.user != null) {
            this.user.getLastLearningTimes().remove(this);
        }

        this.user = user;

        if (user != null) {
            user.getLastLearningTimes().add(this);
        }
    }

    public void changeSubConcept(SubConcept subConcept) {
        if (this.subConcept != null) {
            this.subConcept.getLastLearningTimes().remove(this);
        }

        this.subConcept = subConcept;

        if (subConcept != null) {
            subConcept.getLastLearningTimes().add(this);
        }
    }

}
