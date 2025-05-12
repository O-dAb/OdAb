package com.ssafy.odab.mcpLLM.image;

import com.amazonaws.services.s3.AmazonS3;
import com.amazonaws.services.s3.model.S3Object;
import com.amazonaws.services.s3.model.S3ObjectInputStream;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Component;
import org.springframework.web.multipart.MultipartFile;

import java.io.ByteArrayOutputStream;
import java.io.IOException;
import java.nio.file.Files;
import java.nio.file.Path;
import java.util.Base64;

@Component
@RequiredArgsConstructor
public class ImageEncode {
    private final AmazonS3 amazonS3;

    public String encodeImageToBase64(String imagePath) throws IOException {
        if (imagePath.startsWith("http")) {
            // S3 URL인 경우
            return encodeS3ImageToBase64(imagePath);
        } else {
            // 로컬 파일인 경우
            return encodeLocalImageToBase64(imagePath);
        }
    }

    public String encodeImageToBase64(MultipartFile file) throws IOException {
        byte[] fileContent = file.getBytes();
        return Base64.getEncoder().encodeToString(fileContent);
    }

    private String encodeS3ImageToBase64(String s3Url) throws IOException {
        String bucket = s3Url.split("/")[2].split("\\.")[0];
        String key = s3Url.substring(s3Url.indexOf("/", 8) + 1);
        
        try (S3Object s3Object = amazonS3.getObject(bucket, key);
             S3ObjectInputStream inputStream = s3Object.getObjectContent();
             ByteArrayOutputStream outputStream = new ByteArrayOutputStream()) {
            
            byte[] buffer = new byte[4096];
            int bytesRead;
            while ((bytesRead = inputStream.read(buffer)) != -1) {
                outputStream.write(buffer, 0, bytesRead);
            }
            
            byte[] imageBytes = outputStream.toByteArray();
            return Base64.getEncoder().encodeToString(imageBytes);
        }
    }

    private String encodeLocalImageToBase64(String imagePath) throws IOException {
        byte[] fileContent = Files.readAllBytes(Path.of(imagePath));
        return Base64.getEncoder().encodeToString(fileContent);
    }

    public String getMimeType(String imagePath) {
        if (imagePath.startsWith("http")) {
            // S3 URL인 경우
            String key = imagePath.substring(imagePath.indexOf("/", 8) + 1);
            String bucket = imagePath.split("/")[2].split("\\.")[0];
            S3Object s3Object = amazonS3.getObject(bucket, key);
            return s3Object.getObjectMetadata().getContentType();
        } else {
            // 로컬 파일인 경우
            if (imagePath.toLowerCase().endsWith(".jpg") || imagePath.toLowerCase().endsWith(".jpeg")) {
                return "image/jpeg";
            } else if (imagePath.toLowerCase().endsWith(".png")) {
                return "image/png";
            } else if (imagePath.toLowerCase().endsWith(".gif")) {
                return "image/gif";
            } else if (imagePath.toLowerCase().endsWith(".webp")) {
                return "image/webp";
            }
            return "application/octet-stream";
        }
    }
}
