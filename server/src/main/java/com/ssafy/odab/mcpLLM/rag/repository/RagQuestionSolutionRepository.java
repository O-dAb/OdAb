package com.ssafy.odab.mcpLLM.rag.repository;

import com.ssafy.odab.domain.question.entity.QuestionSolution;
import com.ssafy.odab.mcpLLM.rag.entity.RagQuestionSolution;
import org.springframework.data.jpa.repository.JpaRepository;

public interface RagQuestionSolutionRepository extends JpaRepository<RagQuestionSolution, Integer> {

}
