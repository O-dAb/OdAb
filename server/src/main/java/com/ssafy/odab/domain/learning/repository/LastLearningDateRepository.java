package com.ssafy.odab.domain.learning.repository;

import com.ssafy.odab.domain.learning.entity.LastLearningTime;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

import java.util.List;
import java.util.stream.Collectors;
import java.time.LocalDate;

public interface LastLearningDateRepository extends JpaRepository<LastLearningTime, Integer> {

    @Query(value = "SELECT sc.sub_concept_id AS subConceptId, sc.sub_concept_type AS subConceptType, MAX(DATE(llt.last_learning_time)) AS lastLearningDate " +
            "FROM sub_concept sc " +
            "LEFT JOIN last_learning_time llt ON llt.sub_concept_id = sc.sub_concept_id AND llt.user_id = :userId " +
            "GROUP BY sc.sub_concept_id, sc.sub_concept_type",
            nativeQuery = true)
    List<Object[]> findAllSubConceptsWithLastLearningDate(@Param("userId") Integer userId);

    // 기존 메서드는 주석 처리 또는 삭제 가능
    // @Query(value = "SELECT sc.sub_concept_id AS subConceptId, sc.sub_concept_type AS subConceptType, MAX(DATE(llt.last_learning_time)) AS lastLearningDate " +
    //         "FROM last_learning_time llt " +
    //         "JOIN sub_concept sc ON llt.sub_concept_id = sc.sub_concept_id " +
    //         "WHERE llt.user_id = :userId " +
    //         "GROUP BY sc.sub_concept_id, sc.sub_concept_type",
    //         nativeQuery = true)
    // List<Object[]> findLastLearningByUserId(@Param("userId") Integer userId);

}
