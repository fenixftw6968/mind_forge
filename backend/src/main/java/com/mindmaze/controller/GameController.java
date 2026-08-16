package com.mindmaze.controller;

import com.mindmaze.dto.AttemptRequest;
import com.mindmaze.dto.AttemptResponse;
import com.mindmaze.dto.GameDto;
import com.mindmaze.dto.PuzzleDto;
import com.mindmaze.entity.User;
import com.mindmaze.service.GameService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/games")
@RequiredArgsConstructor
public class GameController {

    private final GameService gameService;

    @GetMapping
    public ResponseEntity<List<GameDto>> getAllGames() {
        return ResponseEntity.ok(gameService.getAllGames());
    }

    @GetMapping("/{slug}")
    public ResponseEntity<GameDto> getGameBySlug(@PathVariable String slug) {
        return ResponseEntity.ok(gameService.getGameBySlug(slug));
    }

    @GetMapping("/{slug}/puzzles")
    public ResponseEntity<List<PuzzleDto>> getPuzzles(
            @PathVariable String slug,
            @RequestParam(required = false) String difficulty) {
        return ResponseEntity.ok(gameService.getPuzzlesByGame(slug, difficulty));
    }

    @PostMapping("/{slug}/attempts")
    public ResponseEntity<AttemptResponse> submitAttempt(
            @PathVariable String slug,
            @RequestBody AttemptRequest request,
            @AuthenticationPrincipal User user) {
        if (user == null) {
            return ResponseEntity.status(401).build();
        }
        return ResponseEntity.ok(gameService.submitAttempt(user.getId(), slug, request));
    }
}
