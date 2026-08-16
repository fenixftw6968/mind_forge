package com.mindmaze.dto;

import lombok.*;
import java.time.LocalDateTime;
import java.util.List;

@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class UserDto {
    private Long id;
    private String username;
    private String email;
    private Integer xp;
    private Integer level;
    private String rank;
    private Integer coins;
    private Integer currentStreak;
    private Integer longestStreak;
    private Integer gamesCompleted;
    private Integer mysteriesSolved;
    private LocalDateTime createdAt;
    private List<RecentActivity> recentActivity;

    @Getter
    @Setter
    @NoArgsConstructor
    @AllArgsConstructor
    @Builder
    public static class RecentActivity {
        private Long id;
        private String action;
        private Integer xpGained;
        private String timestamp;
        private String icon;
    }
}
