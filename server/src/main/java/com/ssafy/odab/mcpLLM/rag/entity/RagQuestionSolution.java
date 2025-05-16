package com.ssafy.odab.mcpLLM.rag.entity;

import jakarta.persistence.*;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Getter;
import lombok.NoArgsConstructor;

@Entity
@Table(name = "rag_question_solution")
@Getter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class RagQuestionSolution {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "question_solution_id")
    private Integer id;

    @Column(name = "step", nullable = true)
    private Byte step;

    @Column(name = "solution_content", nullable = true)
    private String solutionContent;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "question_id", nullable = false)
    private RagQuestion question;
}
