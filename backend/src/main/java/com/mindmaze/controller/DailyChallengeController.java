package com.mindmaze.controller;

import com.mindmaze.dto.AttemptRequest;
import com.mindmaze.dto.AttemptResponse;
import com.mindmaze.dto.DailyChallengeDto;
import com.mindmaze.entity.User;
import com.mindmaze.service.DailyChallengeService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/games/daily")
@RequiredArgsConstructor
public class DailyChallengeController {

    private final DailyChallengeService dailyChallengeService;

    @GetMapping
    public ResponseEntity<DailyChallengeDto> getDailyChallenge(@AuthenticationPrincipal User user) {
        Long userId = user != null ? user.getId() : null;
        return ResponseEntity.ok(dailyChallengeService.getDailyChallenge(userId));
    }

    @PostMapping("/attempts")
    public ResponseEntity<AttemptResponse> submitDailyChallengeAttempt(
            @RequestBody AttemptRequest request,
            @AuthenticationPrincipal User user) {
        if (user == null) {
            return ResponseEntity.status(401).build();
        }
        return ResponseEntity.ok(dailyChallengeService.submitAttempt(user.getId(), request));
    }
}
