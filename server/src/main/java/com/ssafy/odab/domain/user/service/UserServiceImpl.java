package com.ssafy.odab.domain.user.service;

import com.ssafy.odab.domain.image.service.ImageService;
import com.ssafy.odab.domain.user.entity.User;
import com.ssafy.odab.domain.user.repository.UserRepository;
import jakarta.persistence.EntityManager;
import jakarta.persistence.PersistenceContext;
import lombok.extern.slf4j.Slf4j;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.web.multipart.MultipartFile;

import java.util.NoSuchElementException;

@Service
@Transactional
@Slf4j
@PersistenceContext
public class UserServiceImpl implements UserService {

    private final UserRepository userRepository;
    private final ImageService imageService;
    /*
     * 영속성 컨텍스트를 관리하고 엔티티 관련 작업을 수행하는 EntityManager
     * 명시적인 flush() 호출이나 네이티브 쿼리 실행에 사용됩니다.
     */
    private EntityManager entityManager;

    /**
     * 사용자의 프로필 이미지를 저장하는 메서드
     *
     * @param userId 프로필 이미지를 저장할 사용자 ID
     * @param file 업로드된 이미지 파일
     * @return 저장된 이미지의 URL
     * @throws RuntimeException 이미지 저장 과정에서 발생한 모든 예외
     */
    public UserServiceImpl(UserRepository userRepository, ImageService imageService) {
        this.userRepository = userRepository;
        this.imageService = imageService;
    }

    @Override
    public String saveProfileImg(Integer userId, MultipartFile file) {
        try {
            // 1. 파일 유효성 검사
            if (file == null || file.isEmpty()) {
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
            if (user == null) {
                throw new NoSuchElementException("사용자를 찾을 수 없습니다. ID: " + userId);
            }

            // 4. S3에 이미지 업로드
            String imageUrl = imageService.uploadSingleImage(file);

            /*
             * 5. 사용자 프로필 URL 업데이트
             * - 엔티티 변경 감지(Dirty Checking)를 활용한 업데이트
             * - 사용자 엔티티의 profileUrl 필드 업데이트 후 저장
             */
            user.updateProfileUrl(imageUrl);
            userRepository.save(user);

            // 6. 이미지 URL 반환
            return imageUrl;

        } catch (Exception e) {
            throw new RuntimeException("프로필 이미지 저장 중 오류 발생: " + e.getMessage(), e);
        }
    }



    @Override
    @Transactional
    public void updateGrade(Integer userId, Integer grade) {

        log.info("학년 변경 서비스 시작 - 사용자 ID: {}, 학년: {}", userId, grade);
        User user = userRepository.findById(userId).orElse(null);
        if (user == null) {
            throw new NoSuchElementException("사용자를 찾을 수 없습니다. ID: " + userId);
        }
        log.info("변경 전 학년: {}", user.getGrade());

        /*
         * 방법 1: @Modifying 방식을 사용한 직접 쿼리 실행
         * - 장점: 단일 쿼리로 효율적인 업데이트, 영속성 컨텍스트 상태와 무관
         * - 단점: 객체 지향적이지 않음, 복잡한 업데이트에 제한적
         * - 사용 권장: 단일 필드 업데이트와 같은 간단한 작업
         */
        int updatedRows = userRepository.updateUserGrade(userId, grade);
        log.info("학년 변경 완료 - 업데이트된 행 수: {}", updatedRows);

        // 변경 후 확인
        User updatedUser = userRepository.findById(userId).orElse(null);
        log.info("저장 후 확인: {}", updatedUser != null ? updatedUser.getGrade() : "사용자 없음");

        /*
         * 방법 2: 변경 감지(Dirty Checking)를 사용한 업데이트
         * - 장점: 객체 지향적, 복잡한 비즈니스 로직에 적합, 여러 필드 동시 수정 용이
         * - 단점: 추가 조회 쿼리 발생, 영속성 컨텍스트 동기화 문제 가능성
         * - 사용 권장: 복잡한 업데이트 로직이나 여러 필드 동시 수정 시
         *
         * user.updateGrade(grade);
         * log.info("변경 후 학년: {}", user.getGrade());
         * userRepository.save(user);
         *
         * // 영속성 컨텍스트 동기화 문제 발생 시 명시적 플러시 필요
         * // entityManager.flush();
         *
         * log.info("저장 후 확인: {}", userRepository.findById(userId).get().getGrade());
         */

    }
}

