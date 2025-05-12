package com.ssafy.odab.domain.learning.repository;

import com.ssafy.odab.domain.learning.entity.LastLearningTime;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

import java.util.List;
import java.util.stream.Collectors;
import java.time.LocalDate;

public interface LastLearningDateRepository extends JpaRepository<LastLearningTime, Integer> {

    @Query(value = "SELECT sc.id AS subConceptId, sc.concept_type AS subConceptType, MAX(DATE(llt.last_learning_date)) AS lastLearningDate " +
            "FROM last_learning_time llt " +
            "JOIN sub_concept sc ON llt.sub_concept_id = sc.id " +
            "WHERE llt.user_id = :userId " +
            "GROUP BY sc.id, sc.concept_type",
            nativeQuery = true)
    List<Object[]> findLastLearningByUserId(@Param("userId") Integer userId);

}
