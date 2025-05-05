package com.ssafy.odab.domain.solution.repository;

import com.ssafy.odab.domain.solution.entity.Solution;
import org.springframework.data.jpa.repository.JpaRepository;

public interface SolutionRepository extends JpaRepository<Solution, Long> {

}
