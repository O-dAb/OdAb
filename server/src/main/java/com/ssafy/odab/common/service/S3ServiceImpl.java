package com.ssafy.odab.common.service;

import com.amazonaws.services.s3.AmazonS3;
import com.amazonaws.services.s3.model.ObjectMetadata;
import lombok.RequiredArgsConstructor;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Service;
import org.springframework.web.multipart.MultipartFile;

import java.io.ByteArrayInputStream;
import java.io.IOException;
import java.util.Base64;
import java.util.UUID;

@Service
@RequiredArgsConstructor
public class S3ServiceImpl implements S3Service {

    private final AmazonS3 amazonS3;

    @Value("${cloud.aws.s3.bucket}")
    private String bucket;

    @Override
    public String uploadFile(MultipartFile file, String dirName) {
        String fileName = createFileName(file.getOriginalFilename());
        String fileUrl = dirName + "/" + fileName;

        ObjectMetadata metadata = new ObjectMetadata();
        metadata.setContentType(file.getContentType());
        metadata.setContentLength(file.getSize());

        try {
            amazonS3.putObject(bucket, fileUrl, file.getInputStream(), metadata);
            return amazonS3.getUrl(bucket, fileUrl).toString();
        } catch (IOException e) {
            throw new RuntimeException("파일 업로드 실패", e);
        }
    }

    @Override
    public void deleteFile(String fileUrl) {
        String fileName = fileUrl.substring(fileUrl.lastIndexOf("/") + 1);
        amazonS3.deleteObject(bucket, fileName);
    }

    private String createFileName(String originalFileName) {
        return UUID.randomUUID().toString() + "_" + originalFileName;
    }

    @Override
    public String uploadBase64File(String base64Img, String dirName) {
        byte[] imageBytes = Base64.getDecoder().decode(base64Img);
        String contentType = ".png";

        String fileName = UUID.randomUUID() + contentType;
        String fileUrl = dirName + "/" + fileName;

        ObjectMetadata metadata = new ObjectMetadata();
        metadata.setContentType(contentType);
        metadata.setContentLength(imageBytes.length);
        amazonS3.putObject(bucket, fileUrl, new ByteArrayInputStream(imageBytes), metadata);
        return amazonS3.getUrl(bucket, fileUrl).toString();
    }
} 