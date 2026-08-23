package com.mindmaze.service;

import com.fasterxml.jackson.databind.JsonNode;
import com.fasterxml.jackson.databind.ObjectMapper;
import com.mindmaze.dto.AttemptRequest;
import com.mindmaze.dto.AttemptResponse;
import com.mindmaze.dto.DailyChallengeDto;
import com.mindmaze.entity.DailyChallenge;
import com.mindmaze.entity.User;
import com.mindmaze.entity.UserDailyChallenge;
import com.mindmaze.exception.BadRequestException;
import com.mindmaze.exception.ResourceNotFoundException;
import com.mindmaze.repository.DailyChallengeRepository;
import com.mindmaze.repository.UserDailyChallengeRepository;
import com.mindmaze.repository.UserRepository;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.LocalDate;
import java.time.LocalDateTime;
import java.time.LocalTime;
import java.util.List;

@Slf4j
@Service
@RequiredArgsConstructor
public class DailyChallengeService {

    private final DailyChallengeRepository dailyChallengeRepository;
    private final UserDailyChallengeRepository userDailyChallengeRepository;
    private final UserRepository userRepository;
    private final UserService userService;
    private final ObjectMapper objectMapper;

    @Transactional
    public DailyChallengeDto getDailyChallenge(Long userId) {
        LocalDate today = LocalDate.now();
        DailyChallenge challenge = dailyChallengeRepository.findByChallengeDate(today)
                .orElseGet(() -> {
                    // Fallback: If no challenge exists for today, find any existing one and set its date to today
                    List<DailyChallenge> all = dailyChallengeRepository.findAll();
                    if (!all.isEmpty()) {
                        DailyChallenge first = all.get(0);
                        first.setChallengeDate(today);
                        return dailyChallengeRepository.save(first);
                    }
                    // If absolutely nothing is seeded, create a default one
                    DailyChallenge fallback = DailyChallenge.builder()
                            .title("The Paradox Sequence")
                            .description("A master-level number sequence that has stumped 80% of players. Do you have what it takes?")
                            .challengeDate(today)
                            .type("number-detective")
                            .difficulty("HARD")
                            .xpReward(100)
                            .coinReward(50)
                            .puzzle("{\"question\": \"1, 1, 2, 3, 5, 8, 13, 21, ?\", \"answer\": \"34\", \"explanation\": \"Fibonacci sequence: 13 + 21 = 34\", \"hint\": \"Sum of consecutive pairs.\"}")
                            .build();
                    return dailyChallengeRepository.save(fallback);
                });

        boolean completedToday = false;
        Boolean isCorrect = null;
        Integer xpEarned = null;
        Integer coinsEarned = null;

        if (userId != null) {
            java.util.Optional<com.mindmaze.entity.UserDailyChallenge> attemptOpt = 
                userDailyChallengeRepository.findByUserIdAndDailyChallengeId(userId, challenge.getId());
            if (attemptOpt.isPresent()) {
                completedToday = true;
                com.mindmaze.entity.UserDailyChallenge attempt = attemptOpt.get();
                isCorrect = attempt.getIsCorrect();
                xpEarned = attempt.getXpEarned();
                coinsEarned = attempt.getCoinsEarned();
            }
        }

        // Calculate expiresAt (end of today)
        LocalDateTime expiresAt = today.plusDays(1).atStartOfDay();

        return DailyChallengeDto.builder()
                .id(challenge.getId())
                .title(challenge.getTitle())
                .description(challenge.getDescription())
                .type(challenge.getType())
                .difficulty(challenge.getDifficulty())
                .xpReward(challenge.getXpReward())
                .coinReward(challenge.getCoinReward())
                .puzzle(challenge.getPuzzle())
                .expiresAt(expiresAt.toString())
                .completedToday(completedToday)
                .isCorrect(isCorrect)
                .xpEarned(xpEarned)
                .coinsEarned(coinsEarned)
                .build();
    }

    @Transactional
    public AttemptResponse submitAttempt(Long userId, AttemptRequest request) {
        User user = userRepository.findById(userId)
                .orElseThrow(() -> new ResourceNotFoundException("User not found"));
        
        LocalDate today = LocalDate.now();
        DailyChallenge challenge = dailyChallengeRepository.findByChallengeDate(today)
                .orElseThrow(() -> new ResourceNotFoundException("Daily challenge not found for today"));

        boolean alreadyCompleted = userDailyChallengeRepository.existsByUserIdAndDailyChallengeId(userId, challenge.getId());
        if (alreadyCompleted) {
            throw new BadRequestException("You have already completed today's daily challenge!");
        }

        boolean isCorrect = false;
        String explanation = "";
        String correctAnsStr = "";
        try {
            JsonNode node = objectMapper.readTree(challenge.getPuzzle());
            if (node.has("answer")) {
                correctAnsStr = node.get("answer").asText();
                String submittedAnswer = request.getUserAnswer() != null ? request.getUserAnswer().trim() : "";
                isCorrect = !submittedAnswer.isEmpty() && correctAnsStr.trim().equalsIgnoreCase(submittedAnswer);
            }
            if (node.has("explanation")) {
                explanation = node.get("explanation").asText();
            }
        } catch (Exception e) {
            log.error("Failed to parse daily challenge answer", e);
        }

        int xpEarned = isCorrect ? challenge.getXpReward() : 0;
        int coinsEarned = isCorrect ? challenge.getCoinReward() : 0;

        UserDailyChallenge userChallenge = UserDailyChallenge.builder()
                .user(user)
                .dailyChallenge(challenge)
                .isCorrect(isCorrect)
                .xpEarned(xpEarned)
                .coinsEarned(coinsEarned)
                .build();

        userDailyChallengeRepository.save(userChallenge);

        if (isCorrect) {
            userService.updateProgression(user, xpEarned, coinsEarned, false, true);
        }

        return AttemptResponse.builder()
                .isCorrect(isCorrect)
                .correctAnswer(correctAnsStr)
                .explanation(explanation)
                .xpEarned(xpEarned)
                .coinsEarned(coinsEarned)
                .user(userService.convertToDto(user))
                .build();
    }
}
