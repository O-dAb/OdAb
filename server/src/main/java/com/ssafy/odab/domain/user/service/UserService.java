package com.ssafy.odab.domain.user.service;

import com.ssafy.odab.domain.user.entity.User;
import org.springframework.web.multipart.MultipartFile;

public interface UserService {
    String saveProfileImg(Integer userId, MultipartFile file);

    void updateGrade(Integer userId, Integer grade);

    User findById(Integer userId);

    String getProfileImageUrl(Integer userId);
}
