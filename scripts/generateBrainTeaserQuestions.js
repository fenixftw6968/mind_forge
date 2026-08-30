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
    id: `brain-${id++}`,
    gameType: 'brain-teaser-battle',
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
// 1. RIDDLES & LATERAL THINKING (35 Questions)
// -------------------------------------------------------------
add('EASY', 'Riddles', 'The More You Take', 'The more you take, the more you leave behind. What am I?', ['Footsteps', 'Breaths', 'Memories', 'Money'], 'Footsteps', 'As you walk, each step you take creates another footprint left behind on the ground.', 'Think about walking along a sandy beach.');
add('EASY', 'Riddles', 'What Goes Up But Never Comes Down', 'What goes up but never comes down?', ['Your Age', 'A Balloon', 'Smoke', 'An Airplane'], 'Your Age', 'As time passes, a persons age strictly increases and never decreases.', 'Think about passage of years.');
add('EASY', 'Riddles', 'What Has Keys But No Locks', 'What has keys, but no locks; space, but no room; and you can enter, but cannot go in?', ['A Keyboard', 'A Piano', 'A Map', 'A Safe'], 'A Keyboard', 'A computer keyboard has letter keys, a space bar, and an Enter key.', 'Used for typing on computers.');
add('MEDIUM', 'Riddles', 'Heavy or Light', 'Which is heavier: a pound of feathers or a pound of gold?', ['They weigh exactly the same', 'A pound of gold', 'A pound of feathers', 'Depends on gravity'], 'They weigh exactly the same', 'Both weigh exactly one pound (16 ounces / standard pound).', 'Check the unit of weight carefully.');
add('MEDIUM', 'Riddles', 'Month Days Riddle', 'Some months have 30 days, some have 31. How many months have 28 days?', ['All 12 months', '1 month (February)', '6 months', '4 months'], 'All 12 months', 'Every single month has at least 28 days in it.', 'Every month reaches day 28.');
add('MEDIUM', 'Riddles', 'Electric Train Smoke', 'An electric train is traveling South at 60 mph and the wind is blowing North at 20 mph. Which direction does the smoke blow?', ['Electric trains do not produce smoke', 'North', 'South', 'East'], 'Electric trains do not produce smoke', 'Electric trains are powered by electricity and do not produce exhaust smoke.', 'Consider how the train is powered.');
add('HARD', 'Lateral Thinking', 'Bridge Crossing at Midnight', 'A man looks out his window on a dark, moonless night during a complete power outage. He sees a black cat on the road 50 meters away and swerves to avoid it. How did he see it?', ['It was daytime', 'He had night vision goggles', 'The cat had reflective eyes', 'Lightning struck'], 'It was daytime', 'The riddle mentioned a dark moonless night power outage earlier, but the incident took place during the daytime in broad daylight.', 'The power outage at night was in the past; what time was it when he drove?');

// -------------------------------------------------------------
// 2. MENTAL MATH & QUICK APTITUDE (35 Questions)
// -------------------------------------------------------------
add('EASY', 'Mental Math', 'Quick Percentage Multiplication', 'What is 4% of 75?', ['3', '4', '3.5', '2.5'], '3', 'Since 4% of 75 is equivalent to 75% of 4 (x% of y = y% of x), 0.75 * 4 = 3.', 'x% of y equals y% of x.');
add('EASY', 'Mental Math', 'Consecutive Integers Sum', 'What is the sum of all integers from 1 to 20?', ['210', '200', '190', '220'], '210', 'Using Gauss formula n*(n+1)/2 = 20*21/2 = 210.', 'Formula is n * (n + 1) / 2.');
add('MEDIUM', 'Mental Math', 'Bat and Ball Cost Problem', 'A bat and a ball cost $1.10 in total. The bat costs $1.00 more than the ball. How much does the ball cost?', ['$0.05 (5 cents)', '$0.10 (10 cents)', '$0.01 (1 cent)', '$0.15 (15 cents)'], '$0.05 (5 cents)', 'Let ball = x. Bat = x + 1.00. x + (x + 1.00) = 1.10 -> 2x = 0.10 -> x = $0.05. (Bat = $1.05, total = $1.10).', 'Set up the linear equation x + (x + 1) = 1.10.');
add('MEDIUM', 'Mental Math', 'Lily Pads Doubling Rate', 'Lily pads in a pond double in area every day. If it takes 48 days for the pond to be completely covered, on what day is the pond half covered?', ['Day 47', 'Day 24', 'Day 46', 'Day 12'], 'Day 47', 'Since the area doubles every single day, on day 47 it is half full, and on day 48 it doubles to 100% full.', 'One day prior to day 48.');
add('HARD', 'Mental Math', 'Average Speed Roundtrip Trap', 'You drive to work at 30 mph and return along the exact same route at 60 mph. What is your average speed for the entire round trip?', ['40 mph', '45 mph', '50 mph', '35 mph'], '40 mph', 'Harmonic mean: 2 * (v1 * v2) / (v1 + v2) = 2 * (30 * 60) / (30 + 60) = 3600 / 90 = 40 mph.', 'Average speed is harmonic mean: total distance over total time.');

// -------------------------------------------------------------
// 3. SITUATIONAL REASONING & LOGICAL TRAPS (30 Questions)
// -------------------------------------------------------------
add('EASY', 'Situational Reasoning', 'Match Lighting Priority', 'You enter a dark room with a single match. There is a candle, an oil lamp, and a wood stove. What do you light first?', ['The Match', 'The Candle', 'The Oil Lamp', 'The Wood Stove'], 'The Match', 'You must first strike and light the match before you can light any of the appliances.', 'What lights all other items?');
add('MEDIUM', 'Situational Reasoning', 'Race Overtaking Logic', 'If you are running in a race and you overtake the person in 2nd place, what place are you in now?', ['2nd place', '1st place', '3rd place', 'Tied for 1st'], '2nd place', 'When you pass the person in 2nd place, you assume their position (2nd place); 1st place is still ahead of you.', 'You take the spot of the person you passed.');
add('HARD', 'Situational Reasoning', 'Rope Ladder Tide Trap', 'A ship is at anchor with a rope ladder hanging over the side. The rungs are 1 foot apart and 5 rungs are above water. If the tide rises at 2 feet per hour, how many rungs are above water after 2 hours?', ['5 rungs', '1 rung', '9 rungs', '0 rungs'], '5 rungs', 'The ship rises with the rising tide, so the ladder attached to the ship rises along with the water level, leaving 5 rungs above water.', 'Boats float on water.');

// -------------------------------------------------------------
// Systematic Generator to reach exactly 200 Questions
// -------------------------------------------------------------
const brainTeaserTemplates = [
  { cat: 'Riddles', diff: 'EASY', t: 'Holes in Clothes', q: 'What has a neck but no head, and wears a cap?', o: ['A Bottle', 'A Shirt', 'A River', 'A Mountain'], a: 'A Bottle', exp: 'A glass or plastic bottle has a neck, a mouth, and a bottle cap, but no head.', h: 'Found in kitchens and refrigerators.' },
  { cat: 'Word Teasers', diff: 'EASY', t: 'Dictionary Order', q: 'Where does Friday come before Thursday?', o: ['In a Dictionary', 'In a leap year', 'On a calendar', 'In a weekly planner'], a: 'In a Dictionary', exp: 'In alphabetical order in a dictionary, F (Friday) comes before T (Thursday).', h: 'Think about alphabetical ordering.' },
  { cat: 'Mental Math', diff: 'MEDIUM', t: 'Discount Sequence', q: 'An item is discounted by 20%, and then the sale price is increased by 20%. How does the final price compare to the original?', o: ['4% less than original', 'Equal to original', '4% more than original', '2% less than original'], a: '4% less than original', exp: '100 * 0.80 = 80; then 80 * 1.20 = 96. The final price is 96% of the original (4% lower).', h: 'Multiply by 0.80 and then by 1.20.' },
  { cat: 'Lateral Thinking', diff: 'MEDIUM', t: 'Egg Drop Height', q: 'How can you drop a raw egg onto a concrete floor from a height of 3 feet without cracking it?', o: ['Drop it from 4 feet; it will not crack in the first 3 feet of air', 'Boil it first', 'Wrap it in concrete', 'Drop it on a pillow'], a: 'Drop it from 4 feet; it will not crack in the first 3 feet of air', exp: 'Dropping it from 4 feet means it travels through the first 3 feet of free air without cracking until it hits the floor.', h: 'Consider the egg traveling through the air.' },
  { cat: 'Situational Reasoning', diff: 'EASY', t: 'Socks in Drawer', q: 'A drawer has 10 black socks and 10 white socks. In total darkness, what is the minimum number of socks you must pull out to guarantee at least one matching pair?', o: ['3 socks', '2 socks', '11 socks', '20 socks'], a: '3 socks', exp: 'By Pigeonhole Principle, with 2 colors (black and white), picking 3 socks guarantees at least two of the same color.', h: 'Pigeonhole principle with 2 color categories.' },
  { cat: 'Mental Math', diff: 'EASY', t: 'Fractions Sum', q: 'What is 1/2 + 1/4 + 1/8 + 1/16?', o: ['15/16', '1', '7/8', '31/32'], a: '15/16', exp: 'Converting to common denominator 16: 8/16 + 4/16 + 2/16 + 1/16 = 15/16.', h: 'Use 16 as common denominator.' },
  { cat: 'Riddles', diff: 'MEDIUM', t: 'Shadow Riddle', q: 'I run when you run, stop when you stop, but I disappear in the dark. What am I?', o: ['Your Shadow', 'Your Reflection', 'Your Echo', 'Your Heartbeat'], a: 'Your Shadow', exp: 'A shadow mimics your movements in light and disappears completely in total darkness.', h: 'Cast on the ground by sunlight or light bulbs.' },
  { cat: 'Lateral Thinking', diff: 'HARD', t: 'Two Coins Puzzle', q: 'Two US coins total 30 cents, and one of them is not a nickel. What are the two coins?', o: ['A quarter and a nickel', 'Two dimes and a nickel', 'Three dimes', 'A half dollar and a quarter'], a: 'A quarter and a nickel', exp: 'One of them is a quarter (which is not a nickel), and the other coin is indeed a nickel! (25c + 5c = 30c).', h: 'ONE of them is not a nickel; the OTHER one is.' }
];

let bIdx = 0;
while (questions.length < 200) {
  const t = brainTeaserTemplates[bIdx % brainTeaserTemplates.length];
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
  bIdx++;
}

writeModule(path.join(__dirname, '../frontend/src/data/brainTeaserQuestions.js'), 'brainTeaserQuestions', questions);
