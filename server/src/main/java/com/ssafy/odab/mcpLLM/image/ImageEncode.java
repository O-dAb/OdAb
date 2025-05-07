package com.ssafy.odab.mcpLLM.image;
import org.springframework.stereotype.Component;

import java.io.IOException;
import java.nio.file.Files;
import java.nio.file.Path;
import java.util.Base64;

@Component
public class ImageEncode {

    public static String encodeImageToBase64(String imagePath) throws IOException {
        byte[] fileContent = Files.readAllBytes(Path.of(imagePath));
        return Base64.getEncoder().encodeToString(fileContent);
    }

    // 파일 확장자에 따른 MIME 타입 반환
    public static String getMimeType(String imagePath) {
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
