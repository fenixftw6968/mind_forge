package com.mindmaze.service;

import org.springframework.stereotype.Service;

@Service
public class EloRatingService {

    public static final int K_FACTOR = 32;

    public static class EloResult {
        private final int newRatingA;
        private final int newRatingB;
        private final int deltaA;
        private final int deltaB;

        public EloResult(int newRatingA, int newRatingB, int deltaA, int deltaB) {
            this.newRatingA = newRatingA;
            this.newRatingB = newRatingB;
            this.deltaA = deltaA;
            this.deltaB = deltaB;
        }

        public int getNewRatingA() { return newRatingA; }
        public int getNewRatingB() { return newRatingB; }
        public int getDeltaA() { return deltaA; }
        public int getDeltaB() { return deltaB; }
    }

    /**
     * Calculates updated Elo ratings.
     * @param ratingA Current rating of player A
     * @param ratingB Current rating of player B
     * @param actualScoreA 1.0 if A wins, 0.0 if B wins (A loses), 0.5 for draw
     * @return EloResult with updated ratings and deltas
     */
    public EloResult calculateNewRatings(int ratingA, int ratingB, double actualScoreA) {
        // Expected score for player A
        double expectedA = 1.0 / (1.0 + Math.pow(10.0, (double) (ratingB - ratingA) / 400.0));
        // Expected score for player B
        double expectedB = 1.0 - expectedA;
        double actualScoreB = 1.0 - actualScoreA;

        int deltaA = (int) Math.round(K_FACTOR * (actualScoreA - expectedA));
        int deltaB = (int) Math.round(K_FACTOR * (actualScoreB - expectedB));

        // In case of win, assure at least +1 gain (or at least reasonable min gain) unless already capped
        if (actualScoreA == 1.0 && deltaA <= 0) deltaA = 1;
        if (actualScoreB == 1.0 && deltaB <= 0) deltaB = 1;

        int newRatingA = Math.max(0, ratingA + deltaA);
        int newRatingB = Math.max(0, ratingB + deltaB);

        // Recompute actual delta if clamped at 0
        deltaA = newRatingA - ratingA;
        deltaB = newRatingB - ratingB;

        return new EloResult(newRatingA, newRatingB, deltaA, deltaB);
    }
}
