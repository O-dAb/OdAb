package com.ssafy.odab.domain.user.controller;

import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/v1")
@RequiredArgsConstructor
public class UserController {

  @PutMapping("profile_img")
  public ResponseEntity<String> updateProfileImg(@RequestParam("profile_img") String profileImg) {
    return ResponseEntity.ok().body(profileImg);
  }





}
