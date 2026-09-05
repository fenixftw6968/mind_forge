package com.mindmaze.service;

import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;

import static org.junit.jupiter.api.Assertions.*;

public class EloRatingServiceTest {

    private EloRatingService eloRatingService;

    @BeforeEach
    void setUp() {
        eloRatingService = new EloRatingService();
    }

    @Test
    void testEqualRatingWin() {
        // Equal ratings: win should award +16 points, loss -16 points
        EloRatingService.EloResult result = eloRatingService.calculateNewRatings(500, 500, 1.0);
        assertEquals(516, result.getNewRatingA());
        assertEquals(484, result.getNewRatingB());
        assertEquals(16, result.getDeltaA());
        assertEquals(-16, result.getDeltaB());
    }

    @Test
    void testHigherBeatingLower() {
        // Higher rated beating lower: smaller gain
        EloRatingService.EloResult result = eloRatingService.calculateNewRatings(800, 400, 1.0);
        assertTrue(result.getDeltaA() < 16, "High rated beating low rated player should yield small gain");
        assertTrue(result.getDeltaA() >= 1, "Gain should be at least 1 point");
    }

    @Test
    void testLowerBeatingHigher() {
        // Lower rated player beating higher: large gain
        EloRatingService.EloResult result = eloRatingService.calculateNewRatings(400, 800, 1.0);
        assertTrue(result.getDeltaA() > 16, "Underdog winning should yield large rating gain");
    }

    @Test
    void testFloorAtZero() {
        // Ensure rating does not drop below 0
        EloRatingService.EloResult result = eloRatingService.calculateNewRatings(5, 5, 0.0);
        assertEquals(0, result.getNewRatingA());
        assertTrue(result.getNewRatingA() >= 0);
    }
}
