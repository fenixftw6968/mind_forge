package com.mindmaze.service;

import com.mindmaze.dto.LeaderboardEntryDto;
import com.mindmaze.entity.User;
import com.mindmaze.repository.UserRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.ArrayList;
import java.util.List;

@Service
@RequiredArgsConstructor
public class LeaderboardService {

    private final UserRepository userRepository;

    @Transactional(readOnly = true)
    public List<LeaderboardEntryDto> getLeaderboard(String sortBy) {
        List<User> sortedUsers;

        if ("streak".equalsIgnoreCase(sortBy)) {
            sortedUsers = userRepository.findAllOrderByStreakDesc();
        } else if ("games".equalsIgnoreCase(sortBy)) {
            sortedUsers = userRepository.findAllOrderByGamesCompletedDesc();
        } else {
            sortedUsers = userRepository.findAllOrderByXpDesc();
        }

        List<LeaderboardEntryDto> result = new ArrayList<>();
        int rank = 1;
        for (User user : sortedUsers) {
            result.add(LeaderboardEntryDto.builder()
                    .rank(rank++)
                    .username(user.getUsername())
                    .level(user.getLevel())
                    .xp(user.getXp())
                    .streak(user.getCurrentStreak())
                    .build());
        }

        return result;
    }
}
