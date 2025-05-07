package com.ssafy.odab.domain.user.repository;

import com.ssafy.odab.domain.user.entity.User;
import org.springframework.data.jpa.repository.JpaRepository;

public interface UserRepository extends JpaRepository<User, Integer> {

}
