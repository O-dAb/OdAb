package com.ssafy.odab.mcpLLM.rag.repository;

import com.ssafy.odab.domain.question.entity.Question;
import com.ssafy.odab.mcpLLM.rag.entity.RagQuestion;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

import java.util.List;
import java.util.Optional;

public interface RagQuestionRepository extends JpaRepository<RagQuestion, Integer> {

    @Query("SELECT q FROM RagQuestion q LEFT JOIN FETCH q.questionSolutions WHERE q.id = :id")
    Optional<RagQuestion> findByIdWithSolutions(@Param("id") Integer id);
}
