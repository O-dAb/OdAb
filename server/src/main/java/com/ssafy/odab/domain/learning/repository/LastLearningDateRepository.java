package com.ssafy.odab.domain.learning.repository;

import com.ssafy.odab.domain.learning.entity.LastLearningTime;
import org.springframework.data.jpa.repository.JpaRepository;

public interface LastLearningDateRepository extends JpaRepository<LastLearningTime, Integer> {

}
