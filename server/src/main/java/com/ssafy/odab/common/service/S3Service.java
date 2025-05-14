package com.ssafy.odab.common.service;

import org.springframework.web.multipart.MultipartFile;

public interface S3Service {
    String uploadFile(MultipartFile file, String dirName);
    void deleteFile(String fileUrl);
} 