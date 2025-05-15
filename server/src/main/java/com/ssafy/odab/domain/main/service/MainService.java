package com.ssafy.odab.domain.main.service;

import com.ssafy.odab.domain.main.dto.MainPageResponseDto;

public interface MainService {
    MainPageResponseDto getMainPage(Integer userId);
} 