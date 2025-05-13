package com.ssafy.odab.domain.question_result.entity;

import com.ssafy.odab.domain.question.entity.Question;
import com.ssafy.odab.domain.user.entity.User;
import jakarta.persistence.*;
import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;

import java.time.LocalDateTime;

@Entity
@Table(name = "question_result")
@Getter
@NoArgsConstructor
@AllArgsConstructor
public class QuestionResult {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "question_result_id")
    private Integer id;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "question_id", nullable = false)
    private Question question;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "user_id", nullable = false)
    private User user;

    @Column(name = "solved_at", nullable = true)
    private LocalDateTime solvedAt;

    @Column(name = "is_correct", nullable = true)
    private Boolean isCorrect;

    @Column(name = "solution_image", nullable = true)
    private String solutionImage;

    @Column(name = "times", nullable = true)
    private Integer times;

    public void changeQuestion(Question question) {
        if (this.question != null) {
            this.question.getQuestionResults().remove(this);
        }

        this.question = question;

        if (question != null) {
            question.getQuestionResults().add(this);
        }
    }

    public void changeUser(User user) {
        if (this.user != null) {
            this.user.getQuestionResults().remove(this);
        }

        this.user = user;

        if (user != null) {
            user.getQuestionResults().add(this);
        }
    }

    public void changeVerifyAnswer(Boolean isCorrect, LocalDateTime solvedAt) {
        this.isCorrect = isCorrect;
        this.solvedAt = solvedAt;
    }

}
