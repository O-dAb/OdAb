package com.ssafy.odab.domain.image.controller;

import com.ssafy.odab.domain.image.service.ImageService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Controller;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.ResponseBody;
import org.springframework.web.multipart.MultipartRequest;

import java.io.IOException;
import java.util.HashMap;
import java.util.Map;

@Controller
public class ImageController {

    private ImageService imageService;
    @Autowired
    public void setImageService(ImageService imageService) {
        this.imageService = imageService;
    }


    @PostMapping("/image/upload")
    @ResponseBody
    public Map<String, Object> imageUpload(MultipartRequest request) throws Exception {

        // s3Url을 특정 키에 넣어서 앞단에 보내주려면 키를 json타입으로 보내주기 위해 선언
        Map<String, Object> response = new HashMap<>();

        try {

            String s3Url =  imageService.uploadImage(request);
            response.put("uploaded", true);
            response.put("url", s3Url);

            return response;
        } catch (IOException e) {
            e.printStackTrace();
            response.put("uploaded", false);
            response.put("error", e.getMessage());
            return response;
        }

    }



}
