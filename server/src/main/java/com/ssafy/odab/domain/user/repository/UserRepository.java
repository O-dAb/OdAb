package com.ssafy.odab.domain.user.repository;

import com.ssafy.odab.domain.user.entity.User;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Modifying;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.transaction.annotation.Transactional;

import java.util.Optional;

public interface UserRepository extends JpaRepository<User, Integer> {

    Optional<User> findBykakaoId(Long kakaoId);

    /**
     * 사용자의 학년 정보를 업데이트합니다.
     *
     * @param userId 사용자 ID
     * @param grade  변경할 학년
     * @return 업데이트된 행의 수
     */
    @Modifying(clearAutomatically = true)
    @Query("UPDATE User u SET u.grade = :grade WHERE u.id = :userId")
    @Transactional
    int updateUserGrade(@Param("userId") Integer userId, @Param("grade") Integer grade);
    
    /**
     * 사용자와 사용자의 LastLearningTime 정보를 함께 조회합니다.
     *
     * @param userId 사용자 ID
     * @return 사용자 정보와 LastLearningTime 정보를 포함한 User 객체
     */
    @Query("SELECT u FROM User u LEFT JOIN FETCH u.lastLearningTimes WHERE u.id = :userId")
    Optional<User> findByIdWithLastLearningTimes(@Param("userId") Integer userId);
}

