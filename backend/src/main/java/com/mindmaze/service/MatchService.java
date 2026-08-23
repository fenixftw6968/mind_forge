package com.mindmaze.service;

import com.fasterxml.jackson.databind.ObjectMapper;
import com.mindmaze.dto.MatchDto;
import com.mindmaze.dto.MatchSubmitRequest;
import com.mindmaze.dto.PuzzleDto;
import com.mindmaze.entity.Match;
import com.mindmaze.entity.User;
import com.mindmaze.exception.BadRequestException;
import com.mindmaze.exception.ResourceNotFoundException;
import com.mindmaze.repository.MatchRepository;
import com.mindmaze.repository.UserRepository;
import com.mindmaze.util.RankUtil;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.LocalDateTime;
import java.util.*;
import java.util.concurrent.ConcurrentHashMap;

@Service
@RequiredArgsConstructor
@Slf4j
public class MatchService {

    private final MatchRepository matchRepository;
    private final UserRepository userRepository;
    private final EloRatingService eloRatingService;
    private final GameService gameService;
    private final ObjectMapper objectMapper;

    // Fast in-memory matchmaking queue by gameSlug: queue of User IDs
    private final Map<String, List<Long>> matchmakingQueues = new ConcurrentHashMap<>();

    @Transactional
    public MatchDto queueForMatch(Long userId, String gameSlug) {
        User user = userRepository.findById(userId)
                .orElseThrow(() -> new ResourceNotFoundException("User not found"));

        List<Long> queue = matchmakingQueues.computeIfAbsent(gameSlug, k -> Collections.synchronizedList(new ArrayList<>()));

        // Remove user if already present in queue
        queue.remove(userId);

        // Try to find a matched player in queue
        Long matchedUserId = null;
        synchronized (queue) {
            if (!queue.isEmpty()) {
                // Find opponent with closest rating
                int myRating = user.getCompetitiveRating() != null ? user.getCompetitiveRating() : 500;
                Long bestOpponent = null;
                int minDiff = Integer.MAX_VALUE;

                for (Long oppId : queue) {
                    if (!oppId.equals(userId)) {
                        Optional<User> oppOpt = userRepository.findById(oppId);
                        if (oppOpt.isPresent()) {
                            int oppRating = oppOpt.get().getCompetitiveRating() != null ? oppOpt.get().getCompetitiveRating() : 500;
                            int diff = Math.abs(myRating - oppRating);
                            if (diff < minDiff) {
                                minDiff = diff;
                                bestOpponent = oppId;
                            }
                        }
                    }
                }

                if (bestOpponent != null) {
                    queue.remove(bestOpponent);
                    matchedUserId = bestOpponent;
                }
            }
        }

        if (matchedUserId != null) {
            User opponent = userRepository.findById(matchedUserId).orElseThrow();
            // Generate server-side challenge data (puzzles)
            String challengeData = generateChallengeData(gameSlug);

            Match match = Match.builder()
                    .gameSlug(gameSlug)
                    .mode(Match.MatchMode.RANKED)
                    .status(Match.MatchStatus.READY)
                    .player1(opponent)
                    .player2(user)
                    .player1Ready(true)
                    .player2Ready(true)
                    .player1Score(0)
                    .player2Score(0)
                    .player1RatingBefore(opponent.getCompetitiveRating() != null ? opponent.getCompetitiveRating() : 500)
                    .player2RatingBefore(user.getCompetitiveRating() != null ? user.getCompetitiveRating() : 500)
                    .challengeData(challengeData)
                    .startedAt(LocalDateTime.now())
                    .build();

            match = matchRepository.save(match);
            return convertToDto(match);
        } else {
            // Also check if there's any open match in database
            List<Match> openMatches = matchRepository.findOpenRankedMatches(gameSlug, user);
            if (!openMatches.isEmpty()) {
                Match match = openMatches.get(0);
                match.setPlayer2(user);
                match.setPlayer2RatingBefore(user.getCompetitiveRating() != null ? user.getCompetitiveRating() : 500);
                match.setStatus(Match.MatchStatus.READY);
                match.setPlayer1Ready(true);
                match.setPlayer2Ready(true);
                match.setStartedAt(LocalDateTime.now());
                match = matchRepository.save(match);
                return convertToDto(match);
            }

            // Otherwise create open match or add to queue
            String challengeData = generateChallengeData(gameSlug);
            Match match = Match.builder()
                    .gameSlug(gameSlug)
                    .mode(Match.MatchMode.RANKED)
                    .status(Match.MatchStatus.WAITING)
                    .player1(user)
                    .player1Ready(true)
                    .player1RatingBefore(user.getCompetitiveRating() != null ? user.getCompetitiveRating() : 500)
                    .challengeData(challengeData)
                    .build();

            match = matchRepository.save(match);
            queue.add(userId);
            return convertToDto(match);
        }
    }

    @Transactional
    public void cancelQueue(Long userId, String gameSlug) {
        List<Long> queue = matchmakingQueues.get(gameSlug);
        if (queue != null) {
            queue.remove(userId);
        }
    }

    @Transactional
    public MatchDto createFriendMatch(Long hostUserId, Long friendUserId, String gameSlug) {
        User host = userRepository.findById(hostUserId)
                .orElseThrow(() -> new ResourceNotFoundException("Host user not found"));
        User friend = userRepository.findById(friendUserId)
                .orElseThrow(() -> new ResourceNotFoundException("Friend user not found"));

        String challengeData = generateChallengeData(gameSlug);

        Match match = Match.builder()
                .gameSlug(gameSlug)
                .mode(Match.MatchMode.FRIEND)
                .status(Match.MatchStatus.WAITING)
                .player1(host)
                .player2(friend)
                .player1Ready(true)
                .player2Ready(false)
                .player1RatingBefore(host.getCompetitiveRating() != null ? host.getCompetitiveRating() : 500)
                .player2RatingBefore(friend.getCompetitiveRating() != null ? friend.getCompetitiveRating() : 500)
                .challengeData(challengeData)
                .build();

        match = matchRepository.save(match);
        return convertToDto(match);
    }

    @Transactional
    public MatchDto acceptFriendMatch(String matchId, Long friendUserId) {
        // Find match
        Match match = matchRepository.findById(matchId)
                .orElseThrow(() -> new ResourceNotFoundException("Match not found"));

        if (!match.getPlayer2().getId().equals(friendUserId)) {
            throw new BadRequestException("You are not the invited player for this match");
        }

        match.setPlayer2Ready(true);
        match.setStatus(Match.MatchStatus.READY);
        match.setStartedAt(LocalDateTime.now());
        match = matchRepository.save(match);
        return convertToDto(match);
    }

    @Transactional(readOnly = true)
    public MatchDto getMatchStatus(String matchId) {
        Match match = matchRepository.findById(matchId)
                .orElseThrow(() -> new ResourceNotFoundException("Match not found"));
        return convertToDto(match);
    }

    @Transactional
    public MatchDto submitMatchResult(String matchId, Long userId, MatchSubmitRequest request) {
        Match match = matchRepository.findById(matchId)
                .orElseThrow(() -> new ResourceNotFoundException("Match not found"));

        boolean isPlayer1 = match.getPlayer1().getId().equals(userId);
        boolean isPlayer2 = match.getPlayer2() != null && match.getPlayer2().getId().equals(userId);

        if (!isPlayer1 && !isPlayer2) {
            throw new BadRequestException("User is not part of this match");
        }

        if (isPlayer1) {
            match.setPlayer1Score(request.getScore() != null ? request.getScore() : 0);
            match.setPlayer1TimeSeconds(request.getTimeTakenSeconds() != null ? request.getTimeTakenSeconds() : 0);
            match.setPlayer1Mistakes(request.getMistakes() != null ? request.getMistakes() : 0);
            match.setPlayer1Finished(true);
        } else {
            match.setPlayer2Score(request.getScore() != null ? request.getScore() : 0);
            match.setPlayer2TimeSeconds(request.getTimeTakenSeconds() != null ? request.getTimeTakenSeconds() : 0);
            match.setPlayer2Mistakes(request.getMistakes() != null ? request.getMistakes() : 0);
            match.setPlayer2Finished(true);
        }

        // If both finished (or if solo queue completed vs AI / async bot fallback if player2 was auto-simulated)
        if (Boolean.TRUE.equals(match.getPlayer1Finished()) && Boolean.TRUE.equals(match.getPlayer2Finished())) {
            finalizeMatch(match);
        } else if (match.getPlayer2() == null) {
            // Solo test finish
            match.setStatus(Match.MatchStatus.FINISHED);
            match.setFinishedAt(LocalDateTime.now());
        }

        match = matchRepository.save(match);
        return convertToDto(match);
    }

    private void finalizeMatch(Match match) {
        if (match.getStatus() == Match.MatchStatus.FINISHED) return;

        int score1 = match.getPlayer1Score() != null ? match.getPlayer1Score() : 0;
        int score2 = match.getPlayer2Score() != null ? match.getPlayer2Score() : 0;
        int time1  = match.getPlayer1TimeSeconds() != null ? match.getPlayer1TimeSeconds() : 999;
        int time2  = match.getPlayer2TimeSeconds() != null ? match.getPlayer2TimeSeconds() : 999;
        int err1   = match.getPlayer1Mistakes() != null ? match.getPlayer1Mistakes() : 0;
        int err2   = match.getPlayer2Mistakes() != null ? match.getPlayer2Mistakes() : 0;

        double actualScore1 = 0.5; // Draw
        if (score1 > score2) {
            actualScore1 = 1.0;
        } else if (score2 > score1) {
            actualScore1 = 0.0;
        } else {
            // Tie-breaker: fewer mistakes
            if (err1 < err2) {
                actualScore1 = 1.0;
            } else if (err2 < err1) {
                actualScore1 = 0.0;
            } else {
                // Tie-breaker: faster time
                if (time1 < time2) actualScore1 = 1.0;
                else if (time2 < time1) actualScore1 = 0.0;
            }
        }

        User p1 = match.getPlayer1();
        User p2 = match.getPlayer2();

        int r1 = p1.getCompetitiveRating() != null ? p1.getCompetitiveRating() : 500;
        int r2 = p2.getCompetitiveRating() != null ? p2.getCompetitiveRating() : 500;

        match.setPlayer1RatingBefore(r1);
        match.setPlayer2RatingBefore(r2);

        if (actualScore1 == 1.0) {
            match.setWinnerId(p1.getId());
            p1.setMatchesWon((p1.getMatchesWon() != null ? p1.getMatchesWon() : 0) + 1);
        } else if (actualScore1 == 0.0) {
            match.setWinnerId(p2.getId());
            p2.setMatchesWon((p2.getMatchesWon() != null ? p2.getMatchesWon() : 0) + 1);
        }

        p1.setMatchesPlayed((p1.getMatchesPlayed() != null ? p1.getMatchesPlayed() : 0) + 1);
        p2.setMatchesPlayed((p2.getMatchesPlayed() != null ? p2.getMatchesPlayed() : 0) + 1);

        // Calculate Elo ratings
        EloRatingService.EloResult eloResult = eloRatingService.calculateNewRatings(r1, r2, actualScore1);
        match.setPlayer1RatingChange(eloResult.getDeltaA());
        match.setPlayer2RatingChange(eloResult.getDeltaB());

        p1.setCompetitiveRating(eloResult.getNewRatingA());
        p2.setCompetitiveRating(eloResult.getNewRatingB());

        userRepository.save(p1);
        userRepository.save(p2);

        match.setStatus(Match.MatchStatus.FINISHED);
        match.setFinishedAt(LocalDateTime.now());
    }

    @Transactional(readOnly = true)
    public List<MatchDto> getRecentMatches(Long userId) {
        User user = userRepository.findById(userId)
                .orElseThrow(() -> new ResourceNotFoundException("User not found"));
        return matchRepository.findRecentMatchesByUser(user).stream()
                .limit(10)
                .map(this::convertToDto)
                .toList();
    }

    private String generateChallengeData(String gameSlug) {
        try {
            List<PuzzleDto> puzzles = gameService.getPuzzlesByGame(gameSlug, "MEDIUM");
            if (puzzles == null || puzzles.isEmpty()) {
                puzzles = gameService.getPuzzlesByGame(gameSlug, null);
            }
            if (puzzles != null && !puzzles.isEmpty()) {
                Collections.shuffle(puzzles);
                List<PuzzleDto> chosen = puzzles.stream().limit(5).toList();
                return objectMapper.writeValueAsString(chosen);
            }
        } catch (Exception e) {
            log.warn("Could not generate puzzle list from DB for match: {}", e.getMessage());
        }
        return "[]";
    }

    public MatchDto convertToDto(Match match) {
        User p1 = match.getPlayer1();
        User p2 = match.getPlayer2();

        int p1Rating = match.getPlayer1RatingBefore() != null ? match.getPlayer1RatingBefore() : (p1.getCompetitiveRating() != null ? p1.getCompetitiveRating() : 500);
        int p2Rating = match.getPlayer2RatingBefore() != null ? match.getPlayer2RatingBefore() : (p2 != null && p2.getCompetitiveRating() != null ? p2.getCompetitiveRating() : 500);

        String winnerName = null;
        if (match.getWinnerId() != null) {
            if (p1.getId().equals(match.getWinnerId())) winnerName = p1.getUsername();
            else if (p2 != null && p2.getId().equals(match.getWinnerId())) winnerName = p2.getUsername();
        }

        return MatchDto.builder()
                .id(match.getId())
                .gameSlug(match.getGameSlug())
                .mode(match.getMode().name())
                .status(match.getStatus().name())
                .player1Id(p1.getId())
                .player1Username(p1.getUsername())
                .player1Rating(p1Rating)
                .player1Rank(RankUtil.getRankName(p1Rating))
                .player1Score(match.getPlayer1Score())
                .player1TimeSeconds(match.getPlayer1TimeSeconds())
                .player1RatingChange(match.getPlayer1RatingChange())
                .player1Ready(match.getPlayer1Ready())
                .player1Finished(match.getPlayer1Finished())
                .player2Id(p2 != null ? p2.getId() : null)
                .player2Username(p2 != null ? p2.getUsername() : null)
                .player2Rating(p2Rating)
                .player2Rank(RankUtil.getRankName(p2Rating))
                .player2Score(match.getPlayer2Score())
                .player2TimeSeconds(match.getPlayer2TimeSeconds())
                .player2RatingChange(match.getPlayer2RatingChange())
                .player2Ready(match.getPlayer2Ready())
                .player2Finished(match.getPlayer2Finished())
                .winnerId(match.getWinnerId())
                .winnerUsername(winnerName)
                .challengeData(match.getChallengeData())
                .createdAt(match.getCreatedAt())
                .startedAt(match.getStartedAt())
                .finishedAt(match.getFinishedAt())
                .build();
    }
}
