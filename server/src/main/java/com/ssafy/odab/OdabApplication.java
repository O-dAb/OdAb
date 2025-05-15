package com.ssafy.odab;

import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;
import org.springframework.data.web.config.EnableSpringDataWebSupport;

@SpringBootApplication
@EnableSpringDataWebSupport
public class OdabApplication {
    public static void main(String[] args) {
        SpringApplication.run(OdabApplication.class, args);
    }
}