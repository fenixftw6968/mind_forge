package com.mindmaze.repository;

import com.mindmaze.entity.UserDailyChallenge;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

@Repository
public interface UserDailyChallengeRepository extends JpaRepository<UserDailyChallenge, Long> {
    boolean existsByUserIdAndDailyChallengeId(Long userId, Long dailyChallengeId);
}
