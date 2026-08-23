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
                    .isBotMatch(false)
                    .startedAt(LocalDateTime.now())
                    .build();

            match = matchRepository.save(match);
            return convertToDto(match);
        } else {
            // Also check if there's any open ranked match in database waiting for another player
            List<Match> openMatches = matchRepository.findOpenRankedMatches(gameSlug, user);
            if (!openMatches.isEmpty()) {
                // Pick open match with closest rating
                int myRating = user.getCompetitiveRating() != null ? user.getCompetitiveRating() : 500;
                Match bestMatch = openMatches.get(0);
                int minDiff = Math.abs(myRating - (bestMatch.getPlayer1RatingBefore() != null ? bestMatch.getPlayer1RatingBefore() : 500));
                for (Match m : openMatches) {
                    int diff = Math.abs(myRating - (m.getPlayer1RatingBefore() != null ? m.getPlayer1RatingBefore() : 500));
                    if (diff < minDiff) {
                        minDiff = diff;
                        bestMatch = m;
                    }
                }

                bestMatch.setPlayer2(user);
                bestMatch.setPlayer2RatingBefore(user.getCompetitiveRating() != null ? user.getCompetitiveRating() : 500);
                bestMatch.setStatus(Match.MatchStatus.READY);
                bestMatch.setPlayer1Ready(true);
                bestMatch.setPlayer2Ready(true);
                bestMatch.setIsBotMatch(false);
                bestMatch.setStartedAt(LocalDateTime.now());
                bestMatch = matchRepository.save(bestMatch);
                return convertToDto(bestMatch);
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
                    .isBotMatch(false)
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
        User user = userRepository.findById(userId).orElse(null);
        if (user != null) {
            List<Match> waiting = matchRepository.findWaitingMatchesByUser(user);
            for (Match m : waiting) {
                if (m.getMode() == Match.MatchMode.RANKED && m.getGameSlug().equals(gameSlug)) {
                    m.setStatus(Match.MatchStatus.CANCELLED);
                    m.setCancelledReason("CANCELLED_BY_PLAYER");
                    matchRepository.save(m);
                }
            }
        }
    }

    @Transactional
    public MatchDto createFriendMatch(Long hostUserId, Long friendUserId, String gameSlug) {
        User host = userRepository.findById(hostUserId)
                .orElseThrow(() -> new ResourceNotFoundException("Host user not found"));
        User friend = userRepository.findById(friendUserId)
                .orElseThrow(() -> new ResourceNotFoundException("Friend user not found"));

        String challengeData = generateChallengeData(gameSlug);

        // Cancel previous waiting friend matches between these two
        List<Match> waiting = matchRepository.findPendingInvitationsForUser(friend);
        for (Match w : waiting) {
            if (w.getPlayer1().getId().equals(hostUserId)) {
                w.setStatus(Match.MatchStatus.CANCELLED);
                w.setCancelledReason("REPLACED_BY_NEW_INVITATION");
                matchRepository.save(w);
            }
        }

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
                .isBotMatch(false)
                .build();

        match = matchRepository.save(match);
        return convertToDto(match);
    }

    @Transactional(readOnly = true)
    public List<MatchDto> getPendingInvitations(Long userId) {
        User user = userRepository.findById(userId)
                .orElseThrow(() -> new ResourceNotFoundException("User not found"));
        return matchRepository.findPendingInvitationsForUser(user).stream()
                .filter(m -> m.getCreatedAt().isAfter(LocalDateTime.now().minusMinutes(5)))
                .map(this::convertToDto)
                .toList();
    }

    @Transactional
    public MatchDto acceptFriendMatch(String matchId, Long friendUserId) {
        Match match = matchRepository.findById(matchId)
                .orElseThrow(() -> new ResourceNotFoundException("Match not found"));

        if (!match.getPlayer2().getId().equals(friendUserId)) {
            throw new BadRequestException("You are not the invited player for this match");
        }

        if (match.getStatus() != Match.MatchStatus.WAITING) {
            throw new BadRequestException("This match invitation is no longer active");
        }

        match.setPlayer2Ready(true);
        match.setStatus(Match.MatchStatus.READY);
        match.setStartedAt(LocalDateTime.now());
        match = matchRepository.save(match);
        return convertToDto(match);
    }

    @Transactional
    public MatchDto declineFriendMatch(String matchId, Long friendUserId) {
        Match match = matchRepository.findById(matchId)
                .orElseThrow(() -> new ResourceNotFoundException("Match not found"));

        if (!match.getPlayer2().getId().equals(friendUserId)) {
            throw new BadRequestException("You are not the invited player for this match");
        }

        match.setStatus(Match.MatchStatus.CANCELLED);
        match.setCancelledReason("DECLINED");
        match = matchRepository.save(match);
        return convertToDto(match);
    }

    @Transactional
    public MatchDto cancelMatch(String matchId, Long userId) {
        Match match = matchRepository.findById(matchId)
                .orElseThrow(() -> new ResourceNotFoundException("Match not found"));

        boolean isP1 = match.getPlayer1().getId().equals(userId);
        boolean isP2 = match.getPlayer2() != null && match.getPlayer2().getId().equals(userId);

        if (!isP1 && !isP2) {
            throw new BadRequestException("You are not a participant in this match");
        }

        match.setStatus(Match.MatchStatus.CANCELLED);
        match.setCancelledReason(isP1 ? "CANCELLED_BY_HOST" : "CANCELLED_BY_OPPONENT");
        match = matchRepository.save(match);

        cancelQueue(userId, match.getGameSlug());
        return convertToDto(match);
    }

    @Transactional
    public MatchDto abandonMatch(String matchId, Long userId) {
        Match match = matchRepository.findById(matchId)
                .orElseThrow(() -> new ResourceNotFoundException("Match not found"));

        boolean isP1 = match.getPlayer1().getId().equals(userId);
        boolean isP2 = match.getPlayer2() != null && match.getPlayer2().getId().equals(userId);

        if (!isP1 && !isP2) {
            throw new BadRequestException("You are not a participant in this match");
        }

        if (match.getStatus() == Match.MatchStatus.READY || match.getStatus() == Match.MatchStatus.IN_PROGRESS) {
            // Forfeit match: the abandoning player loses
            if (isP1) {
                match.setPlayer1Score(0);
                match.setPlayer1Finished(true);
                if (match.getPlayer2() != null) {
                    match.setPlayer2Score(Math.max(1, match.getPlayer2Score() != null ? match.getPlayer2Score() : 1));
                    match.setPlayer2Finished(true);
                }
            } else {
                match.setPlayer2Score(0);
                match.setPlayer2Finished(true);
                match.setPlayer1Score(Math.max(1, match.getPlayer1Score() != null ? match.getPlayer1Score() : 1));
                match.setPlayer1Finished(true);
            }
            finalizeMatch(match);
            match.setCancelledReason("ABANDONED");
            match = matchRepository.save(match);
        } else {
            match.setStatus(Match.MatchStatus.CANCELLED);
            match.setCancelledReason("ABANDONED");
            match = matchRepository.save(match);
        }

        cancelQueue(userId, match.getGameSlug());
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
        int r2 = p2 != null && p2.getCompetitiveRating() != null ? p2.getCompetitiveRating() : 500;

        match.setPlayer1RatingBefore(r1);
        match.setPlayer2RatingBefore(r2);

        if (actualScore1 == 1.0) {
            match.setWinnerId(p1.getId());
            p1.setMatchesWon((p1.getMatchesWon() != null ? p1.getMatchesWon() : 0) + 1);
        } else if (actualScore1 == 0.0 && p2 != null) {
            match.setWinnerId(p2.getId());
            p2.setMatchesWon((p2.getMatchesWon() != null ? p2.getMatchesWon() : 0) + 1);
        }

        p1.setMatchesPlayed((p1.getMatchesPlayed() != null ? p1.getMatchesPlayed() : 0) + 1);
        if (p2 != null) {
            p2.setMatchesPlayed((p2.getMatchesPlayed() != null ? p2.getMatchesPlayed() : 0) + 1);
        }

        // Apply Elo rating changes only for real human ranked matches (not bots)
        if (!Boolean.TRUE.equals(match.getIsBotMatch()) && p2 != null) {
            EloRatingService.EloResult eloResult = eloRatingService.calculateNewRatings(r1, r2, actualScore1);
            match.setPlayer1RatingChange(eloResult.getDeltaA());
            match.setPlayer2RatingChange(eloResult.getDeltaB());

            p1.setCompetitiveRating(eloResult.getNewRatingA());
            p2.setCompetitiveRating(eloResult.getNewRatingB());
            userRepository.save(p2);
        } else {
            match.setPlayer1RatingChange(0);
            match.setPlayer2RatingChange(0);
        }

        userRepository.save(p1);

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
                .isBotMatch(match.getIsBotMatch())
                .cancelledReason(match.getCancelledReason())
                .createdAt(match.getCreatedAt())
                .startedAt(match.getStartedAt())
                .finishedAt(match.getFinishedAt())
                .build();
    }
}
