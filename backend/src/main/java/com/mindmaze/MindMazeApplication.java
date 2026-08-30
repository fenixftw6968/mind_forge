package com.mindmaze;

import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;
import org.springframework.scheduling.annotation.EnableScheduling;

@SpringBootApplication
@EnableScheduling
public class MindMazeApplication {
    public static void main(String[] args) {
        SpringApplication.run(MindMazeApplication.class, args);
    }
}
