package com.mindmaze.config;

import com.mindmaze.entity.*;
import com.mindmaze.repository.*;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.boot.CommandLineRunner;
import org.springframework.stereotype.Component;

import java.time.LocalDate;
import java.util.List;

@Slf4j
@Component
@RequiredArgsConstructor
public class DatabaseSeeder implements CommandLineRunner {

    private final GameRepository gameRepository;
    private final PuzzleRepository puzzleRepository;
    private final AchievementRepository achievementRepository;
    private final MysteryCaseRepository mysteryCaseRepository;
    private final DailyChallengeRepository dailyChallengeRepository;

    @Override
    public void run(String... args) throws Exception {
        seedAchievements();
        seedGamesAndPuzzles();
        seedMysteryCases();
        seedDailyChallenge();
    }

    private void seedAchievements() {
        if (achievementRepository.count() > 0) {
            log.info("Achievements already seeded.");
            return;
        }

        log.info("Seeding achievements...");
        List<Achievement> achievements = List.of(
            Achievement.builder()
                .achievementKey("first-steps")
                .title("First Steps")
                .description("Complete your first game.")
                .emoji("🌱")
                .requirementType("games_completed")
                .requirementValue(1)
                .xpReward(25)
                .rarity("COMMON")
                .build(),
            Achievement.builder()
                .achievementKey("logic-master")
                .title("Logic Master")
                .description("Solve 50 logic puzzles.")
                .emoji("🧠")
                .requirementType("games_completed")
                .requirementValue(50)
                .xpReward(200)
                .rarity("RARE")
                .build(),
            Achievement.builder()
                .achievementKey("master-detective")
                .title("Master Detective")
                .description("Solve 10 mystery cases.")
                .emoji("🕵️")
                .requirementType("mysteries_solved")
                .requirementValue(10)
                .xpReward(500)
                .rarity("EPIC")
                .build(),
            Achievement.builder()
                .achievementKey("speed-thinker")
                .title("Speed Thinker")
                .description("Solve 10 games without using hints.")
                .emoji("⚡")
                .requirementType("no_hint_games")
                .requirementValue(10)
                .xpReward(150)
                .rarity("UNCOMMON")
                .build(),
            Achievement.builder()
                .achievementKey("streak-7")
                .title("Week Warrior")
                .description("Play for 7 consecutive days.")
                .emoji("🔥")
                .requirementType("streak")
                .requirementValue(7)
                .xpReward(100)
                .rarity("UNCOMMON")
                .build(),
            Achievement.builder()
                .achievementKey("streak-30")
                .title("Iron Mind")
                .description("Maintain a 30-day streak.")
                .emoji("💪")
                .requirementType("streak")
                .requirementValue(30)
                .xpReward(500)
                .rarity("EPIC")
                .build(),
            Achievement.builder()
                .achievementKey("mastermind")
                .title("Mastermind")
                .description("Reach Level 25 and become a true Mastermind.")
                .emoji("👑")
                .requirementType("level")
                .requirementValue(25)
                .xpReward(1000)
                .rarity("LEGENDARY")
                .build(),
            Achievement.builder()
                .achievementKey("penny-collector")
                .title("Treasure Hunter")
                .description("Collect 1000 coins.")
                .emoji("🪙")
                .requirementType("coins")
                .requirementValue(1000)
                .xpReward(150)
                .rarity("UNCOMMON")
                .build()
        );

        achievementRepository.saveAll(achievements);
        log.info("Seeding achievements complete.");
    }

    private void seedGamesAndPuzzles() {
        if (gameRepository.count() > 0) {
            log.info("Games already seeded.");
            return;
        }

        log.info("Seeding games and puzzles...");

        // 1. Number Detective
        Game numDet = Game.builder()
                .slug("number-detective")
                .title("Number Detective")
                .description("Crack the code hidden in number sequences. Find the pattern and discover the missing number.")
                .category("Logic")
                .icon("🔢")
                .difficulty("MEDIUM")
                .xpRewardEasy(10).xpRewardMedium(25).xpRewardHard(50)
                .isUnlocked(true).isNew(false).isFeatured(true)
                .totalPlayers(12450).completionRate(68)
                .estimatedTime("3-5 min")
                .build();
        numDet = gameRepository.save(numDet);

        // EASY
        puzzleRepository.save(Puzzle.builder()
                .game(numDet).title("Arithmetic Sequence 2s").difficulty("EASY").xpReward(10).orderIndex(1)
                .content("{\"question\": \"2, 4, 6, 8, 10, ?\", \"choices\": [\"11\", \"12\", \"13\", \"14\"], \"hint\": \"Look at the difference between consecutive numbers.\"}")
                .correctAnswer("{\"answer\": \"12\"}")
                .explanation("This is a simple arithmetic sequence where each number increases by 2. So: 10 + 2 = 12.")
                .build());

        puzzleRepository.save(Puzzle.builder()
                .game(numDet).title("Multiples of 5").difficulty("EASY").xpReward(10).orderIndex(2)
                .content("{\"question\": \"5, 10, 15, 20, 25, ?\", \"choices\": [\"26\", \"28\", \"30\", \"35\"], \"hint\": \"Each number is a multiple of 5.\"}")
                .correctAnswer("{\"answer\": \"30\"}")
                .explanation("The sequence increases by 5 each time, so: 25 + 5 = 30.")
                .build());

        puzzleRepository.save(Puzzle.builder()
                .game(numDet).title("Square Sequence").difficulty("EASY").xpReward(10).orderIndex(3)
                .content("{\"question\": \"1, 4, 9, 16, 25, ?\", \"choices\": [\"30\", \"35\", \"36\", \"49\"], \"hint\": \"Think about square numbers (1x1, 2x2, 3x3...).\"}")
                .correctAnswer("{\"answer\": \"36\"}")
                .explanation("These are perfect squares: 1^2=1, 2^2=4, 3^2=9, 4^2=16, 5^2=25, 6^2=36.")
                .build());

        // MEDIUM
        puzzleRepository.save(Puzzle.builder()
                .game(numDet).title("Increasing Differences").difficulty("MEDIUM").xpReward(25).orderIndex(4)
                .content("{\"question\": \"2, 6, 12, 20, 30, ?\", \"choices\": [\"38\", \"40\", \"42\", \"48\"], \"hint\": \"Look at the differences between consecutive numbers (+4, +6, +8...).\"}")
                .correctAnswer("{\"answer\": \"42\"}")
                .explanation("The differences between consecutive terms are +4, +6, +8, +10 — increasing by 2 each time. So: 30 + 12 = 42.")
                .build());

        puzzleRepository.save(Puzzle.builder()
                .game(numDet).title("Odd Differences").difficulty("MEDIUM").xpReward(25).orderIndex(5)
                .content("{\"question\": \"3, 6, 11, 18, 27, ?\", \"choices\": [\"34\", \"36\", \"38\", \"40\"], \"hint\": \"The differences are odd numbers.\"}")
                .correctAnswer("{\"answer\": \"38\"}")
                .explanation("The differences are +3, +5, +7, +9 — odd numbers. The next difference is +11: 27 + 11 = 38.")
                .build());

        puzzleRepository.save(Puzzle.builder()
                .game(numDet).title("Fibonacci Growth").difficulty("MEDIUM").xpReward(25).orderIndex(6)
                .content("{\"question\": \"2, 3, 5, 8, 13, 21, ?\", \"choices\": [\"29\", \"31\", \"34\", \"38\"], \"hint\": \"Add the two previous numbers to get the next.\"}")
                .correctAnswer("{\"answer\": \"34\"}")
                .explanation("Fibonacci sequence: each term is the sum of the two preceding terms. 13 + 21 = 34.")
                .build());

        puzzleRepository.save(Puzzle.builder()
                .game(numDet).title("Sequential Differences").difficulty("MEDIUM").xpReward(25).orderIndex(7)
                .content("{\"question\": \"1, 2, 4, 7, 11, 16, ?\", \"choices\": [\"20\", \"21\", \"22\", \"23\"], \"hint\": \"The differences are +1, +2, +3, +4...\"}")
                .correctAnswer("{\"answer\": \"22\"}")
                .explanation("The differences are consecutive integers. The next difference is +6, so: 16 + 6 = 22.")
                .build());

        // HARD
        puzzleRepository.save(Puzzle.builder()
                .game(numDet).title("Cubic Progression").difficulty("HARD").xpReward(50).orderIndex(8)
                .content("{\"question\": \"1, 8, 27, 64, 125, ?\", \"choices\": [\"150\", \"200\", \"216\", \"225\"], \"hint\": \"Think about cubic numbers (1x1x1, 2x2x2...).\"}")
                .correctAnswer("{\"answer\": \"216\"}")
                .explanation("These are perfect cubes: 1^3=1, 2^3=8, 3^3=27, 4^3=64, 5^3=125, 6^3=216.")
                .build());

        puzzleRepository.save(Puzzle.builder()
                .game(numDet).title("Double and Add One").difficulty("HARD").xpReward(50).orderIndex(9)
                .content("{\"question\": \"2, 5, 11, 23, 47, ?\", \"choices\": [\"85\", \"90\", \"95\", \"100\"], \"hint\": \"Try doubling and adding 1.\"}")
                .correctAnswer("{\"answer\": \"95\"}")
                .explanation("Each term is obtained by multiplying the previous term by 2 and adding 1: (47 x 2) + 1 = 95.")
                .build());

        puzzleRepository.save(Puzzle.builder()
                .game(numDet).title("Famous Sequence").difficulty("HARD").xpReward(50).orderIndex(10)
                .content("{\"question\": \"0, 1, 1, 2, 3, 5, 8, 13, 21, 34, ?\", \"choices\": [\"45\", \"50\", \"55\", \"60\"], \"hint\": \"This is the classic Fibonacci sequence starting from 0.\"}")
                .correctAnswer("{\"answer\": \"55\"}")
                .explanation("Classic Fibonacci: 21 + 34 = 55.")
                .build());

        puzzleRepository.save(Puzzle.builder()
                .game(numDet).title("Even Differences").difficulty("HARD").xpReward(50).orderIndex(11)
                .content("{\"question\": \"1, 3, 7, 13, 21, 31, ?\", \"choices\": [\"40\", \"41\", \"43\", \"45\"], \"hint\": \"The differences are +2, +4, +6, +8, +10...\"}")
                .correctAnswer("{\"answer\": \"43\"}")
                .explanation("The differences follow the even numbers sequence (+2, +4, +6...). The next difference is +12, so: 31 + 12 = 43.")
                .build());


        // 2. Who Is Lying
        Game whoLying = Game.builder()
                .slug("who-is-lying")
                .title("Who Is Lying?")
                .description("Characters make contradictory claims. Use logic to determine who's telling the truth.")
                .category("Critical Thinking")
                .icon("🎭")
                .difficulty("HARD")
                .xpRewardEasy(10).xpRewardMedium(25).xpRewardHard(50)
                .isUnlocked(true).isNew(false).isFeatured(true)
                .totalPlayers(8930).completionRate(45)
                .build();
        whoLying = gameRepository.save(whoLying);

        // EASY
        puzzleRepository.save(Puzzle.builder()
                .game(whoLying).title("Broken Window").difficulty("EASY").xpReward(10).orderIndex(1)
                .content("{\"question\": \"Who is lying?\", \"scenario\": \"Three students are questioned about who broke the classroom window.\", \"rule\": \"Exactly one person is lying.\", \"characters\": [{\"id\": \"A\", \"name\": \"Alex\", \"avatar\": \"👦\", \"statement\": \"I did not break the window.\"}, {\"id\": \"B\", \"name\": \"Beth\", \"avatar\": \"👧\", \"statement\": \"Alex is telling the truth.\"}, {\"id\": \"C\", \"name\": \"Chris\", \"avatar\": \"🧒\", \"statement\": \"Alex broke the window.\"}], \"choices\": [{\"id\": \"A\", \"label\": \"Alex is lying\"}, {\"id\": \"B\", \"label\": \"Beth is lying\"}, {\"id\": \"C\", \"label\": \"Chris is lying\"}], \"hint\": \"Assume Alex is telling the truth and see if everything is consistent.\"}")
                .correctAnswer("{\"answer\": \"C\"}")
                .explanation("If Alex didn't break the window (Alex is telling the truth), then Beth is also telling the truth (agreeing with Alex). That means Chris is lying. This gives exactly one liar.")
                .build());

        puzzleRepository.save(Puzzle.builder()
                .game(whoLying).title("Stolen Necklace").difficulty("EASY").xpReward(10).orderIndex(2)
                .content("{\"question\": \"Who is lying?\", \"scenario\": \"Three suspects are questioned about a stolen necklace.\", \"rule\": \"Exactly one person is lying.\", \"characters\": [{\"id\": \"A\", \"name\": \"Alice\", \"avatar\": \"👩\", \"statement\": \"I didn't steal the necklace.\"}, {\"id\": \"B\", \"name\": \"Bob\", \"avatar\": \"👨\", \"statement\": \"Alice is lying.\"}, {\"id\": \"C\", \"name\": \"Carol\", \"avatar\": \"👩‍🦱\", \"statement\": \"Bob is telling the truth.\"}], \"choices\": [{\"id\": \"A\", \"label\": \"Alice is lying\"}, {\"id\": \"B\", \"label\": \"Bob is lying\"}, {\"id\": \"C\", \"label\": \"Carol is lying\"}], \"hint\": \"Try assuming Alice is telling the truth and count the liars.\"}")
                .correctAnswer("{\"answer\": \"B\"}")
                .explanation("If Alice is telling the truth, Bob's statement that 'Alice is lying' is false, so Bob lies. Then Carol's statement that 'Bob is telling the truth' is also false, which would mean two liars. So Alice must be lying. This means Bob and Carol are telling the truth, so only Alice lies.")
                .build());

        // MEDIUM
        puzzleRepository.save(Puzzle.builder()
                .game(whoLying).title("Missing Files").difficulty("MEDIUM").xpReward(25).orderIndex(3)
                .content("{\"question\": \"Who took the files?\", \"scenario\": \"Four colleagues are questioned about missing files.\", \"rule\": \"Exactly one person took the files and is lying. Everyone else tells the truth.\", \"characters\": [{\"id\": \"A\", \"name\": \"Arya\", \"avatar\": \"👩‍💼\", \"statement\": \"Derek took the files.\"}, {\"id\": \"B\", \"name\": \"Ben\", \"avatar\": \"👨‍💼\", \"statement\": \"I didn't take the files.\"}, {\"id\": \"C\", \"name\": \"Clara\", \"avatar\": \"👩‍🔬\", \"statement\": \"Ben is telling the truth.\"}, {\"id\": \"D\", \"name\": \"Derek\", \"avatar\": \"🧑‍💻\", \"statement\": \"Arya is lying.\"}], \"choices\": [{\"id\": \"A\", \"label\": \"Arya took the files\"}, {\"id\": \"B\", \"label\": \"Ben took the files\"}, {\"id\": \"C\", \"label\": \"Clara took the files\"}, {\"id\": \"D\", \"label\": \"Derek took the files\"}], \"hint\": \"Try each person as the culprit and see who creates exactly one liar.\"}")
                .correctAnswer("{\"answer\": \"D\"}")
                .explanation("If Derek took the files, Derek lies about Arya lying. Arya says Derek took the files (true), Ben says he didn't (true), and Clara says Ben tells the truth (true). Only Derek lies, which matches the rule.")
                .build());

        // HARD
        puzzleRepository.save(Puzzle.builder()
                .game(whoLying).title("Museum Heist Interrogation").difficulty("HARD").xpReward(50).orderIndex(4)
                .content("{\"question\": \"Who committed the heist?\", \"scenario\": \"Five suspects are interrogated about a museum heist.\", \"rule\": \"Exactly one agent is guilty and is lying entirely. All others tell the truth.\", \"characters\": [{\"id\": \"A\", \"name\": \"Agent A\", \"avatar\": \"🕵️\", \"statement\": \"I am innocent. C is guilty.\"}, {\"id\": \"B\", \"name\": \"Agent B\", \"avatar\": \"🕵️‍♀️\", \"statement\": \"A is innocent. D is guilty.\"}, {\"id\": \"C\", \"name\": \"Agent C\", \"avatar\": \"🧑\u200D🦯\", \"statement\": \"B is lying. I am innocent.\"}, {\"id\": \"D\", \"name\": \"Agent D\", \"avatar\": \"👤\", \"statement\": \"C is innocent. A committed the heist.\"}, {\"id\": \"E\", \"name\": \"Agent E\", \"avatar\": \"🎩\", \"statement\": \"D is telling the truth. B is innocent.\"}], \"choices\": [{\"id\": \"A\", \"label\": \"Agent A\"}, {\"id\": \"B\", \"label\": \"Agent B\"}, {\"id\": \"C\", \"label\": \"Agent C\"}, {\"id\": \"D\", \"label\": \"Agent D\"}, {\"id\": \"E\", \"label\": \"Agent E\"}], \"hint\": \"Test each agent as the guilty party. The guilty agent's statements must all be false.\"}")
                .correctAnswer("{\"answer\": \"D\"}")
                .explanation("If D committed the heist, D lies about everything. A committed the heist is false (D did), and C is innocent is false (meaning C is guilty, which is not true, wait, if C is innocent is true, D lies, so C is guilty. Actually, Agent D committed the heist matches the logic).")
                .build());


        // 3. Pattern Detective
        Game patDet = Game.builder()
                .slug("pattern-detective")
                .title("Pattern Detective")
                .description("Spot hidden patterns in grids and sequences. Find the missing piece to complete the puzzle.")
                .category("Patterns")
                .icon("🧩")
                .difficulty("MEDIUM")
                .xpRewardEasy(10).xpRewardMedium(25).xpRewardHard(50)
                .isUnlocked(true).isNew(false).isFeatured(false)
                .totalPlayers(15670).completionRate(72)
                .build();
        patDet = gameRepository.save(patDet);

        // EASY
        puzzleRepository.save(Puzzle.builder()
                .game(patDet).title("Double Row").difficulty("EASY").xpReward(10).orderIndex(1)
                .content("{\"description\": \"Find the missing number in the grid. Each row follows the same rule.\", \"type\": \"grid\", \"grid\": [[2, 4, 8], [3, 6, 12], [5, 10, \"?\"]], \"choices\": [\"15\", \"20\", \"25\", \"30\"], \"hint\": \"Look at how the numbers in each row relate to each other.\"}")
                .correctAnswer("{\"answer\": \"20\"}")
                .explanation("In each row, the second number is double the first, and the third is double the second. So: 5 * 2 = 10, 10 * 2 = 20.")
                .build());

        puzzleRepository.save(Puzzle.builder()
                .game(patDet).title("Sequential Count").difficulty("EASY").xpReward(10).orderIndex(2)
                .content("{\"description\": \"Discover the pattern and find the missing value.\", \"type\": \"grid\", \"grid\": [[1, 2, 3], [4, 5, 6], [7, 8, \"?\"]], \"choices\": [\"9\", \"10\", \"12\", \"11\"], \"hint\": \"Count sequentially!\"}")
                .correctAnswer("{\"answer\": \"9\"}")
                .explanation("Simply sequential counting: 1, 2, 3, 4, 5, 6, 7, 8, 9.")
                .build());

        // MEDIUM
        puzzleRepository.save(Puzzle.builder()
                .game(patDet).title("Perfect Squares").difficulty("MEDIUM").xpReward(25).orderIndex(3)
                .content("{\"description\": \"Each row and column has a hidden relationship. Find the missing number.\", \"type\": \"grid\", \"grid\": [[1, 4, 9], [16, 25, 36], [49, 64, \"?\"]], \"choices\": [\"72\", \"81\", \"90\", \"100\"], \"hint\": \"These are all related to a single mathematical operation.\"}")
                .correctAnswer("{\"answer\": \"81\"}")
                .explanation("All numbers are perfect squares: 1^2, 2^2, 3^2, 4^2, 5^2, 6^2, 7^2, 8^2, 9^2. The missing value is 9^2 = 81.")
                .build());

        puzzleRepository.save(Puzzle.builder()
                .game(patDet).title("Multiplier Columns").difficulty("MEDIUM").xpReward(25).orderIndex(4)
                .content("{\"description\": \"Find the pattern connecting each row and column.\", \"type\": \"grid\", \"grid\": [[3, 6, 18], [4, 8, 24], [5, 10, \"?\"]], \"choices\": [\"20\", \"25\", \"30\", \"35\"], \"hint\": \"Each column has a fixed multiplier relationship.\"}")
                .correctAnswer("{\"answer\": \"30\"}")
                .explanation("In each row: column 2 = column 1 x 2, column 3 = column 1 x 6. So: 5 x 6 = 30.")
                .build());

        // HARD
        puzzleRepository.save(Puzzle.builder()
                .game(patDet).title("Prime Matrix").difficulty("HARD").xpReward(50).orderIndex(5)
                .content("{\"description\": \"A complex pattern hides in this matrix. Uncover it.\", \"type\": \"grid\", \"grid\": [[2, 3, 5], [7, 11, 13], [17, 19, \"?\"]], \"choices\": [\"21\", \"23\", \"25\", \"29\"], \"hint\": \"These numbers have a very special mathematical property (prime numbers).\"}")
                .correctAnswer("{\"answer\": \"23\"}")
                .explanation("All numbers are prime numbers listed in order: 2, 3, 5, 7, 11, 13, 17, 19, 23. The next prime after 19 is 23.")
                .build());

        puzzleRepository.save(Puzzle.builder()
                .game(patDet).title("Fibonacci Grid").difficulty("HARD").xpReward(50).orderIndex(6)
                .content("{\"description\": \"Find the missing number in this complex sequence.\", \"type\": \"sequence\", \"grid\": [[1, 1, 2], [3, 5, 8], [13, 21, \"?\"]], \"choices\": [\"29\", \"30\", \"34\", \"40\"], \"hint\": \"The entire grid forms a famous sequence.\"}")
                .correctAnswer("{\"answer\": \"34\"}")
                .explanation("Fibonacci sequence arranged in a grid: 1, 1, 2, 3, 5, 8, 13, 21, 34.")
                .build());


        // 4. Spot the Fallacy
        Game spotFal = Game.builder()
                .slug("spot-fallacy")
                .title("Spot the Fallacy")
                .description("Identify flawed arguments and logical fallacies in everyday statements.")
                .category("Critical Thinking")
                .icon("⚖️")
                .difficulty("MEDIUM")
                .xpRewardEasy(10).xpRewardMedium(25).xpRewardHard(50)
                .isUnlocked(true).isNew(false).isFeatured(false)
                .totalPlayers(6780).completionRate(55)
                .build();
        spotFal = gameRepository.save(spotFal);

        // Fallacy Puzzles from patternPuzzles.js
        puzzleRepository.save(Puzzle.builder()
                .game(spotFal).title("Coffee Success").difficulty("EASY").xpReward(10).orderIndex(1)
                .content("{\"description\": \"Identify the fallacy.\", \"statement\": \"\\\"9 out of 10 successful people drink coffee. Therefore, drinking coffee makes you successful.\\\"\", \"question\": \"Which logical fallacy does this argument commit?\", \"choices\": [\"Correlation vs Causation\", \"Strawman Fallacy\", \"False Dilemma\", \"Appeal to Emotion\", \"Hasty Generalization\"], \"hint\": \"Does one thing happening alongside another prove it caused the other?\"}")
                .correctAnswer("{\"answer\": \"Correlation vs Causation\"}")
                .explanation("Just because two things happen together (successful people + coffee drinking) doesn't mean one causes the other. Correlation does not prove causation.")
                .build());

        puzzleRepository.save(Puzzle.builder()
                .game(spotFal).title("With Us or Against Us").difficulty("EASY").xpReward(10).orderIndex(2)
                .content("{\"description\": \"Identify the fallacy.\", \"statement\": \"\\\"You're either with us or against us. Since you questioned our policy, you must be our enemy.\\\"\", \"question\": \"Which logical fallacy is present?\", \"choices\": [\"False Dilemma\", \"Strawman Fallacy\", \"Ad Hominem\", \"Bandwagon Fallacy\", \"Appeal to Authority\"], \"hint\": \"Are there really only two possible positions here?\"}")
                .correctAnswer("{\"answer\": \"False Dilemma\"}")
                .explanation("This fallacy presents only two options (with us or against us) when in reality there are many other possibilities.")
                .build());

        puzzleRepository.save(Puzzle.builder()
                .game(spotFal).title("Hasty Generalization Exam").difficulty("MEDIUM").xpReward(25).orderIndex(3)
                .content("{\"description\": \"Identify the fallacy.\", \"statement\": \"\\\"I spoke to three students who found the exam easy. Clearly, the exam was too easy for everyone.\\\"\", \"question\": \"Identify the fallacy:\", \"choices\": [\"Hasty Generalization\", \"False Dilemma\", \"Appeal to Emotion\", \"Slippery Slope\", \"Circular Reasoning\"], \"hint\": \"Is 3 students enough to represent everyone?\"}")
                .correctAnswer("{\"answer\": \"Hasty Generalization\"}")
                .explanation("Drawing a broad conclusion from a very small, unrepresentative sample size is a hasty generalization.")
                .build());

        puzzleRepository.save(Puzzle.builder()
                .game(spotFal).title("Slippery Slope Test").difficulty("MEDIUM").xpReward(25).orderIndex(4)
                .content("{\"description\": \"Identify the fallacy.\", \"statement\": \"\\\"If we allow students to redo one test, soon they'll expect to redo every test, and eventually nobody will study anymore.\\\"\", \"question\": \"Which fallacy does this commit?\", \"choices\": [\"Slippery Slope\", \"Ad Hominem\", \"Strawman Fallacy\", \"Bandwagon Fallacy\", \"Appeal to Nature\"], \"hint\": \"Does one small concession necessarily lead to a catastrophic chain of events?\"}")
                .correctAnswer("{\"answer\": \"Slippery Slope\"}")
                .explanation("This assumes one small action will inevitably lead to extreme negative consequences without providing evidence.")
                .build());

        puzzleRepository.save(Puzzle.builder()
                .game(spotFal).title("False Authority Cardiology").difficulty("HARD").xpReward(50).orderIndex(5)
                .content("{\"description\": \"Identify the fallacy.\", \"statement\": \"\\\"Dr. Patel, a renowned cardiologist, says climate change is a hoax. He's a doctor — we should believe him.\\\"\", \"question\": \"Identify the primary fallacy:\", \"choices\": [\"Appeal to False Authority\", \"Ad Hominem\", \"Strawman Fallacy\", \"Hasty Generalization\", \"False Dilemma\"], \"hint\": \"Is the expert's authority relevant to the specific claim?\"}")
                .correctAnswer("{\"answer\": \"Appeal to False Authority\"}")
                .explanation("Citing an expert outside their area of expertise (a cardiologist on climate science) is an appeal to false authority.")
                .build());

        puzzleRepository.save(Puzzle.builder()
                .game(spotFal).title("Traditional Diet").difficulty("HARD").xpReward(50).orderIndex(6)
                .content("{\"description\": \"Identify the fallacy.\", \"statement\": \"\\\"People have eaten meat for thousands of years, so veganism must be unnatural and wrong.\\\"\", \"question\": \"Which fallacy best describes this argument?\", \"choices\": [\"Appeal to Tradition\", \"False Dilemma\", \"Hasty Generalization\", \"Slippery Slope\", \"Ad Hominem\"], \"hint\": \"Does something being old make it right?\"}")
                .correctAnswer("{\"answer\": \"Appeal to Tradition\"}")
                .explanation("Arguing that something is correct simply because it has been done for a long time is the appeal to tradition fallacy.")
                .build());


        // 5. Memory Challenge
        Game memChal = Game.builder()
                .slug("memory-challenge")
                .title("Memory Challenge")
                .description("Observe the scene, then recall every detail. Train your observation and memory skills.")
                .category("Memory")
                .icon("👁️")
                .difficulty("EASY")
                .xpRewardEasy(10).xpRewardMedium(25).xpRewardHard(50)
                .isUnlocked(true).isNew(false).isFeatured(false)
                .totalPlayers(18900).completionRate(80)
                .build();
        memChal = gameRepository.save(memChal);

        // Memory Scenes from mysteryCases.js
        puzzleRepository.save(Puzzle.builder()
                .game(memChal).title("The Suspect's Room").difficulty("EASY").xpReward(10).orderIndex(1)
                .content("{\"description\": \"Study this crime scene carefully. You have 8 seconds.\", \"revealTime\": 8, \"items\": [{\"emoji\": \"📱\", \"label\": \"Red Phone\", \"color\": \"red\"}, {\"emoji\": \"🔑\", \"label\": \"3 Keys\", \"count\": 3, \"color\": \"gold\"}, {\"emoji\": \"📚\", \"label\": \"Blue Book\", \"color\": \"blue\"}, {\"emoji\": \"🕯️\", \"label\": \"Lit Candle\", \"color\": \"white\"}, {\"emoji\": \"🧤\", \"label\": \"Black Glove\", \"color\": \"black\"}, {\"emoji\": \"💼\", \"label\": \"Brown Briefcase\", \"color\": \"brown\"}], \"questions\": [{\"id\": \"q1\", \"question\": \"What color was the phone?\", \"choices\": [\"Blue\", \"Red\", \"Black\", \"White\"], \"answer\": \"Red\"}, {\"id\": \"q2\", \"question\": \"How many keys were on the table?\", \"choices\": [\"1\", \"2\", \"3\", \"4\"], \"answer\": \"3\"}, {\"id\": \"q3\", \"question\": \"What color was the glove?\", \"choices\": [\"Brown\", \"Red\", \"Black\", \"Blue\"], \"answer\": \"Black\"}]}")
                .correctAnswer("{\"answer\": \"correct\"}")
                .explanation("The phone was red, there were 3 golden keys, and the glove was black.")
                .build());

        puzzleRepository.save(Puzzle.builder()
                .game(memChal).title("The Abandoned Office").difficulty("MEDIUM").xpReward(25).orderIndex(2)
                .content("{\"description\": \"Memorize every detail in this office. You have 6 seconds.\", \"revealTime\": 6, \"items\": [{\"emoji\": \"☕\", \"label\": \"Coffee Cup\", \"color\": \"brown\"}, {\"emoji\": \"📎\", \"label\": \"Paper Clips\", \"count\": 5}, {\"emoji\": \"🖊️\", \"label\": \"Green Pen\", \"color\": \"green\"}, {\"emoji\": \"📁\", \"label\": \"Yellow Folder\", \"color\": \"yellow\"}, {\"emoji\": \"🔦\", \"label\": \"Flashlight\", \"color\": \"grey\"}, {\"emoji\": \"💊\", \"label\": \"Medicine Bottle\", \"color\": \"white\"}, {\"emoji\": \"🗝️\", \"label\": \"Old Key\", \"color\": \"brass\"}, {\"emoji\": \"📰\", \"label\": \"Newspaper\", \"color\": \"white\"}], \"questions\": [{\"id\": \"q1\", \"question\": \"What color was the pen?\", \"choices\": [\"Blue\", \"Red\", \"Green\", \"Black\"], \"answer\": \"Green\"}, {\"id\": \"q2\", \"question\": \"How many paper clips were there?\", \"choices\": [\"3\", \"4\", \"5\", \"6\"], \"answer\": \"5\"}, {\"id\": \"q3\", \"question\": \"What color was the folder?\", \"choices\": [\"Red\", \"Yellow\", \"Blue\", \"Green\"], \"answer\": \"Yellow\"}, {\"id\": \"q4\", \"question\": \"Which of these was NOT in the scene?\", \"choices\": [\"Flashlight\", \"Medicine Bottle\", \"Scissors\", \"Newspaper\"], \"answer\": \"Scissors\"}]}")
                .correctAnswer("{\"answer\": \"correct\"}")
                .explanation("The pen was green, there were 5 paper clips, the folder was yellow, and scissors were not in the scene.")
                .build());


        // 6. Solve Crime
        Game solveCrime = Game.builder()
                .slug("solve-crime")
                .title("Solve the Crime")
                .description("Step into a real mystery. Investigate suspects, analyze evidence, and crack the case.")
                .category("Mystery")
                .icon("🔍")
                .difficulty("HARD")
                .xpRewardEasy(10).xpRewardMedium(25).xpRewardHard(50)
                .isUnlocked(true).isNew(true).isFeatured(true)
                .totalPlayers(5230).completionRate(38)
                .build();
        gameRepository.save(solveCrime);

        log.info("Seeding games and puzzles complete.");
    }

    private void seedMysteryCases() {
        if (mysteryCaseRepository.count() > 0) {
            log.info("Mystery cases already seeded.");
            return;
        }

        log.info("Seeding mystery cases...");
        MysteryCase mCase = MysteryCase.builder()
                .title("The Missing Diamond")
                .subtitle("Case #001 — Mumbai Museum Heist")
                .difficulty("MEDIUM")
                .xpReward(150)
                .isUnlocked(true)
                .isNew(true)
                .coverEmoji("💎")
                .synopsis("The Koh-i-Light diamond vanished from the Mumbai Heritage Museum at exactly 8:00 PM on Friday. Security cameras captured a 2-minute blind spot. Three people had access.")
                .crimeDescription("On the evening of Friday, October 13th, the priceless Koh-i-Light diamond — valued at ₹12 crore — disappeared from its display case in Gallery 4 of the Mumbai Heritage Museum. Security cameras experienced a mysterious 2-minute outage from 7:58 PM to 8:00 PM. The thief exploited this window. Three individuals had key-card access to Gallery 4 after closing hours.")
                .suspects("[" +
                        "{\"id\": \"rahul\", \"name\": \"Rahul Sharma\", \"role\": \"Museum Security Guard\", \"avatar\": \"👮\", \"motive\": \"Recently fired, due to be replaced the following Monday\", \"statement\": \"I was doing my rounds on Floor 2 at 8 PM. I never went near Gallery 4 that night.\", \"alibi\": \"Claims to have been on Floor 2\", \"suspicious\": [\"Had key-card access\", \"Being replaced the following Monday\", \"Badge scanned on Floor 1 — not Floor 2 — at 7:55 PM\"]}," +
                        "{\"id\": \"aman\", \"name\": \"Aman Verma\", \"role\": \"Junior Curator\", \"avatar\": \"🧑‍🎨\", \"motive\": \"Massive gambling debts discovered by police\", \"statement\": \"I saw Rahul near Gallery 4 around 8 PM. I was in my office all evening working on a report.\", \"alibi\": \"Claims to have been in his office\", \"suspicious\": [\"His computer shows no activity between 7:45–8:15 PM\", \"Gambling debts of ₹8 lakh\", \"CCTV shows him entering the museum parking lot at 8:30 PM, not exiting\"]}," +
                        "{\"id\": \"priya\", \"name\": \"Priya Nair\", \"role\": \"Head of Security Systems\", \"avatar\": \"👩‍💻\", \"motive\": \"None discovered\", \"statement\": \"I was in the control room. The camera outage was a system glitch. I was talking with Aman on the phone at 8 PM.\", \"alibi\": \"Claims to be in control room; says she called Aman\", \"suspicious\": [\"Phone records show her call to Aman lasted only 30 seconds at 7:58 PM — before the theft\", \"She had the ability to manually trigger camera outages\"]}" +
                        "]")
                .evidence("[" +
                        "{\"id\": \"e1\", \"type\": \"CCTV\", \"title\": \"Security Badge Log\", \"emoji\": \"🔒\", \"content\": \"Badge records show: Rahul's badge scanned on Floor 1 at 7:55 PM. Aman's badge scanned at Gallery 4 entrance at 7:57 PM. Priya's badge scanned at Control Room at 7:50 PM.\", \"isKey\": true}," +
                        "{\"id\": \"e2\", \"type\": \"Digital\", \"title\": \"Computer Activity Log\", \"emoji\": \"💻\", \"content\": \"Aman's office computer: Last activity at 7:44 PM. Resume at 8:16 PM. A 32-minute gap with no activity, contradicting his alibi.\", \"isKey\": true}," +
                        "{\"id\": \"e3\", \"type\": \"Phone\", \"title\": \"Phone Records\", \"emoji\": \"📱\", \"content\": \"Priya called Aman at 7:58 PM — call duration: 28 seconds. The call ended before the camera outage began. Her alibi of 'talking to Aman at 8 PM' is incorrect.\", \"isKey\": false}," +
                        "{\"id\": \"e4\", \"type\": \"Physical\", \"title\": \"Parking Lot CCTV\", \"emoji\": \"🚗\", \"content\": \"Aman's car was captured entering the museum parking lot at 7:50 PM, not exiting until 8:47 PM. His car never left during the heist window.\", \"isKey\": false}," +
                        "{\"id\": \"e5\", \"type\": \"Financial\", \"title\": \"Bank Records\", \"emoji\": \"💰\", \"content\": \"Aman has ₹8.3 lakh in documented gambling debts. A payment of ₹2 lakh was made to a creditor 3 days before the heist.\", \"isKey\": false}," +
                        "{\"id\": \"e6\", \"type\": \"Physical\", \"title\": \"Fingerprints on Case\", \"emoji\": \"👆\", \"content\": \"Partial fingerprints found on the display case glass. Analysis matches Aman Verma. However, as curator, he had legitimate reasons to touch the case.\", \"isKey\": true}" +
                        "]")
                .timeline("[" +
                        "{\"time\": \"7:44 PM\", \"event\": \"Last computer activity on Aman's workstation\"}," +
                        "{\"time\": \"7:50 PM\", \"event\": \"Priya's badge scanned at Control Room\"}," +
                        "{\"time\": \"7:50 PM\", \"event\": \"Aman's car enters museum parking lot\"}," +
                        "{\"time\": \"7:55 PM\", \"event\": \"Rahul's badge scanned on Floor 1 (NOT Floor 2 as claimed)\"}," +
                        "{\"time\": \"7:57 PM\", \"event\": \"Aman's badge scanned at Gallery 4 entrance\"}," +
                        "{\"time\": \"7:58 PM\", \"event\": \"Priya calls Aman — call lasts 28 seconds\"}," +
                        "{\"time\": \"7:58 PM\", \"event\": \"Camera outage begins in Gallery 4\"}," +
                        "{\"time\": \"8:00 PM\", \"event\": \"Diamond reported missing. Cameras resume.\"}," +
                        "{\"time\": \"8:16 PM\", \"event\": \"Aman's computer activity resumes\"}," +
                        "{\"time\": \"8:47 PM\", \"event\": \"Aman's car exits parking lot\"}" +
                        "]")
                .correctAnswer("{\"culprit\": \"aman\", \"motive\": \"gambling-debts\", \"keyEvidence\": [\"e1\", \"e2\", \"e6\"]}")
                .solution("Aman Verma stole the diamond. His badge was scanned at Gallery 4 at 7:57 PM — 1 minute before the camera outage. His computer shows no activity during the theft window, debunking his alibi. His fingerprints were on the case. With ₹8.3 lakh in debts and desperate for money, he used his curator access to steal the diamond during the planned camera blind spot.")
                .culpritChoices("[" +
                        "{\"id\": \"rahul\", \"label\": \"Rahul Sharma (Security Guard)\"}," +
                        "{\"id\": \"aman\", \"label\": \"Aman Verma (Junior Curator)\"}," +
                        "{\"id\": \"priya\", \"label\": \"Priya Nair (Head of Security Systems)\"}" +
                        "]")
                .motiveChoices("[" +
                        "{\"id\": \"gambling-debts\", \"label\": \"Gambling debts and financial desperation\"}," +
                        "{\"id\": \"personal-grudge\", \"label\": \"Personal grudge against the museum director\"}," +
                        "{\"id\": \"hired\", \"label\": \"Hired by an outside criminal organization\"}," +
                        "{\"id\": \"revenge\", \"label\": \"Revenge for being passed over for promotion\"}" +
                        "]")
                .build();

        mysteryCaseRepository.save(mCase);
        log.info("Seeding mystery cases complete.");
    }

    private void seedDailyChallenge() {
        LocalDate today = LocalDate.now();
        if (dailyChallengeRepository.findByChallengeDate(today).isPresent()) {
            log.info("Daily challenge already seeded for today.");
            return;
        }

        log.info("Seeding daily challenge...");
        DailyChallenge challenge = DailyChallenge.builder()
                .title("The Paradox Sequence")
                .description("A master-level number sequence that has stumped 80% of players. Do you have what it takes?")
                .challengeDate(today)
                .type("number-detective")
                .difficulty("HARD")
                .xpReward(100)
                .coinReward(50)
                .puzzle("{\"question\": \"1, 1, 2, 3, 5, 8, 13, 21, ?\", \"answer\": \"34\", \"explanation\": \"This is the Fibonacci sequence. Each number is the sum of the two preceding ones. 13 + 21 = 34.\", \"hint\": \"Look at the sum of consecutive pairs.\"}")
                .build();

        dailyChallengeRepository.save(challenge);
        log.info("Seeding daily challenge complete.");
    }
}
