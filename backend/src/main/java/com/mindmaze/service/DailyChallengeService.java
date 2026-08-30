package com.mindmaze.service;

import com.mindmaze.entity.DailyChallenge;
import com.mindmaze.entity.User;
import com.mindmaze.entity.UserDailyChallenge;
import com.mindmaze.exception.BadRequestException;
import com.mindmaze.exception.ResourceNotFoundException;
import com.mindmaze.repository.DailyChallengeRepository;
import com.mindmaze.repository.UserDailyChallengeRepository;
import com.mindmaze.repository.UserRepository;
import lombok.Builder;
import lombok.Data;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.scheduling.annotation.Scheduled;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.LocalDate;
import java.time.ZoneId;
import java.util.*;

@Slf4j
@Service
@RequiredArgsConstructor
public class DailyChallengeService {

    private final DailyChallengeRepository dailyChallengeRepository;
    private final UserDailyChallengeRepository userDailyChallengeRepository;
    private final UserRepository userRepository;
    private final UserService userService;

    private static final ZoneId IST_ZONE = ZoneId.of("Asia/Kolkata");

    @Data
    @Builder
    private static class ChallengeTemplate {
        private String title;
        private String description;
        private String type;
        private String difficulty;
        private Integer xpReward;
        private Integer coinReward;
        private String puzzleJson;
    }

    /**
     * Curated catalog of high-quality rotating daily challenges across our active lineup:
     * - DSA Master Quiz (Algorithms, complexity, trees, data structures)
     * - Logic Puzzle (Number sequences, pattern deduction, analogies)
     * - Brain Teaser Battle (Mental math, lateral reasoning, riddles)
     * - Number Detective (Mathematical sequences & patterns)
     * - Memory Challenge (Observation & apparatus recall)
     * - Code Breaker (Deductive logic & secret ciphers)
     */
    private static final List<ChallengeTemplate> CURATED_CHALLENGES = List.of(
        // 1. DSA Master Quiz - Tree Time Complexity
        ChallengeTemplate.builder()
            .title("Binary Search Tree Asymptotics")
            .description("Test your algorithmic asymptotic reasoning on binary search tree operations.")
            .type("dsa-master-quiz")
            .difficulty("HARD")
            .xpReward(120)
            .coinReward(60)
            .puzzleJson("{\"question\": \"What is the worst-case search time complexity in a completely unbalanced binary search tree of N nodes?\", \"options\": [\"O(N)\", \"O(log N)\", \"O(N log N)\", \"O(1)\"], \"answer\": \"O(N)\", \"explanation\": \"When keys are inserted in sorted order, an unbalanced BST degenerates into a linear linked list of height N, requiring O(N) traversal time.\", \"hint\": \"Think about a degenerate tree that resembles a singly linked list.\"}")
            .build(),

        // 2. Logic Puzzle - Fibonacci Sequence
        ChallengeTemplate.builder()
            .title("The Paradox Sequence")
            .description("A master-level sequence puzzle testing your pattern deduction skills. Find the missing integer.")
            .type("logic-puzzle")
            .difficulty("HARD")
            .xpReward(100)
            .coinReward(50)
            .puzzleJson("{\"question\": \"1, 1, 2, 3, 5, 8, 13, 21, ?\", \"options\": [\"34\", \"33\", \"35\", \"36\"], \"answer\": \"34\", \"explanation\": \"Fibonacci sequence: each number is the sum of the two preceding ones. 13 + 21 = 34.\", \"hint\": \"Look at the sum of consecutive pairs.\"}")
            .build(),

        // 3. Brain Teaser Battle - Bat & Ball
        ChallengeTemplate.builder()
            .title("The Arithmetic Equipment Puzzle")
            .description("A classic cognitive reflection test testing your immediate mathematical deduction.")
            .type("brain-teaser-battle")
            .difficulty("MEDIUM")
            .xpReward(90)
            .coinReward(45)
            .puzzleJson("{\"question\": \"A bat and a ball cost $1.10 in total. The bat costs $1.00 more than the ball. How much does the ball cost?\", \"options\": [\"$0.05 (5 cents)\", \"$0.10 (10 cents)\", \"$0.01 (1 cent)\", \"$0.15 (15 cents)\"], \"answer\": \"$0.05 (5 cents)\", \"explanation\": \"Let ball = x. Bat = x + 1.00. x + (x + 1.00) = 1.10 -> 2x = 0.10 -> x = $0.05. (Bat = $1.05, total = $1.10).\", \"hint\": \"Set up the simple linear equation: x + (x + 1.00) = 1.10.\"}")
            .build(),

        // 4. Memory Challenge - Laboratory Station
        ChallengeTemplate.builder()
            .title("Laboratory Apparatus Recall")
            .description("Recall the specific scientific equipment placed in the secure chemistry research station.")
            .type("memory-challenge")
            .difficulty("MEDIUM")
            .xpReward(100)
            .coinReward(50)
            .puzzleJson("{\"question\": \"In the high-tech lab scene with: 🔬 Microscope, 🧪 Test Tube, 🧬 DNA Helix, 🌡️ Thermometer, 🧲 Magnet, and ⚗️ Flask — what was the magnetic tool displayed?\", \"options\": [\"Magnet\", \"Compass\", \"Battery\", \"Laser\"], \"answer\": \"Magnet\", \"explanation\": \"The laboratory station contained a red horseshoe Magnet (🧲).\", \"hint\": \"Look for the tool used to attract ferromagnetic metals.\"}")
            .build(),

        // 5. Code Breaker - Master Vault
        ChallengeTemplate.builder()
            .title("The Quantum Vault Cipher")
            .description("Deduce the 3-digit secret passcode using deductive reasoning and elimination.")
            .type("code-breaker")
            .difficulty("HARD")
            .xpReward(120)
            .coinReward(60)
            .puzzleJson("{\"question\": \"Deduce the 3-digit secret code: [6, 8, 2] has 1 correct & well placed; [6, 1, 4] has 1 correct but wrongly placed; [2, 0, 6] has 2 correct but wrongly placed; [7, 3, 8] has NOTHING correct; [7, 8, 0] has 1 correct but wrongly placed. What is the 3-digit code?\", \"options\": [\"042\", \"024\", \"420\", \"204\"], \"answer\": \"042\", \"explanation\": \"From [7,3,8] invalid, eliminate 7, 8, 3. From [6,8,2] with 8 out: either 6 or 2 is in pos 1 or 3. From [2,0,6] and [6,1,4], 6 is eliminated. Thus 2 is in position 3, 0 is in position 1, and 4 is in position 2 giving 042.\", \"hint\": \"Start by eliminating numbers from the clue with NOTHING correct (7, 3, 8).\"}")
            .build(),

        // 6. Number Detective - Cubic Progression
        ChallengeTemplate.builder()
            .title("The Cubic Spiral")
            .description("Detect the exponential power progression in this high-tier numerical puzzle.")
            .type("number-detective")
            .difficulty("MEDIUM")
            .xpReward(80)
            .coinReward(40)
            .puzzleJson("{\"question\": \"1, 8, 27, 64, 125, ?\", \"options\": [\"196\", \"216\", \"225\", \"256\"], \"answer\": \"216\", \"explanation\": \"These are consecutive perfect cubes: 1³=1, 2³=8, 3³=27, 4³=64, 5³=125, 6³=216.\", \"hint\": \"Think about cubes of consecutive positive integers (n³).\"}")
            .build(),

        // 7. DSA Master Quiz - Dynamic Programming Knapsack
        ChallengeTemplate.builder()
            .title("Knapsack Complexity Deduction")
            .description("Analyze the state-space bound for classic 0/1 knapsack dynamic programming.")
            .type("dsa-master-quiz")
            .difficulty("HARD")
            .xpReward(130)
            .coinReward(65)
            .puzzleJson("{\"question\": \"What is the time complexity of the dynamic programming solution for 0/1 Knapsack with N items and maximum weight W?\", \"options\": [\"O(N * W)\", \"O(2^N)\", \"O(N log W)\", \"O(W^2)\"], \"answer\": \"O(N * W)\", \"explanation\": \"The 2D DP grid dp[N+1][W+1] evaluates each state in O(1) time, yielding pseudo-polynomial O(N * W) total runtime.\", \"hint\": \"The DP table has dimensions proportional to the number of items and the capacity.\"}")
            .build(),

        // 8. Logic Puzzle - Clock Hands Angle
        ChallengeTemplate.builder()
            .title("The Chronometer Divergence")
            .description("Calculate the exact angular separation between the clock hands.")
            .type("logic-puzzle")
            .difficulty("MEDIUM")
            .xpReward(85)
            .coinReward(45)
            .puzzleJson("{\"question\": \"At 3:15, what is the acute angle between the hour hand and the minute hand?\", \"options\": [\"7.5 degrees\", \"0 degrees\", \"15 degrees\", \"5 degrees\"], \"answer\": \"7.5 degrees\", \"explanation\": \"At 15 minutes, the minute hand points directly at 90°. The hour hand is at 3 * 30° + 15 * 0.5° = 97.5°. Difference = 97.5° - 90° = 7.5°.\", \"hint\": \"The hour hand moves 0.5 degrees every minute.\"}")
            .build(),

        // 9. Brain Teaser Battle - Monty Hall Paradox
        ChallengeTemplate.builder()
            .title("The Grand Prize Probability")
            .description("Resolve the famous 3-door conditional probability dilemma.")
            .type("brain-teaser-battle")
            .difficulty("HARD")
            .xpReward(110)
            .coinReward(55)
            .puzzleJson("{\"question\": \"In the Monty Hall 3-door problem, after the host opens an unchosen door with a goat, what is the probability of winning if you switch?\", \"options\": [\"2/3\", \"1/2\", \"1/3\", \"3/4\"], \"answer\": \"2/3\", \"explanation\": \"Your initial choice had a 1/3 chance of being the car and a 2/3 chance of being a goat. Switching captures the entire remaining 2/3 probability.\", \"hint\": \"Your initial choice had a 1-in-3 chance of being right.\"}")
            .build(),

        // 10. Memory Challenge - Cyber Security Rig
        ChallengeTemplate.builder()
            .title("Cyber Defense Rig Recall")
            .description("Recall the hardware components configured in the network defense console.")
            .type("memory-challenge")
            .difficulty("MEDIUM")
            .xpReward(95)
            .coinReward(45)
            .puzzleJson("{\"question\": \"In the terminal rack containing: 💻 Laptop, 🖥️ Mainframe Monitor, 📡 Satellite Dish, 🔐 Hardware Key, 🖧 Router, and 💾 Floppy Drive — which item secured the encryption?\", \"options\": [\"Hardware Key\", \"USB Stick\", \"Smartcard\", \"Dongle\"], \"answer\": \"Hardware Key\", \"explanation\": \"The security rig featured a Gold Hardware Key (🔐) for root access.\", \"hint\": \"Recall the lock-and-key component.\"}")
            .build(),

        // 11. Number Detective - Second Differences
        ChallengeTemplate.builder()
            .title("The Quadratic Staircase")
            .description("Find the next integer in this second-difference quadratic progression.")
            .type("number-detective")
            .difficulty("HARD")
            .xpReward(105)
            .coinReward(50)
            .puzzleJson("{\"question\": \"2, 6, 12, 20, 30, ?\", \"options\": [\"38\", \"40\", \"42\", \"44\"], \"answer\": \"42\", \"explanation\": \"Differences between terms are +4, +6, +8, +10, so next difference is +12. 30 + 12 = 42 (also n*(n+1): 6*7 = 42).\", \"hint\": \"Examine the difference between consecutive numbers: +4, +6, +8, +10...\"}")
            .build(),

        // 12. Code Breaker - Titanium Safe
        ChallengeTemplate.builder()
            .title("The Obsidian Lockbox")
            .description("Crack the 3-digit combination through logical deduction.")
            .type("code-breaker")
            .difficulty("HARD")
            .xpReward(115)
            .coinReward(55)
            .puzzleJson("{\"question\": \"[1, 4, 7] has 1 correct and in right place; [1, 8, 9] has 1 correct but wrong place; [9, 6, 4] has 2 correct but wrong place; [5, 2, 3] has NOTHING correct; [2, 8, 6] has 1 correct but wrong place. What is the 3-digit code?\", \"options\": [\"679\", \"976\", \"769\", \"469\"], \"answer\": \"679\", \"explanation\": \"5, 2, 3 eliminated. From [2,8,6] with 2 out: 8 or 6 is correct. From [1,8,9] and [9,6,4], eliminating gives 6 in pos 1, 7 in pos 2, 9 in pos 3 -> 679.\", \"hint\": \"Eliminate 5, 2, 3 immediately, then examine position clues for 6 and 7.\"}")
            .build()
    );

    /**
     * Determines today's canonical challenge based on Asia/Kolkata date.
     * Rotates deterministically through the curated catalog of diverse game challenges.
     */
    private ChallengeTemplate getTemplateForDate(LocalDate date) {
        long epochDay = date.toEpochDay();
        int index = (int) Math.floorMod(epochDay, CURATED_CHALLENGES.size());
        return CURATED_CHALLENGES.get(index);
    }

    /**
     * Scheduled job running at 12:00:00 AM IST every midnight.
     * Automatically creates and seeds the next daily challenge in the database.
     */
    @Scheduled(cron = "0 0 0 * * *", zone = "Asia/Kolkata")
    @Transactional
    public void generateDailyChallengeAtMidnight() {
        LocalDate todayIST = LocalDate.now(IST_ZONE);
        log.info("Midnight IST Trigger: Ensuring daily challenge for date {}", todayIST);
        ensureChallengeForDate(todayIST);
    }

    @Transactional
    public DailyChallenge ensureChallengeForDate(LocalDate date) {
        Optional<DailyChallenge> existing = dailyChallengeRepository.findByChallengeDate(date);
        if (existing.isPresent()) {
            return existing.get();
        }

        ChallengeTemplate template = getTemplateForDate(date);
        DailyChallenge challenge = DailyChallenge.builder()
                .challengeDate(date)
                .title(template.getTitle())
                .description(template.getDescription())
                .type(template.getType())
                .difficulty(template.getDifficulty())
                .xpReward(template.getXpReward())
                .coinReward(template.getCoinReward())
                .puzzle(template.getPuzzleJson())
                .build();

        DailyChallenge saved = dailyChallengeRepository.save(challenge);
        log.info("Created new daily challenge for date {}: '{}' ({})", date, saved.getTitle(), saved.getType());
        return saved;
    }

    @Transactional(readOnly = true)
    public Map<String, Object> getTodayChallenge(Long userId) {
        LocalDate today = LocalDate.now(IST_ZONE);
        DailyChallenge challenge = ensureChallengeForDate(today);

        boolean completed = false;
        Boolean isCorrect = null;
        Integer xpEarned = null;
        Integer coinsEarned = null;

        if (userId != null) {
            Optional<UserDailyChallenge> attempt = userDailyChallengeRepository.findByUserIdAndDailyChallengeId(userId, challenge.getId());
            if (attempt.isPresent()) {
                completed = true;
                isCorrect = attempt.get().getIsCorrect();
                xpEarned = attempt.get().getXpEarned();
                coinsEarned = attempt.get().getCoinsEarned();
            }
        }

        Map<String, Object> response = new HashMap<>();
        response.put("id", challenge.getId());
        response.put("challengeDate", challenge.getChallengeDate());
        response.put("title", challenge.getTitle());
        response.put("description", challenge.getDescription());
        response.put("type", challenge.getType());
        response.put("difficulty", challenge.getDifficulty());
        response.put("xpReward", challenge.getXpReward());
        response.put("coinReward", challenge.getCoinReward());
        response.put("puzzle", challenge.getPuzzle());
        response.put("completed", completed);
        response.put("isCorrect", isCorrect);
        response.put("xpEarned", xpEarned);
        response.put("coinsEarned", coinsEarned);
        response.put("expiresAt", today.plusDays(1).atStartOfDay(IST_ZONE).toInstant().toString());

        return response;
    }

    @Transactional
    public Map<String, Object> submitAnswer(Long userId, String answer) {
        LocalDate today = LocalDate.now(IST_ZONE);
        DailyChallenge challenge = ensureChallengeForDate(today);

        User user = userRepository.findById(userId)
                .orElseThrow(() -> new ResourceNotFoundException("User not found"));

        if (userDailyChallengeRepository.existsByUserIdAndDailyChallengeId(userId, challenge.getId())) {
            throw new BadRequestException("You have already attempted today's challenge!");
        }

        boolean isCorrect = false;
        String explanation = "Review the clue details.";
        String correctAnswer = "";

        try {
            com.fasterxml.jackson.databind.ObjectMapper mapper = new com.fasterxml.jackson.databind.ObjectMapper();
            com.fasterxml.jackson.databind.JsonNode root = mapper.readTree(challenge.getPuzzle());
            if (root.has("answer")) {
                correctAnswer = root.get("answer").asText();
                isCorrect = correctAnswer.trim().equalsIgnoreCase((answer != null ? answer : "").trim());
            }
            if (root.has("explanation")) {
                explanation = root.get("explanation").asText();
            }
        } catch (Exception e) {
            log.error("Failed to parse puzzle json for daily challenge {}", challenge.getId(), e);
        }

        int xpAwarded = 0;
        int coinsAwarded = 0;

        if (isCorrect) {
            xpAwarded = challenge.getXpReward();
            coinsAwarded = challenge.getCoinReward();
            userService.updateProgression(user, xpAwarded, coinsAwarded, true, true);
        } else {
            user.setLastPlayedDate(today);
            userRepository.save(user);
        }

        UserDailyChallenge userDaily = UserDailyChallenge.builder()
                .user(user)
                .dailyChallenge(challenge)
                .isCorrect(isCorrect)
                .xpEarned(xpAwarded)
                .coinsEarned(coinsAwarded)
                .build();

        userDailyChallengeRepository.save(userDaily);

        Map<String, Object> result = new HashMap<>();
        result.put("isCorrect", isCorrect);
        result.put("correctAnswer", correctAnswer);
        result.put("explanation", explanation);
        result.put("xpEarned", xpAwarded);
        result.put("coinsEarned", coinsAwarded);
        result.put("user", userService.convertToDto(user));

        return result;
    }
}
