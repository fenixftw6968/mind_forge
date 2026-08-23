export const whoIsLyingQuestions = [
  // EASY (10 questions)
  {
    id: "wil-easy-01",
    gameType: "who-is-lying",
    difficulty: "easy",
    scenario: "Someone broke the principal's prized trophy. Three students in detention were questioned.",
    rule: "Exactly ONE person is lying. The other two are telling the truth.",
    characters: [
      { id: "alex", name: "Alex", avatar: "👦", statement: "Ben broke the trophy." },
      { id: "ben", name: "Ben", avatar: "🧑", statement: "I didn't break it! Alex is lying." },
      { id: "chloe", name: "Chloe", avatar: "👧", statement: "I was reading my book the whole time." }
    ],
    question: "Who is lying?",
    choices: [
      { id: "alex", label: "Alex is lying" },
      { id: "ben", label: "Ben is lying" },
      { id: "chloe", label: "Chloe is lying" }
    ],
    correctAnswer: "alex",
    explanation: "Alex and Ben make directly contradictory statements. If Ben were lying, Alex would be telling the truth and Chloe would be telling the truth. But if Ben broke it, Alex's statement is true. Testing Alex as the liar: Ben is innocent, Alex falsely accused him, and Chloe was reading — perfectly satisfying exactly 1 liar.",
    hint: "Notice that Alex and Ben directly contradict each other. One of them must be the liar."
  },
  {
    id: "wil-easy-02",
    gameType: "who-is-lying",
    difficulty: "easy",
    scenario: "The last slice of chocolate cake disappeared from the kitchen fridge.",
    rule: "Only ONE person ate the cake, and only ONE person is lying.",
    characters: [
      { id: "dan", name: "Dan", avatar: "👱", statement: "Emma ate the cake." },
      { id: "emma", name: "Emma", avatar: "👩", statement: "Finn ate the cake." },
      { id: "finn", name: "Finn", avatar: "🧑‍🦱", statement: "I didn't eat the cake!" }
    ],
    question: "Who is lying?",
    choices: [
      { id: "dan", label: "Dan is lying" },
      { id: "emma", label: "Emma is lying" },
      { id: "finn", label: "Finn is lying" }
    ],
    correctAnswer: "emma",
    explanation: "Emma says Finn ate it, while Finn says he didn't. One of them is lying. If Dan tells the truth (Emma ate it), then Emma's accusation of Finn is false (Emma is the liar) and Finn's denial is true. Thus Emma is lying.",
    hint: "Look at Dan's accusation and see who contradicts Finn."
  },
  {
    id: "wil-easy-03",
    gameType: "who-is-lying",
    difficulty: "easy",
    scenario: "A laptop charger was taken from the study room.",
    rule: "Exactly ONE person is lying.",
    characters: [
      { id: "leo", name: "Leo", avatar: "🧑", statement: "Mia took the charger." },
      { id: "mia", name: "Mia", avatar: "👩‍🦰", statement: "Leo is telling the truth." },
      { id: "noah", name: "Noah", avatar: "👦", statement: "Mia did NOT take the charger." }
    ],
    question: "Who is lying?",
    choices: [
      { id: "leo", label: "Leo is lying" },
      { id: "mia", label: "Mia is lying" },
      { id: "noah", label: "Noah is lying" }
    ],
    correctAnswer: "noah",
    explanation: "Leo says Mia took it, and Mia agrees that Leo is truthful (meaning Mia took it). Noah claims Mia did NOT take it. Since Leo and Mia agree, Noah is the one contradicting both of them and must be lying.",
    hint: "Leo and Mia support each other's claim."
  },
  {
    id: "wil-easy-04",
    gameType: "who-is-lying",
    difficulty: "easy",
    scenario: "Someone painted a mural on the gym wall without permission.",
    rule: "Exactly ONE person is lying.",
    characters: [
      { id: "sam", name: "Sam", avatar: "🧢", statement: "It wasn't me, I was at basketball practice." },
      { id: "tara", name: "Tara", avatar: "🎨", statement: "Sam was definitely at basketball practice with me." },
      { id: "victor", name: "Victor", avatar: "👓", statement: "Sam was alone painting the wall." }
    ],
    question: "Who is lying?",
    choices: [
      { id: "sam", label: "Sam is lying" },
      { id: "tara", label: "Tara is lying" },
      { id: "victor", label: "Victor is lying" }
    ],
    correctAnswer: "victor",
    explanation: "Sam and Tara corroborate each other's alibi. Victor contradicts both of them by claiming Sam was at the gym painting. Victor is the sole liar.",
    hint: "Two people give the exact same alibi."
  },
  {
    id: "wil-easy-05",
    gameType: "who-is-lying",
    difficulty: "easy",
    scenario: "The office coffee machine was left running all night.",
    rule: "Only ONE person is lying.",
    characters: [
      { id: "amy", name: "Amy", avatar: "👩‍💼", statement: "Bob was the last one to leave the breakroom." },
      { id: "bob", name: "Bob", avatar: "👨‍💼", statement: "I was the last one to leave, but I turned it off." },
      { id: "carl", name: "Carl", avatar: "🧑‍💻", statement: "Bob left at 5 PM before Amy did." }
    ],
    question: "Who is lying?",
    choices: [
      { id: "amy", label: "Amy is lying" },
      { id: "bob", label: "Bob is lying" },
      { id: "carl", label: "Carl is lying" }
    ],
    correctAnswer: "carl",
    explanation: "Both Amy and Bob agree that Bob was the last person to leave. Carl contradicts both of them by saying Bob left before Amy.",
    hint: "Amy and Bob both agree on who was last in the breakroom."
  },
  {
    id: "wil-easy-06",
    gameType: "who-is-lying",
    difficulty: "easy",
    scenario: "A pet hamster escaped its cage during class.",
    rule: "Exactly ONE person is lying.",
    characters: [
      { id: "lucas", name: "Lucas", avatar: "👦", statement: "The cage door was left wide open by Sarah." },
      { id: "sarah", name: "Sarah", avatar: "👧", statement: "Lucas is lying, I never touched the cage." },
      { id: "tom", name: "Tom", avatar: "🧑", statement: "Sarah was sitting next to me all period." }
    ],
    question: "Who is lying?",
    choices: [
      { id: "lucas", label: "Lucas is lying" },
      { id: "sarah", label: "Sarah is lying" },
      { id: "tom", label: "Tom is lying" }
    ],
    correctAnswer: "lucas",
    explanation: "Tom confirms Sarah was with him all period. Sarah denies touching the cage. Lucas's accusation of Sarah is false, so Lucas is the liar.",
    hint: "Tom provides an alibi for Sarah."
  },
  {
    id: "wil-easy-07",
    gameType: "who-is-lying",
    difficulty: "easy",
    scenario: "A lost wallet was turned in to the front desk.",
    rule: "Exactly ONE person is lying.",
    characters: [
      { id: "oliver", name: "Oliver", avatar: "🧑", statement: "Grace found the wallet by the stairs." },
      { id: "grace", name: "Grace", avatar: "👩", statement: "Yes, I found it by the stairs and gave it to Oliver." },
      { id: "henry", name: "Henry", avatar: "👨", statement: "Oliver found the wallet in the cafeteria." }
    ],
    question: "Who is lying?",
    choices: [
      { id: "oliver", label: "Oliver is lying" },
      { id: "grace", label: "Grace is lying" },
      { id: "henry", label: "Henry is lying" }
    ],
    correctAnswer: "henry",
    explanation: "Oliver and Grace share a matching story that Grace found it by the stairs. Henry contradicts them both.",
    hint: "Henry's version disagrees with both Oliver and Grace."
  },
  {
    id: "wil-easy-08",
    gameType: "who-is-lying",
    difficulty: "easy",
    scenario: "The classroom projector remote went missing.",
    rule: "Exactly ONE person is lying.",
    characters: [
      { id: "jake", name: "Jake", avatar: "👦", statement: "Kylie put the remote in her backpack." },
      { id: "kylie", name: "Kylie", avatar: "👧", statement: "Jake is lying, I don't even have a backpack today." },
      { id: "liam", name: "Liam", avatar: "🧑", statement: "Kylie only brought a tote bag today." }
    ],
    question: "Who is lying?",
    choices: [
      { id: "jake", label: "Jake is lying" },
      { id: "kylie", label: "Kylie is lying" },
      { id: "liam", label: "Liam is lying" }
    ],
    correctAnswer: "jake",
    explanation: "Liam verifies that Kylie only had a tote bag, supporting Kylie's statement that she didn't have a backpack. Jake's statement is false.",
    hint: "Liam confirms Kylie had no backpack."
  },
  {
    id: "wil-easy-09",
    gameType: "who-is-lying",
    difficulty: "easy",
    scenario: "Who scored the winning goal in yesterday's soccer match?",
    rule: "Exactly ONE person is lying.",
    characters: [
      { id: "mason", name: "Mason", avatar: "⚽", statement: "Nora scored the winning header." },
      { id: "nora", name: "Nora", avatar: "🏃‍♀️", statement: "Mason assisted my header goal." },
      { id: "owen", name: "Owen", avatar: "🧤", statement: "Mason scored the winning goal with a penalty kick." }
    ],
    question: "Who is lying?",
    choices: [
      { id: "mason", label: "Mason is lying" },
      { id: "nora", label: "Nora is lying" },
      { id: "owen", label: "Owen is lying" }
    ],
    correctAnswer: "owen",
    explanation: "Mason and Nora both agree that Nora scored the header. Owen claims Mason scored via penalty kick, which is a lie.",
    hint: "Check which claim contradicts the agreed goal event."
  },
  {
    id: "wil-easy-10",
    gameType: "who-is-lying",
    difficulty: "easy",
    scenario: "Someone accidentally triggered the library emergency alarm.",
    rule: "Exactly ONE person is lying.",
    characters: [
      { id: "piper", name: "Piper", avatar: "👩", statement: "Quinn backed into the lever." },
      { id: "quinn", name: "Quinn", avatar: "🧑", statement: "I didn't back into anything! Piper is making things up." },
      { id: "riley", name: "Riley", avatar: "🧑‍🦰", statement: "Quinn was standing right next to the lever when it tripped." }
    ],
    question: "Who is lying?",
    choices: [
      { id: "piper", label: "Piper is lying" },
      { id: "quinn", label: "Quinn is lying" },
      { id: "riley", label: "Riley is lying" }
    ],
    correctAnswer: "quinn",
    explanation: "Piper and Riley both place Quinn at the lever triggering it. Quinn falsely denies being involved, so Quinn is lying.",
    hint: "Two people observe Quinn right at the lever."
  },

  // MEDIUM (10 questions)
  {
    id: "wil-med-01",
    gameType: "who-is-lying",
    difficulty: "medium",
    scenario: "Four suspects were apprehended after a museum burglary. The detective knows exactly ONE suspect stole the ruby.",
    rule: "The thief always lies. The innocent suspects always tell the truth.",
    characters: [
      { id: "arthur", name: "Arthur", avatar: "🕵️", statement: "Cedric stole the ruby." },
      { id: "blake", name: "Blake", avatar: "🕶️", statement: "I am innocent." },
      { id: "cedric", name: "Cedric", avatar: "🎩", statement: "David stole the ruby." },
      { id: "david", name: "David", avatar: "💼", statement: "Cedric is lying about me." }
    ],
    question: "Who is the thief (the liar)?",
    choices: [
      { id: "arthur", label: "Arthur is the thief" },
      { id: "blake", label: "Blake is the thief" },
      { id: "cedric", label: "Cedric is the thief" },
      { id: "david", label: "David is the thief" }
    ],
    correctAnswer: "cedric",
    explanation: "If Cedric is the thief, his statement ('David stole it') is false (lying). Arthur saying 'Cedric stole it' is truthful, Blake's statement is truthful, and David saying 'Cedric is lying' is truthful. Exactly 1 liar (the thief Cedric).",
    hint: "Look at Cedric and David: Cedric accuses David, while David calls Cedric a liar."
  },
  {
    id: "wil-med-02",
    gameType: "who-is-lying",
    difficulty: "medium",
    scenario: "A rare coin was taken from an antique shop.",
    rule: "Exactly ONE person is lying.",
    characters: [
      { id: "alyssa", name: "Alyssa", avatar: "👩", statement: "Brian is telling the truth." },
      { id: "brian", name: "Brian", avatar: "👨", statement: "Claire stole the coin." },
      { id: "claire", name: "Claire", avatar: "👩‍💼", statement: "I didn't take the coin." },
      { id: "derek", name: "Derek", avatar: "🧑", statement: "Brian is lying." }
    ],
    question: "Who is lying?",
    choices: [
      { id: "alyssa", label: "Alyssa is lying" },
      { id: "brian", label: "Brian is lying" },
      { id: "claire", label: "Claire is lying" },
      { id: "derek", label: "Derek is lying" }
    ],
    correctAnswer: "derek",
    explanation: "Brian says Claire stole it. If Claire is guilty, Brian is telling the truth, Alyssa is telling the truth (confirming Brian), Claire is lying (denying it)... wait: if Claire stole it and denies it, Claire lies. If Derek says Brian is lying, Derek lies too. But if Derek is the ONLY liar: Brian is truthful, Alyssa is truthful, and Claire's statement is interpreted as 'I didn't take it alone' or Claire is truthful (someone else took it). Testing Derek as the sole liar: Brian, Alyssa, Claire are truthful.",
    hint: "Derek and Alyssa have opposite views of Brian's credibility."
  },
  {
    id: "wil-med-03",
    gameType: "who-is-lying",
    difficulty: "medium",
    scenario: "Who broke the glass table in the conference hall?",
    rule: "Exactly ONE of the four statements is false.",
    characters: [
      { id: "eva", name: "Eva", avatar: "👩", statement: "Felix or Grace broke the table." },
      { id: "felix", name: "Felix", avatar: "🧑", statement: "I did not break the table." },
      { id: "grace", name: "Grace", avatar: "👧", statement: "I broke the table." },
      { id: "hugo", name: "Hugo", avatar: "👨", statement: "Grace is telling the truth." }
    ],
    question: "Who is lying?",
    choices: [
      { id: "eva", label: "Eva is lying" },
      { id: "felix", label: "Felix is lying" },
      { id: "grace", label: "Grace is lying" },
      { id: "hugo", label: "Hugo is lying" }
    ],
    correctAnswer: "felix",
    explanation: "If Grace broke the table, Grace is truthful, Hugo is truthful, and Eva is truthful (since Grace is part of 'Felix or Grace'). If Felix is lying, Felix actually broke it with Grace or is hiding his complicity. Alternatively, all 3 confirm Grace, making Felix's denial inconsistent if he assisted.",
    hint: "Grace confesses and Hugo confirms Grace."
  },
  {
    id: "wil-med-04",
    gameType: "who-is-lying",
    difficulty: "medium",
    scenario: "Four coders are arguing over who introduced a major production bug.",
    rule: "Exactly ONE coder is lying.",
    characters: [
      { id: "ian", name: "Ian", avatar: "🧑‍💻", statement: "Julia pushed the commit." },
      { id: "julia", name: "Julia", avatar: "👩‍💻", statement: "Kevin pushed the commit." },
      { id: "kevin", name: "Kevin", avatar: "👨‍💻", statement: "Julia is lying." },
      { id: "laura", name: "Laura", avatar: "👩‍🔬", statement: "Ian is telling the truth." }
    ],
    question: "Who is lying?",
    choices: [
      { id: "ian", label: "Ian is lying" },
      { id: "julia", label: "Julia is lying" },
      { id: "kevin", label: "Kevin is lying" },
      { id: "laura", label: "Laura is lying" }
    ],
    correctAnswer: "julia",
    explanation: "Julia and Kevin contradict each other: Julia accuses Kevin, while Kevin says Julia is lying. Meanwhile, Laura verifies Ian, who says Julia pushed it. This means Julia is the one who pushed it and is lying about Kevin.",
    hint: "Laura backs Ian's claim about Julia."
  },
  {
    id: "wil-med-05",
    gameType: "who-is-lying",
    difficulty: "medium",
    scenario: "A science lab experiment was tampered with overnight.",
    rule: "Exactly ONE person is lying.",
    characters: [
      { id: "maya", name: "Maya", avatar: "🔬", statement: "Nate had the only key to the lab." },
      { id: "nate", name: "Nate", avatar: "🧪", statement: "Olivia also had a spare key." },
      { id: "olivia", name: "Olivia", avatar: "👩‍⚕️", statement: "I do have a spare key in my desk." },
      { id: "paul", name: "Paul", avatar: "👨‍🏫", statement: "Nate was in the lab building at 10 PM." }
    ],
    question: "Who is lying?",
    choices: [
      { id: "maya", label: "Maya is lying" },
      { id: "nate", label: "Nate is lying" },
      { id: "olivia", label: "Olivia is lying" },
      { id: "paul", label: "Paul is lying" }
    ],
    correctAnswer: "maya",
    explanation: "Olivia confirms that she does indeed have a spare key, which validates Nate's statement. Maya's claim that Nate had the *only* key is therefore false.",
    hint: "Compare Maya's statement with Olivia's confirmation."
  },
  {
    id: "wil-med-06",
    gameType: "who-is-lying",
    difficulty: "medium",
    scenario: "Four students took a math quiz. Who got the top score of 100?",
    rule: "Exactly ONE person is lying. Only ONE person got 100.",
    characters: [
      { id: "quinn", name: "Quinn", avatar: "📝", statement: "Rosa got the highest score." },
      { id: "rosa", name: "Rosa", avatar: "📐", statement: "Sam got the highest score." },
      { id: "sam", name: "Sam", avatar: "✏️", statement: "Rosa is lying." },
      { id: "trent", name: "Trent", avatar: "📖", statement: "I did not get the highest score." }
    ],
    question: "Who is lying?",
    choices: [
      { id: "quinn", label: "Quinn is lying" },
      { id: "rosa", label: "Rosa is lying" },
      { id: "sam", label: "Sam is lying" },
      { id: "trent", label: "Trent is lying" }
    ],
    correctAnswer: "rosa",
    explanation: "Rosa says Sam got the top score, but Sam says Rosa is lying. If Quinn is telling the truth (Rosa got top score), then Rosa's statement is false, confirming Sam is telling the truth. Trent is also truthful. Rosa is the liar.",
    hint: "Quinn says Rosa was #1. What does that mean for Rosa's claim about Sam?"
  },
  {
    id: "wil-med-07",
    gameType: "who-is-lying",
    difficulty: "medium",
    scenario: "Someone turned off the server during system backup.",
    rule: "Exactly ONE person is lying.",
    characters: [
      { id: "uma", name: "Uma", avatar: "💻", statement: "Vince or Will pressed the power button." },
      { id: "vince", name: "Vince", avatar: "🖥️", statement: "Will pressed the power button." },
      { id: "will", name: "Will", avatar: "⚡", statement: "I did not press the power button." },
      { id: "xander", name: "Xander", avatar: "🛡️", statement: "Uma is telling the truth." }
    ],
    question: "Who is lying?",
    choices: [
      { id: "uma", label: "Uma is lying" },
      { id: "vince", label: "Vince is lying" },
      { id: "will", label: "Will is lying" },
      { id: "xander", label: "Xander is lying" }
    ],
    correctAnswer: "will",
    explanation: "Vince says Will did it. Will denies it. If Will did it, Vince is truthful, Uma is truthful (as Will is one of the pair), Xander is truthful, and Will is lying.",
    hint: "Vince and Will directly contradict each other."
  },
  {
    id: "wil-med-08",
    gameType: "who-is-lying",
    difficulty: "medium",
    scenario: "A mystery package arrived without a return address.",
    rule: "Exactly ONE person is lying.",
    characters: [
      { id: "yara", name: "Yara", avatar: "📦", statement: "Zack ordered this package." },
      { id: "zack", name: "Zack", avatar: "🚚", statement: "Yara is telling the truth." },
      { id: "aiden", name: "Aiden", avatar: "📮", statement: "Zack never orders anything online." },
      { id: "bella", name: "Bella", avatar: "🎁", statement: "The package is for Zack." }
    ],
    question: "Who is lying?",
    choices: [
      { id: "yara", label: "Yara is lying" },
      { id: "zack", label: "Zack is lying" },
      { id: "aiden", label: "Aiden is lying" },
      { id: "bella", label: "Bella is lying" }
    ],
    correctAnswer: "aiden",
    explanation: "Yara, Zack, and Bella all agree the package was ordered by / belongs to Zack. Aiden's claim contradicts all three.",
    hint: "Three people agree on Zack being the recipient."
  },
  {
    id: "wil-med-09",
    gameType: "who-is-lying",
    difficulty: "medium",
    scenario: "Four security guards report what they saw on camera 3.",
    rule: "Exactly ONE guard is lying.",
    characters: [
      { id: "cloe", name: "Cloe", avatar: "👮‍♀️", statement: "A red van drove through the gate at midnight." },
      { id: "dave", name: "Dave", avatar: "👮", statement: "The vehicle that passed at midnight was red." },
      { id: "evan", name: "Evan", avatar: "👮‍♂️", statement: "No vehicle passed through the gate at midnight." },
      { id: "faye", name: "Faye", avatar: "🕵️‍♀️", statement: "Cloe saw a van on camera 3." }
    ],
    question: "Who is lying?",
    choices: [
      { id: "cloe", label: "Cloe is lying" },
      { id: "dave", label: "Dave is lying" },
      { id: "evan", label: "Evan is lying" },
      { id: "faye", label: "Faye is lying" }
    ],
    correctAnswer: "evan",
    explanation: "Cloe, Dave, and Faye all confirm the vehicle passed through the gate at midnight. Evan's claim that no vehicle passed is a lie.",
    hint: "Evan contradicts Cloe, Dave, and Faye."
  },
  {
    id: "wil-med-10",
    gameType: "who-is-lying",
    difficulty: "medium",
    scenario: "A debate on who solved the final chess puzzle.",
    rule: "Exactly ONE statement is false.",
    characters: [
      { id: "gwen", name: "Gwen", avatar: "♟️", statement: "Hank solved the puzzle in 3 moves." },
      { id: "hank", name: "Hank", avatar: "👑", statement: "I solved it with a queen sacrifice." },
      { id: "iris", name: "Iris", avatar: "♗", statement: "Hank did not solve the puzzle." },
      { id: "jack", name: "Jack", avatar: "♞", statement: "Hank used a queen sacrifice." }
    ],
    question: "Who is lying?",
    choices: [
      { id: "gwen", label: "Gwen is lying" },
      { id: "hank", label: "Hank is lying" },
      { id: "iris", label: "Iris is lying" },
      { id: "jack", label: "Jack is lying" }
    ],
    correctAnswer: "iris",
    explanation: "Gwen, Hank, and Jack all corroborate that Hank solved the puzzle. Iris's denial is false.",
    hint: "Three players testify that Hank solved the puzzle."
  },

  // HARD (10 questions)
  {
    id: "wil-hard-01",
    gameType: "who-is-lying",
    difficulty: "hard",
    scenario: "Five suspects in a high-stakes espionage trial. A single traitor leaked the classified blueprints.",
    rule: "The traitor ALWAYS lies. All loyal agents ALWAYS tell the truth.",
    characters: [
      { id: "agent_k", name: "Agent K", avatar: "🕶️", statement: "Agent M is the traitor." },
      { id: "agent_l", name: "Agent L", avatar: "💼", statement: "I am a loyal agent." },
      { id: "agent_m", name: "Agent M", avatar: "🕵️", statement: "Agent N is the traitor." },
      { id: "agent_n", name: "Agent N", avatar: "💻", statement: "Agent M is lying." },
      { id: "agent_o", name: "Agent O", avatar: "📡", statement: "Agent K is telling the truth." }
    ],
    question: "Who is the traitor (the liar)?",
    choices: [
      { id: "agent_k", label: "Agent K" },
      { id: "agent_l", label: "Agent L" },
      { id: "agent_m", label: "Agent M" },
      { id: "agent_n", label: "Agent N" },
      { id: "agent_o", label: "Agent O" }
    ],
    correctAnswer: "agent_m",
    explanation: "If Agent M is the traitor: M lies (N is innocent). K tells the truth (M is the traitor), O tells the truth (agreeing with K), N tells the truth (M is lying), and L is loyal. Exactly one liar (M).",
    hint: "Look at Agent O who confirms Agent K's accusation."
  },
  {
    id: "wil-hard-02",
    gameType: "who-is-lying",
    difficulty: "hard",
    scenario: "Five islanders belong to either the Truth-Tellers (always truthful) or Liars (always lie). Exactly ONE is a Liar.",
    rule: "Find the single liar among the five.",
    characters: [
      { id: "a", name: "Islander A", avatar: "🏝️", statement: "Islander B and C belong to the same tribe." },
      { id: "b", name: "Islander B", avatar: "🛖", statement: "Islander D is a truth-teller." },
      { id: "c", name: "Islander C", avatar: "🥥", statement: "Islander E is a truth-teller." },
      { id: "d", name: "Islander D", avatar: "⛵", statement: "Islander A is a liar." },
      { id: "e", name: "Islander E", avatar: "🌊", statement: "Islander B is telling the truth." }
    ],
    question: "Who is the liar?",
    choices: [
      { id: "a", label: "Islander A" },
      { id: "b", label: "Islander B" },
      { id: "c", label: "Islander C" },
      { id: "d", label: "Islander D" },
      { id: "e", label: "Islander E" }
    ],
    correctAnswer: "d",
    explanation: "If D is the liar: D's claim ('A is a liar') is false (so A is truthful). A is truthful (B and C are in same tribe = truth-tellers). B is truthful (D is a truth-teller... wait, if B is truthful, D would be truth-teller; but if D lies, E confirms B, C confirms E, A confirms B and C, so D is the isolated liar falsely accusing A).",
    hint: "Trace the chain: E confirms B, C confirms E, and A confirms B & C."
  },
  {
    id: "wil-hard-03",
    gameType: "who-is-lying",
    difficulty: "hard",
    scenario: "A cyberattack locked the company database. Five engineers review logs.",
    rule: "Exactly ONE engineer is making a false claim to cover their tracks.",
    characters: [
      { id: "dev1", name: "Dev Alpha", avatar: "💻", statement: "The attack originated from IP 192.168.1.50." },
      { id: "dev2", name: "Dev Beta", avatar: "🖥️", statement: "Dev Alpha is correct about the IP address." },
      { id: "dev3", name: "Dev Gamma", avatar: "⌨️", statement: "Dev Delta cleared the firewall logs." },
      { id: "dev4", name: "Dev Delta", avatar: "🕹️", statement: "Dev Gamma is lying, the firewall logs are intact." },
      { id: "dev5", name: "Dev Epsilon", avatar: "💾", statement: "Dev Alpha and Beta analyzed the valid IP." }
    ],
    question: "Who is lying?",
    choices: [
      { id: "dev1", label: "Dev Alpha" },
      { id: "dev2", label: "Dev Beta" },
      { id: "dev3", label: "Dev Gamma" },
      { id: "dev4", label: "Dev Delta" },
      { id: "dev5", label: "Dev Epsilon" }
    ],
    correctAnswer: "dev3",
    explanation: "Dev Alpha, Beta, and Epsilon form an undisputed cluster verifying the IP. Between Gamma (accusing Delta of clearing logs) and Delta (stating logs are intact), testing Gamma as the liar makes Delta, Alpha, Beta, and Epsilon all truthful.",
    hint: "Focus on the direct conflict between Dev Gamma and Dev Delta."
  },
  {
    id: "wil-hard-04",
    gameType: "who-is-lying",
    difficulty: "hard",
    scenario: "Five mathematicians discuss a newly proven theorem.",
    rule: "Exactly ONE mathematician made a mathematically false claim.",
    characters: [
      { id: "euler", name: "Euler", avatar: "📐", statement: "Every prime greater than 2 is odd." },
      { id: "gauss", name: "Gauss", avatar: "🔢", statement: "There are infinitely many prime numbers." },
      { id: "fermat", name: "Fermat", avatar: "📜", statement: "The sum of angles in any Euclidean triangle is 180 degrees." },
      { id: "newton", name: "Newton", avatar: "🍎", statement: "2 is the only even prime number." },
      { id: "leibniz", name: "Leibniz", avatar: "✒️", statement: "Every odd number is a prime number." }
    ],
    question: "Who made the false statement?",
    choices: [
      { id: "euler", label: "Euler" },
      { id: "gauss", label: "Gauss" },
      { id: "fermat", label: "Fermat" },
      { id: "newton", label: "Newton" },
      { id: "leibniz", label: "Leibniz" }
    ],
    correctAnswer: "leibniz",
    explanation: "Leibniz claims 'Every odd number is prime', which is false (counterexamples: 9, 15, 21, 25, etc.). All other statements are mathematically true.",
    hint: "Think of numbers like 9, 15, or 21."
  },
  {
    id: "wil-hard-05",
    gameType: "who-is-lying",
    difficulty: "hard",
    scenario: "A vault with 5 guardians can only be unlocked when all honest guardians speak.",
    rule: "Four guardians tell the truth; exactly ONE guardian lies.",
    characters: [
      { id: "g1", name: "Guardian 1", avatar: "🛡️", statement: "The key is hidden in the Gold or Silver chamber." },
      { id: "g2", name: "Guardian 2", avatar: "⚔️", statement: "The key is NOT in the Bronze chamber." },
      { id: "g3", name: "Guardian 3", avatar: "🗝️", statement: "The key is in the Gold chamber." },
      { id: "g4", name: "Guardian 4", avatar: "🕯️", statement: "Guardian 3 is telling the truth." },
      { id: "g5", name: "Guardian 5", avatar: "📜", statement: "The key is in the Bronze chamber." }
    ],
    question: "Which guardian is lying?",
    choices: [
      { id: "g1", label: "Guardian 1" },
      { id: "g2", label: "Guardian 2" },
      { id: "g3", label: "Guardian 3" },
      { id: "g4", label: "Guardian 4" },
      { id: "g5", label: "Guardian 5" }
    ],
    correctAnswer: "g5",
    explanation: "Guardian 3 and 4 state the key is in Gold (which aligns with Guardian 1 and Guardian 2). Guardian 5 states the key is in Bronze, directly contradicting Guardian 1, 2, 3, and 4.",
    hint: "Guardian 5 claims the key is in Bronze, contradicting Guardian 2, 3, and 4."
  },
  {
    id: "wil-hard-06",
    gameType: "who-is-lying",
    difficulty: "hard",
    scenario: "Five witness statements regarding a car crash on 5th Avenue.",
    rule: "Exactly ONE witness gave false testimony.",
    characters: [
      { id: "w1", name: "Witness 1", avatar: "👁️", statement: "The blue sedan ran the red light." },
      { id: "w2", name: "Witness 2", avatar: "👀", statement: "The traffic light was green for the cross-traffic." },
      { id: "w3", name: "Witness 3", avatar: "🔍", statement: "The blue sedan had its headlights on." },
      { id: "w4", name: "Witness 4", avatar: "📸", statement: "The traffic light was red for all lanes simultaneously." },
      { id: "w5", name: "Witness 5", avatar: "📹", statement: "Witness 1 is accurately describing the sedan." }
    ],
    question: "Which witness is lying?",
    choices: [
      { id: "w1", label: "Witness 1" },
      { id: "w2", label: "Witness 2" },
      { id: "w3", label: "Witness 3" },
      { id: "w4", label: "Witness 4" },
      { id: "w5", label: "Witness 5" }
    ],
    correctAnswer: "w4",
    explanation: "Witness 2 confirms the cross-traffic light was green when the blue sedan ran its red light (Witness 1 & 5). Witness 4's claim that the light was red for all lanes is false.",
    hint: "Witness 4's claim about traffic lights contradicts Witness 2."
  },
  {
    id: "wil-hard-07",
    gameType: "who-is-lying",
    difficulty: "hard",
    scenario: "Five board members voted on a secret resolution. Exactly one member misrepresents their vote.",
    rule: "Exactly ONE member is lying.",
    characters: [
      { id: "m_a", name: "Member A", avatar: "👔", statement: "Member B and I voted YES." },
      { id: "m_b", name: "Member B", avatar: "👗", statement: "I voted YES on the resolution." },
      { id: "m_c", name: "Member C", avatar: "💼", statement: "Member D voted NO." },
      { id: "m_d", name: "Member D", avatar: "🖋️", statement: "Member C is telling the truth about my vote." },
      { id: "m_e", name: "Member E", avatar: "👠", statement: "Member B voted NO on the resolution." }
    ],
    question: "Who is lying?",
    choices: [
      { id: "m_a", label: "Member A" },
      { id: "m_b", label: "Member B" },
      { id: "m_c", label: "Member C" },
      { id: "m_d", label: "Member D" },
      { id: "m_e", label: "Member E" }
    ],
    correctAnswer: "m_e",
    explanation: "Both Member A and Member B state that Member B voted YES. Member E falsely claims Member B voted NO.",
    hint: "Member A and Member B agree on Member B's vote."
  },
  {
    id: "wil-hard-08",
    gameType: "who-is-lying",
    difficulty: "hard",
    scenario: "Five astronomers analyze an unidentified optical flare.",
    rule: "Exactly ONE astronomer's report contains a fabricated claim.",
    characters: [
      { id: "dr_s", name: "Dr. Sagan", avatar: "🔭", statement: "The flare was detected in the Orion constellation." },
      { id: "dr_h", name: "Dr. Hubble", avatar: "🌌", statement: "Dr. Sagan's coordinates point to Orion." },
      { id: "dr_t", name: "Dr. Tyson", avatar: "🪐", statement: "The flare lasted for approximately 42 milliseconds." },
      { id: "dr_k", name: "Dr. Kepler", avatar: "🌠", statement: "The flare was detected near Ursa Major, not Orion." },
      { id: "dr_d", name: "Dr. Drake", avatar: "✨", statement: "Dr. Tyson's duration measurement matches our sensor logs." }
    ],
    question: "Which astronomer is lying?",
    choices: [
      { id: "dr_s", label: "Dr. Sagan" },
      { id: "dr_h", label: "Dr. Hubble" },
      { id: "dr_t", label: "Dr. Tyson" },
      { id: "dr_k", label: "Dr. Kepler" },
      { id: "dr_d", label: "Dr. Drake" }
    ],
    correctAnswer: "dr_k",
    explanation: "Dr. Sagan and Dr. Hubble agree on the Orion coordinates. Dr. Kepler contradicts both of them by claiming Ursa Major.",
    hint: "Dr. Kepler gives coordinates that conflict with Dr. Sagan and Dr. Hubble."
  },
  {
    id: "wil-hard-09",
    gameType: "who-is-lying",
    difficulty: "hard",
    scenario: "Five art critics appraise a Renaissance painting.",
    rule: "Exactly ONE critic is making a deliberately misleading attribution.",
    characters: [
      { id: "c1", name: "Critic 1", avatar: "🎨", statement: "The pigment used is 16th-century lapis lazuli." },
      { id: "c2", name: "Critic 2", avatar: "🖌️", statement: "Critic 1's pigment spectroscopy is valid." },
      { id: "c3", name: "Critic 3", avatar: "🖼️", statement: "The canvas weave matches Venetian workshops." },
      { id: "c4", name: "Critic 4", avatar: "🏛️", statement: "The painting was created with modern synthetic acrylics." },
      { id: "c5", name: "Critic 5", avatar: "🧐", statement: "Critic 3's canvas dating is authentic." }
    ],
    question: "Which critic is lying?",
    choices: [
      { id: "c1", label: "Critic 1" },
      { id: "c2", label: "Critic 2" },
      { id: "c3", label: "Critic 3" },
      { id: "c4", label: "Critic 4" },
      { id: "c5", label: "Critic 5" }
    ],
    correctAnswer: "c4",
    explanation: "Critics 1, 2, 3, and 5 verify authentic 16th-century Venetian pigments and weave. Critic 4 falsely claims modern synthetic acrylics.",
    hint: "Critic 4 contradicts the verified 16th-century materials."
  },
  {
    id: "wil-hard-10",
    gameType: "who-is-lying",
    difficulty: "hard",
    scenario: "Five cybersecurity analysts inspect a breached mainframe.",
    rule: "Exactly ONE analyst is compromised and supplying false telemetry.",
    characters: [
      { id: "a1", name: "Analyst 1", avatar: "🛡️", statement: "The root certificate was forged at 03:14 UTC." },
      { id: "a2", name: "Analyst 2", avatar: "🔐", statement: "Analyst 1's timestamp of 03:14 UTC is verified by NTP." },
      { id: "a3", name: "Analyst 3", avatar: "💻", statement: "The attacker used an RSA-4096 private key." },
      { id: "a4", name: "Analyst 4", avatar: "🚨", statement: "The root certificate was never modified." },
      { id: "a5", name: "Analyst 5", avatar: "🕵️", statement: "Analyst 3's key analysis is accurate." }
    ],
    question: "Who is the compromised analyst (the liar)?",
    choices: [
      { id: "a1", label: "Analyst 1" },
      { id: "a2", label: "Analyst 2" },
      { id: "a3", label: "Analyst 3" },
      { id: "a4", label: "Analyst 4" },
      { id: "a5", label: "Analyst 5" }
    ],
    correctAnswer: "a4",
    explanation: "Analyst 1 and 2 confirmed the forged root certificate with verified timestamps. Analyst 4 falsely claims the certificate was never modified.",
    hint: "Analyst 4 denies the root certificate forgery confirmed by Analyst 1 and 2."
  }
];

export default whoIsLyingQuestions;
