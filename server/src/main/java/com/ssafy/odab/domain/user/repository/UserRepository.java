package com.ssafy.odab.domain.user.repository;

import com.ssafy.odab.domain.user.entity.User;
import org.springframework.data.jpa.repository.JpaRepository;
import java.util.Optional;

public interface UserRepository extends JpaRepository<User, Integer> {
    Optional<User> findBykakaoId(Long kakaoId);
}
