package com.ssafy.odab.domain.image.service;

import com.amazonaws.services.s3.model.CannedAccessControlList;
import com.amazonaws.services.s3.model.ObjectMetadata;
import com.amazonaws.services.s3.model.PutObjectRequest;
import com.ssafy.odab.common.config.S3Config;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Service;
import org.springframework.web.multipart.MultipartFile;
import org.springframework.web.multipart.MultipartRequest;

import java.io.File;
import java.io.IOException;
import java.util.UUID;

@Service
public class ImageService {

    private S3Config s3Config;

    @Autowired
    public ImageService(S3Config s3Config) {
        this.s3Config = s3Config;
    }

    @Value("${cloud.aws.s3.bucket}")
    private String bucket;

    /**
     * 메모리 기반 S3 이미지 업로드 메소드
     * 로컬 디스크에 파일을 저장하지 않고 메모리에서 직접 S3로 업로드합니다.
     *
     * @param request 이미지 파일이 포함된 MultipartRequest 객체
     * @return S3에 저장된 이미지의 URL
     * @throws IOException 파일 처리 중 오류 발생 시
     */
    public String uploadImage(MultipartRequest request) throws IOException {
        // 1. 요청에서 이미지 파일 추출
        MultipartFile file = request.getFile("upload");

        // 2. 파일 이름 및 확장자 추출
        String fileName = file.getOriginalFilename();
        String ext = fileName.substring(fileName.lastIndexOf("."));

        // 3. 고유 식별자 생성 (파일명 중복 방지)
        String uuid = UUID.randomUUID() + ext;

        // 4. S3에 저장될 전체 경로(키) 설정
        String s3Key = "product/" + uuid;

        // 5. 메타데이터 설정 (파일 크기, 타입 등)
        ObjectMetadata metadata = new ObjectMetadata();
        metadata.setContentLength(file.getSize());
        metadata.setContentType(file.getContentType());

        // 6. 메모리에서 직접 S3로 파일 업로드
        s3Config.amazonS3().putObject(
                new PutObjectRequest(
                        bucket,
                        s3Key,
                        file.getInputStream(), // 입력 스트림을 직접 전달 (로컬 파일 생성 없음)
                        metadata
                ).withCannedAcl(CannedAccessControlList.PublicRead) // 공개 읽기 권한 설정
        );

        // 7. S3 이미지 URL 생성 및 반환
        String s3Url = s3Config.amazonS3().getUrl(bucket, s3Key).toString();

        return s3Url;
    }

    /**
     * 단일 MultipartFile을 S3에 업로드하는 메서드
     * 로컬 디스크에 파일을 저장하지 않고 메모리에서 직접 S3로 업로드합니다.
     *
     * @param file 업로드할 MultipartFile 객체
     * @return S3에 저장된 이미지의 URL
     * @throws IOException 파일 처리 중 오류 발생 시
     */
    public String uploadSingleImage(MultipartFile file) throws IOException {
        // 1. 파일 이름 및 확장자 추출
        String fileName = file.getOriginalFilename();
        String ext = fileName.substring(fileName.lastIndexOf("."));

        // 2. 고유 식별자 생성 (중복 방지)
        String uuid = UUID.randomUUID() + ext;

        // 3. S3에 저장될 전체 경로 설정
        String s3Key = "profile/" + uuid;

        // 4. 메타데이터 설정 (파일 크기, 타입 등)
        ObjectMetadata metadata = new ObjectMetadata();
        metadata.setContentLength(file.getSize());
        metadata.setContentType(file.getContentType());

        // 5. 메모리에서 직접 S3로 파일 업로드
        s3Config.amazonS3().putObject(
                new PutObjectRequest(
                        bucket,
                        s3Key,
                        file.getInputStream(), // 입력 스트림을 직접 전달 (로컬 파일 생성 없음)
                        metadata
                ).withCannedAcl(CannedAccessControlList.PublicRead) // 공개 읽기 권한 설정
        );

        // 6. S3 이미지 URL 생성 및 반환
        String s3Url = s3Config.amazonS3().getUrl(bucket, s3Key).toString();

        return s3Url;
    }

    /**
     * 로컬 저장소 경유 S3 이미지 업로드 메소드 (현재 사용하지 않음)
     * 이미지를 로컬 디스크에 임시 저장한 후 S3에 업로드하고 로컬 파일을 삭제합니다.
     *
     * 참고: 이 메소드는 디스크 I/O가 발생하여 성능이 저하될 수 있으며,
     * 서버 환경에 따라 권한 또는 디스크 공간 문제가 발생할 수 있습니다.
     *
     * @param request 이미지 파일이 포함된 MultipartRequest 객체
     * @return S3에 저장된 이미지의 URL
     * @throws IOException 파일 처리 중 오류 발생 시
     */
//    private String localLocation = "C:\\Users\\SSAFY\\Desktop";
//
//    public String uploadImage(MultipartRequest request) throws IOException {
//
//        // 1. 요청에서 이미지 파일 추출
//        MultipartFile file = request.getFile("upload");
//
//        // 2. 파일 이름 및 확장자 추출
//        String fileName = file.getOriginalFilename();
//        String ext = fileName.substring(fileName.lastIndexOf("."));
//
//        // 3. 고유 식별자 생성 (파일명 중복 방지)
//        String uuid = UUID.randomUUID() + ext;
//
//        // 4. 로컬 저장 경로 설정
//        String localPath = localLocation + uuid;
//
//        // 5. 서버의 로컬 디스크에 이미지 파일 임시 저장
//        File localFile = new File(localPath);
//        file.transferTo(localFile);
//
//        // 6. 로컬 파일을 S3에 업로드
//        s3Config.amazonS3().putObject(
//            new PutObjectRequest(
//                bucket,
//                "product/" + uuid,
//                localFile
//            ).withCannedAcl(CannedAccessControlList.PublicRead)
//        );
//
//        // 7. S3 이미지 URL 생성
//        // 주의: URL 생성 경로 오류 - product/ 접두어 누락
//        // 올바른 방법: s3Config.amazonS3().getUrl(bucket, "product/" + uuid).toString();
//        String s3Url = s3Config.amazonS3().getUrl(bucket, uuid).toString();
//
//        // 8. 임시 저장된 로컬 파일 삭제
//        localFile.delete();
//
//        return s3Url;
//    }
}