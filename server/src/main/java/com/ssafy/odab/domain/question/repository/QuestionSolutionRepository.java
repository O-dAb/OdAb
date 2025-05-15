package com.ssafy.odab.domain.question.repository;

import com.ssafy.odab.domain.question.entity.Question;
import com.ssafy.odab.domain.question.entity.QuestionSolution;
import org.springframework.data.jpa.repository.JpaRepository;

public interface QuestionSolutionRepository extends JpaRepository<QuestionSolution, Integer> {

}
