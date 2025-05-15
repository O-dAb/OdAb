package com.ssafy.odab.domain.question.entity;

import com.ssafy.odab.domain.concept.entity.QuestionConcept;
import com.ssafy.odab.domain.question_result.entity.QuestionResult;
import com.ssafy.odab.domain.user.entity.User;
import jakarta.persistence.*;
import java.time.LocalDateTime;
import java.util.ArrayList;
import java.util.List;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Getter;
import lombok.NoArgsConstructor;

import java.time.LocalDateTime;
import java.util.ArrayList;
import java.util.List;

@Entity
@Table(name = "question")
@Getter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class Question {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "question_id")
    private Integer id;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "user_id", nullable = false)
    private User user;

    @Column(name = "question_img", nullable = true)
    private String questionImg;

    @Column(name = "question_text", nullable = true)
    private String questionText;

    @Column(name = "answer", nullable = true)
    private String answer;

    @Column(name = "registed_at", nullable = true)
    private LocalDateTime registedAt;

    @OneToMany(mappedBy = "question", fetch = FetchType.LAZY)
    private List<QuestionResult> questionResults = new ArrayList<>();

    @OneToMany(mappedBy = "question", fetch = FetchType.LAZY)
    private List<QuestionConcept> questionConcepts = new ArrayList<>();

    @OneToMany(mappedBy = "question", fetch = FetchType.LAZY)
    private List<QuestionSolution> questionSolutions = new ArrayList<>();

    public void changeUser(User user) {
        if (this.user != null) {
            this.user.getQuestions().remove(this);
        }

        this.user = user;

        if (user != null) {
            user.getQuestions().add(this);
        }
    }

    public void updateQuestionImg(String questionImg) {
        this.questionImg = questionImg;
    }

    public void updateQuestionText(String questionText) {
        this.questionText = questionText;
    }

    public void updateAnswer(String answer) {
        this.answer = answer;
    }
}
