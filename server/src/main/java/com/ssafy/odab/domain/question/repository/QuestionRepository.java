package com.ssafy.odab.domain.question.repository;

import com.ssafy.odab.domain.question.entity.Question;
import org.springframework.data.jpa.repository.JpaRepository;

public interface QuestionRepository extends JpaRepository<Question, Long> {

}
