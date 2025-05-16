package com.ssafy.odab.mcpLLM.rag.entity;

import jakarta.persistence.*;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Getter;
import lombok.NoArgsConstructor;

import java.util.ArrayList;
import java.util.List;

@Entity
@Table(name = "rag_question")
@Getter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class RagQuestion {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "question_id")
    private Integer id;

    @Column(name = "question_text", nullable = true)
    private String questionText;

    @Column(name = "answer", nullable = true)
    private String answer;

    @OneToMany(mappedBy = "question", fetch = FetchType.LAZY)
    private List<RagQuestionSolution> questionSolutions = new ArrayList<>();

    public void updateQuestionText(String questionText) {
        this.questionText = questionText;
    }

    public void updateAnswer(String answer) {
        this.answer = answer;
    }
}
