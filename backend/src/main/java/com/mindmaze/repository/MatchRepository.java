package com.mindmaze.repository;

import com.mindmaze.entity.Match;
import com.mindmaze.entity.User;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface MatchRepository extends JpaRepository<Match, String> {

    @Query("SELECT m FROM Match m WHERE (m.player1 = :user OR m.player2 = :user) AND m.status = 'FINISHED' ORDER BY m.createdAt DESC")
    List<Match> findRecentMatchesByUser(@Param("user") User user);

    @Query("SELECT m FROM Match m WHERE m.status = 'WAITING' AND m.mode = 'RANKED' AND m.gameSlug = :gameSlug AND m.player1 != :user")
    List<Match> findOpenRankedMatches(@Param("gameSlug") String gameSlug, @Param("user") User user);
}
