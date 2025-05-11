package com.ssafy.odab.domain.user.service;

import org.springframework.web.multipart.MultipartFile;

public interface UserService {
    String saveProfileImg(Integer userId, MultipartFile file);
}
