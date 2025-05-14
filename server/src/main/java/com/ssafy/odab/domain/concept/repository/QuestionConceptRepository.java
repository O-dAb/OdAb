package com.ssafy.odab.domain.concept.repository;

import com.ssafy.odab.domain.concept.entity.QuestionConcept;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;

public interface QuestionConceptRepository extends JpaRepository<QuestionConcept, Integer> {
}
