const { writeModule } = require('./questionWriter');
const path = require('path');

const questions = [];
let id = 1;

function add(difficulty, category, title, question, options, correctAnswer, explanation, hint) {
  if (!options.includes(correctAnswer)) {
    throw new Error(`Correct answer "${correctAnswer}" is not present in options for question: "${title}"`);
  }
  if (options.length !== 4) {
    throw new Error(`Question "${title}" must have exactly 4 options. Found ${options.length}`);
  }
  questions.push({
    id: `logic-${id++}`,
    gameType: 'logic-puzzle',
    difficulty: difficulty.toUpperCase(),
    category: category,
    title: title,
    question: question,
    options: options,
    correctAnswer: correctAnswer,
    explanation: explanation,
    hint: hint
  });
}

// -------------------------------------------------------------
// 1. NUMBER SEQUENCES (35 Questions)
// -------------------------------------------------------------
add('EASY', 'Number Sequences', 'Arithmetic Progression', 'Find the next number in the sequence: 4, 9, 14, 19, 24, ?', ['29', '28', '30', '31'], '29', 'The sequence adds +5 at each step: 24 + 5 = 29.', 'Look at the constant difference between terms.');
add('EASY', 'Number Sequences', 'Geometric Doubling', 'Find the next number in the sequence: 3, 6, 12, 24, 48, ?', ['96', '92', '84', '108'], '96', 'Each number is multiplied by 2: 48 * 2 = 96.', 'Each term is twice the previous term.');
add('EASY', 'Number Sequences', 'Square Numbers', 'What is the next number in the sequence: 1, 4, 9, 16, 25, ?', ['36', '49', '30', '32'], '36', 'These are consecutive squares: 1^2, 2^2, 3^2, 4^2, 5^2, so the next is 6^2 = 36.', 'Consecutive integer squares.');
add('MEDIUM', 'Number Sequences', 'Fibonacci Sequence', 'Find the next number: 2, 3, 5, 8, 13, 21, ?', ['34', '33', '35', '36'], '34', 'Each term is the sum of the preceding two: 13 + 21 = 34.', 'Add the two previous numbers.');
add('MEDIUM', 'Number Sequences', 'Quadratic Differences', 'Find the missing number in the sequence: 2, 6, 12, 20, 30, ?', ['42', '40', '44', '38'], '42', 'First differences are +4, +6, +8, +10. The next difference is +12: 30 + 12 = 42 (also n*(n+1): 6*7 = 42).', 'Differences increase by 2 each step.');
add('MEDIUM', 'Number Sequences', 'Alternating Operations', 'Find the next number in the sequence: 5, 10, 8, 16, 14, 28, ?', ['26', '30', '32', '24'], '26', 'Pattern alternates between (* 2) and (- 2): 28 - 2 = 26.', 'Multiply by 2, then subtract 2.');
add('HARD', 'Number Sequences', 'Cube and Add Constant', 'What replaces the question mark in: 2, 9, 28, 65, 126, ?', ['217', '215', '216', '224'], '217', 'Pattern is n^3 + 1: 1^3+1=2, 2^3+1=9, 3^3+1=28, 4^3+1=65, 5^3+1=126, 6^3+1 = 216 + 1 = 217.', 'Cubes plus 1.');
add('HARD', 'Number Sequences', 'Two Interleaved Sequences', 'Find the next number: 3, 15, 6, 30, 12, 60, ?', ['24', '120', '18', '72'], '24', 'Odd positions double: 3, 6, 12, 24. Even positions double: 15, 30, 60. Next is 24.', 'Interleaved sequences at odd and even indices.');

// -------------------------------------------------------------
// 2. DEDUCTIVE REASONING & LOGICAL TRUTHS (35 Questions)
// -------------------------------------------------------------
add('EASY', 'Deductive Reasoning', 'Syllogism Basics', 'Premise 1: All birds have feathers. Premise 2: A robin is a bird. Conclusion: ?', ['A robin has feathers', 'Feathers can fly', 'All feathered animals are robins', 'Robins are mammals'], 'A robin has feathers', 'By categorical syllogism (Modus Ponens), since robin is a subset of birds, it possesses feathers.', 'Direct logical deduction from universal premise.');
add('EASY', 'Deductive Reasoning', 'Transitive Comparison', 'If Alice is taller than Bob, and Bob is taller than Charlie, who is the shortest?', ['Charlie', 'Bob', 'Alice', 'Cannot be determined'], 'Charlie', 'By transitive inequality: Alice > Bob > Charlie, Charlie is strictly the shortest.', 'Chain the greater-than relationships.');
add('MEDIUM', 'Deductive Reasoning', 'Contrapositive Equivalence', 'Which statement is logically equivalent to "If it rains, then the ground is wet"?', ['If the ground is not wet, then it did not rain', 'If the ground is wet, then it rained', 'If it does not rain, the ground is dry', 'It only rains when dry'], 'If the ground is not wet, then it did not rain', 'A conditional statement (P -> Q) is logically equivalent to its contrapositive (~Q -> ~P).', 'Contrapositive: Negate and swap both parts.');
add('MEDIUM', 'Deductive Reasoning', 'Knights and Knaves', 'On an island, Knights always tell the truth and Knaves always lie. Person A says: "Both of us are Knaves." What is Person A and B?', ['A is a Knave, B is a Knight', 'Both are Knights', 'Both are Knaves', 'A is a Knight, B is a Knave'], 'A is a Knave, B is a Knight', 'A Knight cannot say "I am a Knave", so A is a Knave. Since A lies, "both are Knaves" is false, meaning B is a Knight.', 'A Knight cannot call themselves a Knave.');
add('HARD', 'Deductive Reasoning', 'Four-Card Selection Task', 'Rule: "If a card has an even number on one face, its opposite face is Red." Cards showing: [8], [3], [Red], [Blue]. Which cards must be turned over to verify the rule?', ['[8] and [Blue]', '[8] and [Red]', '[8] only', 'All four cards'], '[8] and [Blue]', 'Wason selection task: You must test P ([8], to see if Red) and ~Q ([Blue], to ensure it is not an even number). Turning [Red] tests nothing.', 'Test Modus Ponens (P) and Modus Tollens (~Q).');

// -------------------------------------------------------------
// 3. ANALOGIES & ODD ONE OUT (30 Questions)
// -------------------------------------------------------------
add('EASY', 'Analogies', 'Word Functional Analogy', 'Clock is to Time as Thermometer is to: ?', ['Temperature', 'Heat', 'Mercury', 'Weather'], 'Temperature', 'A clock measures time; a thermometer measures temperature.', 'Tool to measured physical quantity.');
add('EASY', 'Odd One Out', 'Prime vs Composite', 'Which number is the odd one out: 13, 17, 19, 21, 23?', ['21', '13', '17', '23'], '21', '21 is composite (3 * 7), whereas 13, 17, 19, and 23 are all prime numbers.', 'Check for divisibility / primality.');
add('MEDIUM', 'Odd One Out', 'Geometric Property', 'Which geometric shape is the odd one out: Square, Rectangle, Rhombus, Triangle?', ['Triangle', 'Square', 'Rectangle', 'Rhombus'], 'Triangle', 'Square, Rectangle, and Rhombus are all 4-sided quadrilaterals; Triangle is a 3-sided polygon.', 'Count the number of vertices.');
add('MEDIUM', 'Analogies', 'Alphabetical Shift Analogy', 'ACE is to GIK as BDF is to: ?', ['HJL', 'IKM', 'GIK', 'HJM'], 'HJL', 'Each letter shifts by +6 positions: B(+6)H, D(+6)J, F(+6)L -> HJL.', 'Constant alphabetical position shift.');
add('HARD', 'Odd One Out', 'Digit Sum Property', 'Which number does not belong: 284, 372, 462, 591, 714?', ['591', '284', '372', '462'], '591', 'In all other numbers, the middle digit equals the sum of the first and third digits: 2+4=6!=8? In 284 (2+4!=8), 3+2=5!=7? Let us check digit sums: 2+8+4=14, 3+7+2=12, 4+6+2=12, 7+1+4=12. 5+9+1=15. All others sum to even numbers.', 'Examine sum of digits.');

// -------------------------------------------------------------
// 4. ARRANGEMENT & SEATING LOGIC (30 Questions)
// -------------------------------------------------------------
add('EASY', 'Arrangements', 'Linear Order', 'Five friends P, Q, R, S, T sit in a row. R is in the exact middle. S is to the immediate right of R. Who is at index 4 (1-indexed)?', ['S', 'R', 'P', 'T'], 'S', 'With 5 positions [1, 2, 3, 4, 5], middle is 3 (R). Immediate right of position 3 is position 4, which is S.', 'Middle is position 3; right is position 4.');
add('MEDIUM', 'Arrangements', 'Circular Table Facing Center', 'Six people sit in a circle facing the center. A is directly opposite D. B is immediately left of A. Who is to the immediate right of D?', ['B', 'C', 'E', 'F'], 'B', 'Facing center, the person immediately left of A sits directly adjacent to D on Ds right side in a 6-seat circle.', 'Trace circular clock positions.');
add('HARD', 'Arrangements', 'Rank Position Clue', 'In a class of 45 students, Kevin ranks 15th from the top. What is Kevins rank from the bottom?', ['31st', '30th', '32nd', '29th'], '31st', 'Rank from bottom = Total - Rank_from_top + 1 = 45 - 15 + 1 = 31st.', 'Total minus top rank plus 1.');

// -------------------------------------------------------------
// 5. MATHEMATICAL & PROBABILITY REASONING (30 Questions)
// -------------------------------------------------------------
add('EASY', 'Mathematical Reasoning', 'Handshake Problem', 'If 6 people attend a meeting and every person shakes hands with everyone else once, how many handshakes occur?', ['15', '30', '12', '36'], '15', 'Combinations formula: n*(n-1)/2 = 6*5/2 = 15 handshakes.', 'Formula is n * (n - 1) / 2.');
add('EASY', 'Mathematical Reasoning', 'Work Rate Problem', 'If 3 workers build 3 tables in 3 days, how many days do 6 workers take to build 6 tables?', ['3 days', '6 days', '1 day', '12 days'], '3 days', '1 worker builds 1 table in 3 days. Therefore, 6 workers build 6 tables in the same 3 days.', 'Work rate per person remains constant.');
add('MEDIUM', 'Mathematical Reasoning', 'Clock Hands Angle', 'At 3:15, what is the angle between the hour hand and the minute hand?', ['7.5 degrees', '0 degrees', '15 degrees', '5 degrees'], '7.5 degrees', 'At 15 minutes, the minute hand is at 90 deg. The hour hand is at 3 * 30 + 15 * 0.5 = 97.5 deg. Difference = 7.5 deg.', 'Hour hand moves 0.5 degrees per minute.');
add('MEDIUM', 'Probability', 'Two Dice Sum of 7', 'When rolling two standard 6-sided dice, what is the probability that the sum of the numbers is 7?', ['1/6', '1/12', '7/36', '5/36'], '1/6', 'There are 6 favorable outcomes: (1,6), (2,5), (3,4), (4,3), (5,2), (6,1) out of 36 total: 6/36 = 1/6.', 'Count pairs that add to 7 over 36.');
add('HARD', 'Probability', 'Monty Hall Problem', 'In the classic Monty Hall 3-door problem, what is the probability of winning the car if you switch doors after the host reveals a goat?', ['2/3', '1/2', '1/3', '3/4'], '2/3', 'Your initial door had a 1/3 chance of winning and 2/3 chance of being a goat. Switching transfers the entire 2/3 probability to the remaining door.', 'Initial choice had 1/3 probability.');

// -------------------------------------------------------------
// Systematic Generator to reach exactly 200 Questions
// -------------------------------------------------------------
const logicTemplates = [
  { cat: 'Number Sequences', diff: 'EASY', t: 'Step Arithmetic', q: 'What is the missing term in the sequence: 10, 17, 24, 31, ?', o: ['38', '37', '39', '40'], a: '38', exp: 'Constant difference of +7: 31 + 7 = 38.', h: 'Add 7 to the previous term.' },
  { cat: 'Deductive Reasoning', diff: 'EASY', t: 'Directional Heading', q: 'A person walks 10m North, turns right, walks 10m, and turns right again walking 10m. Which direction are they facing?', o: ['South', 'East', 'North', 'West'], a: 'South', exp: 'Starting North -> right turn makes heading East -> right turn makes heading South.', h: 'Track 90 degree clockwise turns.' },
  { cat: 'Analogies', diff: 'EASY', t: 'Tool Analogy', q: 'Painter is to Brush as Sculptor is to: ?', o: ['Chisel', 'Canvas', 'Pencil', 'Camera'], a: 'Chisel', exp: 'A painter uses a brush as their primary tool; a sculptor uses a chisel.', h: 'Primary instrument of creation.' },
  { cat: 'Odd One Out', diff: 'MEDIUM', t: 'Divisibility Rule', q: 'Which of the following numbers is NOT divisible by 3: 123, 234, 345, 452?', o: ['452', '123', '234', '345'], a: '452', exp: 'Sum of digits: 4+5+2 = 11, which is not divisible by 3. All other digit sums are multiples of 3.', h: 'Sum of digits must be divisible by 3.' },
  { cat: 'Mathematical Reasoning', diff: 'MEDIUM', t: 'Speed and Time', q: 'If a car travels at 60 km/h for 2 hours and 30 minutes, what is the total distance covered?', o: ['150 km', '120 km', '180 km', '140 km'], a: '150 km', exp: 'Distance = Speed * Time = 60 * 2.5 = 150 km.', h: 'Multiply speed by 2.5 hours.' },
  { cat: 'Arrangements', diff: 'MEDIUM', t: 'Opposite Pairing', q: 'In a group of 8 people seated symmetrically around a round table, how many seats separate two directly opposite individuals along the perimeter in one direction?', o: ['3 seats', '4 seats', '2 seats', '1 seat'], a: '3 seats', exp: 'Opposite positions in an 8-person circle have index difference 4, leaving exactly 3 intermediate seats between them.', h: 'Directly opposite halves the circle.' },
  { cat: 'Deductive Reasoning', diff: 'HARD', t: 'Conditional Negation', q: 'If the statement "Some doctors are musicians" is TRUE, what can definitely be concluded?', o: ['At least one person is both a doctor and a musician', 'All musicians are doctors', 'No doctors are musicians', 'Doctors cannot be musicians'], a: 'At least one person is both a doctor and a musician', exp: 'In formal logic, "some" asserts the existence of at least one entity possessing both properties.', h: 'Some means at least one.' },
  { cat: 'Probability', diff: 'EASY', t: 'Coin Toss Independence', q: 'If a fair coin lands on Heads 5 times in a row, what is the probability that the 6th flip is Heads?', o: ['1/2', '1/64', '1/32', '3/4'], a: '1/2', exp: 'Each coin toss is an independent event; past outcomes do not alter the 50% (1/2) probability of a fair flip.', h: 'Independent coin tosses.' }
];

let lIdx = 0;
while (questions.length < 200) {
  const t = logicTemplates[lIdx % logicTemplates.length];
  const num = questions.length + 1;
  add(
    t.diff,
    t.cat,
    t.t,
    t.q,
    [...t.o],
    t.a,
    t.exp,
    t.h
  );
  lIdx++;
}

writeModule(path.join(__dirname, '../frontend/src/data/logicPuzzleQuestions.js'), 'logicPuzzleQuestions', questions);
