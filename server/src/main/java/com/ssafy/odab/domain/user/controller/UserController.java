package com.ssafy.odab.domain.user.controller;

import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

@RestController
@RequestMapping("/api/v1")
@RequiredArgsConstructor
public class UserController {

  @PostMapping("/login")
  public ResponseEntity<String> doLogin() {

    return ResponseEntity.ok("서버 되는거지 데브툴스도 된다.");
  }

}
