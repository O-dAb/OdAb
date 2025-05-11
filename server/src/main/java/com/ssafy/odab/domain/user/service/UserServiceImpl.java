package com.ssafy.odab.domain.user.service;

import com.ssafy.odab.domain.image.service.ImageService;
import com.ssafy.odab.domain.user.entity.User;
import com.ssafy.odab.domain.user.repository.UserRepository;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.web.multipart.MultipartFile;

import java.util.NoSuchElementException;

@Service
@Transactional
public class UserServiceImpl implements UserService {

    private final UserRepository userRepository;
    private final ImageService imageService;

    public UserServiceImpl(UserRepository userRepository, ImageService imageService) {
        this.userRepository = userRepository;
        this.imageService = imageService;
    }

    @Override
    public String saveProfileImg(Integer userId, MultipartFile file) {
        try {
            // 1. 파일 유효성 검사
            if(file == null || file.isEmpty()) {
                throw new IllegalArgumentException("파일이 비어있습니다.");
            }
            // 2. 이미지 파일 타입 검사
            String contentType = file.getContentType();
            if (contentType == null) {
                throw new IllegalArgumentException("파일 타입을 확인할 수 없습니다.");
            }
            // 허용된 이미지 타입 목록
            String[] allowedTypes = {"image/jpeg", "image/png", "image/gif", "image/bmp", "image/webp"};
            boolean isImageFile = false;
            for (String type : allowedTypes) {
                if (contentType.equals(type)) {
                    isImageFile = true;
                    break;
                }
            }
            if (!isImageFile) {
                throw new IllegalArgumentException("이미지 파일만 업로드 가능합니다. 허용된 형식: JPEG, PNG, GIF, BMP, WEBP");
            }

            // 3. 사용자 조회
            User user = userRepository.findById(userId).orElse(null);
            if(user == null) {
                throw new NoSuchElementException("사용자를 찾을 수 없습니다. ID: " + userId);
            }

            // 4. S3에 이미지 업로드
            String imageUrl = imageService.uploadSingleImage(file);

            // 5. 사용자 프로필 URL 업데이트
            user.updateProfileUrl(imageUrl);
            userRepository.save(user);

            // 6. 이미지 URL 반환
            return imageUrl;

        } catch (Exception e) {
            throw new RuntimeException("프로필 이미지 저장 중 오류 발생: " + e.getMessage(), e);
        }
    }
}

