export const solveCrimeQuestions = [
  // EASY (10 cases / questions)
  {
    id: "sc-easy-01",
    gameType: "solve-crime",
    difficulty: "easy",
    title: "The Vanishing Emerald Necklace",
    subtitle: "A high-society gala interrupted by a blackout and a brazen theft.",
    coverEmoji: "💎",
    xpReward: 40,
    crimeDescription: "During Lady Kensington's 50th birthday gala, the ballroom chandeliers plunged into darkness for precisely 45 seconds at 9:15 PM. When the emergency generators kicked in, her $250,000 Colombian emerald necklace was missing from the locked glass display case. The glass was cleanly sliced with a diamond cutter.",
    suspects: [
      { id: "charles", name: "Charles Vance", role: "Butler", avatar: "🤵", motive: "Gambling debts", statement: "I was serving champagne in the conservatory all evening.", suspicious: ["Found with glass dust on his velvet jacket", "Recently visited an underground pawn broker"] },
      { id: "victoria", name: "Victoria Sterling", role: "Rival Heiress", avatar: "💃", motive: "Social jealousy", statement: "I was screaming near the buffet table when the lights went out.", suspicious: ["Carried an oversized velvet clutch bag", "Argued loudly with the victim earlier"] },
      { id: "arthur", name: "Arthur Finch", role: "Electrician", avatar: "🔧", motive: "Underpaid contract", statement: "The circuit breaker tripped accidentally due to the catering ovens.", suspicious: ["Had a diamond-tipped engraving pen in his tool kit", "Switched off breaker deliberately"] }
    ],
    evidence: [
      { id: "ev1", title: "Diamond Cutter Tool", emoji: "🔪", type: "Physical", isKey: true, content: "A high-precision industrial glass-cutter found hidden in the basement fuse box with Arthur's initials." },
      { id: "ev2", title: "Glass Residue", emoji: "✨", type: "Trace", isKey: false, content: "Microscopic glass particles discovered on the butler's jacket." }
    ],
    timeline: [
      { time: "9:00 PM", event: "Gala speeches begin in the ballroom." },
      { time: "9:14 PM", event: "Arthur Finch enters the basement electrical room." },
      { time: "9:15 PM", event: "Total blackout hits the estate for 45 seconds." },
      { time: "9:16 PM", event: "Lights return; necklace display case is found cut and empty." }
    ],
    culpritChoices: [
      { id: "charles", label: "Charles Vance (The Butler)" },
      { id: "victoria", label: "Victoria Sterling (The Heiress)" },
      { id: "arthur", label: "Arthur Finch (The Electrician)" }
    ],
    motiveChoices: [
      { id: "greed", label: "Financial greed & contract exploitation" },
      { id: "revenge", label: "Personal vendetta and social rivalry" },
      { id: "blackmail", label: "Blackmail by underground syndicates" }
    ],
    question: "Who stole the emerald necklace?",
    options: ["Arthur Finch", "Charles Vance", "Victoria Sterling"],
    correctAnswer: "arthur",
    solution: "Arthur Finch caused the deliberate blackout from the basement, sprinted up the service stairs, sliced the glass case with his diamond-tipped glass cutter, and hid the tool in the fuse box.",
    explanation: "Arthur had direct control over the power grid, possessed the diamond glass-cutter in his tool kit, and was seen entering the basement right before the power cut.",
    hint: "Look at who had both the means to cut the power and the tool to cut display glass."
  },
  {
    id: "sc-easy-02",
    gameType: "solve-crime",
    difficulty: "easy",
    title: "The Midnight Bakery Heist",
    subtitle: "A secret artisanal sourdough recipe stolen from the master baker's safe.",
    coverEmoji: "🥖",
    xpReward: 40,
    crimeDescription: "Pierre's bakery was broken into at 2:00 AM. The antique vault containing the century-old sourdough starter and secret recipe book was unlocked with the master key.",
    suspects: [
      { id: "marco", name: "Marco Rossi", role: "Apprentice Baker", avatar: "👨‍🍳", motive: "Opening rival bakery", statement: "I went home at 11 PM and slept until 6 AM.", suspicious: ["Smelled strongly of fresh yeast when questioned", "Borrowed the master key yesterday"] },
      { id: "lucy", name: "Lucy Lin", role: "Cashier", avatar: "👩‍💼", motive: "Unpaid bonus", statement: "I was closing registers until 11:30 PM.", suspicious: ["Complained about pay"] }
    ],
    evidence: [
      { id: "ev1", title: "Flour Footprints", emoji: "👣", type: "Trace", isKey: true, content: "Size 10 non-slip kitchen clog prints coated in rye flour leading from the safe to the back door." }
    ],
    timeline: [
      { time: "11:00 PM", event: "Bakery closes for the night." },
      { time: "2:00 AM", event: "Back door opened with key; alarm bypassed." },
      { time: "2:10 AM", event: "Safe opened without forced entry." }
    ],
    culpritChoices: [
      { id: "marco", label: "Marco Rossi (Apprentice Baker)" },
      { id: "lucy", label: "Lucy Lin (Cashier)" }
    ],
    motiveChoices: [
      { id: "rivalry", label: "Stealing the secret formula to open a competing shop" },
      { id: "bonus", label: "Revenge over unpaid bonus" }
    ],
    question: "Who broke into the bakery safe?",
    options: ["Marco Rossi", "Lucy Lin"],
    correctAnswer: "marco",
    solution: "Marco Rossi used the borrowed master key to enter at 2 AM, left size 10 baker shoe prints in the flour, and stole the recipe to launch his own bakery.",
    explanation: "Marco had the master key, wore size 10 baker clogs, and smelled of yeast during his 6 AM interview despite claiming to have slept at home.",
    hint: "Check who had the master key and left footprints in the flour."
  },
  {
    id: "sc-easy-03",
    gameType: "solve-crime",
    difficulty: "easy",
    title: "The Stolen Lab Formula",
    subtitle: "A confidential pharmaceutical catalyst formula deleted from the server.",
    coverEmoji: "🧪",
    xpReward: 40,
    crimeDescription: "At 8:30 PM, the server room of BioTech Labs recorded a direct USB download of Project Chimera before the master drive was wiped.",
    suspects: [
      { id: "dr_kane", name: "Dr. Kane", role: "Lead Chemist", avatar: "👨‍🔬", motive: "Selling to competitor", statement: "I was at dinner with the board of directors.", suspicious: ["Badge swiped at server door at 8:28 PM", "Booked a one-way flight to Zurich"] },
      { id: "janice", name: "Janice Web", role: "Lab Tech", avatar: "👩‍🔬", motive: "Passed over for promotion", statement: "I was running centrifuge tests in Lab B.", suspicious: ["Logged in on terminal 4"] }
    ],
    evidence: [
      { id: "ev1", title: "Encrypted Flash Drive", emoji: "💾", type: "Digital", isKey: true, content: "A 128GB flash drive with Dr. Kane's initials dropped in the hallway bin." }
    ],
    timeline: [
      { time: "8:00 PM", event: "Dinner began downtown." },
      { time: "8:28 PM", event: "Dr. Kane's keycard accessed the server room." },
      { time: "8:30 PM", event: "USB transfer completed." }
    ],
    culpritChoices: [
      { id: "dr_kane", label: "Dr. Kane (Lead Chemist)" },
      { id: "janice", label: "Janice Web (Lab Tech)" }
    ],
    motiveChoices: [
      { id: "corporate_espionage", label: "Selling trade secrets for offshore millions" },
      { id: "promotion", label: "Frustration over promotion" }
    ],
    question: "Who stole the catalyst formula?",
    options: ["Dr. Kane", "Janice Web"],
    correctAnswer: "dr_kane",
    solution: "Dr. Kane slipped out from dinner, accessed the server room with his badge, downloaded the files to a USB drive, and planned his flight to Zurich.",
    explanation: "Dr. Kane's badge logged entry at 8:28 PM, his initials were on the dropped flash drive, and he held tickets for Zurich.",
    hint: "Look at the badge swipe timestamp and Zurich ticket."
  },
  {
    id: "sc-easy-04",
    gameType: "solve-crime",
    difficulty: "easy",
    title: "The Art Academy Forgery",
    subtitle: "An authentic classical oil canvas swapped for an amateur replica.",
    coverEmoji: "🎨",
    xpReward: 40,
    crimeDescription: "A priceless Dutch Master canvas in the university gallery was discovered to be a replica painted with modern acrylic paints.",
    suspects: [
      { id: "julian", name: "Julian Gray", role: "Restoration Student", avatar: "🧑‍🎨", motive: "Debt & fame", statement: "I only clean frames in the restoration wing.", suspicious: ["Purchased antique wood frame from flea market", "Fresh acrylic paint matching the fake under his fingernails"] },
      { id: "prof_ross", name: "Prof. Ross", role: "Art Historian", avatar: "👨‍🏫", motive: "Publishing credit", statement: "I inspected the painting last Friday.", suspicious: ["Noticed discrepancies early"] }
    ],
    evidence: [
      { id: "ev1", title: "Acrylic Paint Residue", emoji: "🖌️", type: "Trace", isKey: true, content: "Cobalt blue acrylic paint tubes matching the forgery found in Julian's studio locker." }
    ],
    timeline: [
      { time: "Thursday", event: "Julian assigned to clean painting frames." },
      { time: "Friday Night", event: "Canvas swapped in restoration room." },
      { time: "Monday Morning", event: "Forgery detected under UV light." }
    ],
    culpritChoices: [
      { id: "julian", label: "Julian Gray (Restoration Student)" },
      { id: "prof_ross", label: "Prof. Ross (Art Historian)" }
    ],
    motiveChoices: [
      { id: "black_market", label: "Selling original on the black market" },
      { id: "research", label: "Academic prestige" }
    ],
    question: "Who forged the Dutch Master canvas?",
    options: ["Julian Gray", "Prof. Ross"],
    correctAnswer: "julian",
    solution: "Julian Gray crafted the replica in his locker studio using acrylics and swapped it during his frame-cleaning duties.",
    explanation: "Julian had matching cobalt blue acrylic tubes, paint under his fingernails, and direct access during restoration hours.",
    hint: "Matching paint tubes were found in Julian's locker."
  },
  {
    id: "sc-easy-05",
    gameType: "solve-crime",
    difficulty: "easy",
    title: "The Yacht Club Sabotage",
    subtitle: "The rudder of the championship sailboat damaged before the regatta.",
    coverEmoji: "⛵",
    xpReward: 40,
    crimeDescription: "The favorite sailboat 'Sea Breeze' had its steering cables severed in the harbor slips at midnight.",
    suspects: [
      { id: "captain_kirk", name: "Kirk Douglas", role: "Rival Skipper", avatar: "🧑‍✈️", motive: "Winning regatta trophy", statement: "I was drinking at the clubhouse bar until closing.", suspicious: ["Carried heavy-duty cable wirecutters", "Left bar for 20 minutes at midnight"] },
      { id: "dockhand_sam", name: "Sam Brody", role: "Dockhand", avatar: "⚓", motive: "Work dispute", statement: "I was locking up the fuel dock.", suspicious: ["Seen near harbor"] }
    ],
    evidence: [
      { id: "ev1", title: "Heavy Wirecutters", emoji: "✂️", type: "Tool", isKey: true, content: "Wirecutters found in Kirk's locker with nylon cable strands matching Sea Breeze's steering system." }
    ],
    timeline: [
      { time: "11:30 PM", event: "Kirk enters clubhouse bar." },
      { time: "11:55 PM", event: "Kirk steps outside towards the docks." },
      { time: "12:15 AM", event: "Kirk returns to bar." }
    ],
    culpritChoices: [
      { id: "captain_kirk", label: "Kirk Douglas (Rival Skipper)" },
      { id: "dockhand_sam", label: "Sam Brody (Dockhand)" }
    ],
    motiveChoices: [
      { id: "cheating", label: "Eliminate top competitor to win the championship" },
      { id: "vandalism", label: "Random dock vandalism" }
    ],
    question: "Who cut the sailboat steering cables?",
    options: ["Kirk Douglas", "Sam Brody"],
    correctAnswer: "captain_kirk",
    solution: "Kirk Douglas snuck out of the bar during his 20-minute absence, severed the cables with his wirecutters, and returned to pretend he had an alibi.",
    explanation: "Kirk's wirecutters had matching cable strands, and he was missing from the bar during the exact window of sabotage.",
    hint: "Look at the 20-minute gap in Kirk's bar alibi and the wirecutters in his locker."
  },
  {
    id: "sc-easy-06",
    gameType: "solve-crime",
    difficulty: "easy",
    title: "The Stolen Rare Manuscript",
    subtitle: "A 15th-century Gutenberg Bible leaf stolen from the university archive.",
    coverEmoji: "📖",
    xpReward: 40,
    crimeDescription: "During the afternoon tour, a framed manuscript leaf was extracted from its humidity case with a razor blade.",
    suspects: [
      { id: "edward", name: "Edward Thorne", role: "Rare Book Collector", avatar: "🧐", motive: "Private collection obsession", statement: "I was taking notes near the history section.", suspicious: ["Carried a reinforced portfolio folder with manuscript dimensions", "Razor blade found in his coat pocket"] },
      { id: "fiona", name: "Fiona Gale", role: "Librarian", avatar: "👩‍🏫", motive: "Underfunded department", statement: "I was cataloguing microfilms upstairs.", suspicious: ["Had key to archive"] }
    ],
    evidence: [
      { id: "ev1", title: "Hardened Portfolio", emoji: "📁", type: "Physical", isKey: true, content: "Thorne's briefcase contained the manuscript leaf sealed inside acid-free plastic." }
    ],
    timeline: [
      { time: "2:00 PM", event: "Archive tour begins." },
      { time: "2:30 PM", event: "Thorne separates from tour group." },
      { time: "2:45 PM", event: "Empty display case discovered." }
    ],
    culpritChoices: [
      { id: "edward", label: "Edward Thorne (Collector)" },
      { id: "fiona", label: "Fiona Gale (Librarian)" }
    ],
    motiveChoices: [
      { id: "obsession", label: "Obsessive private acquisition" },
      { id: "resale", label: "Quick pawn resale" }
    ],
    question: "Who stole the Gutenberg manuscript leaf?",
    options: ["Edward Thorne", "Fiona Gale"],
    correctAnswer: "edward",
    solution: "Edward Thorne separated from the tour, sliced the parchment leaf with his pocket razor, and concealed it in his reinforced portfolio.",
    explanation: "The manuscript was recovered directly from Thorne's briefcase, and he carried the razor blade used to cut the framing.",
    hint: "The leaf was found inside Thorne's customized portfolio."
  },
  {
    id: "sc-easy-07",
    gameType: "solve-crime",
    difficulty: "easy",
    title: "The Antique Watch Robbery",
    subtitle: "A diamond-encrusted Swiss pocket watch stolen from an estate sale.",
    coverEmoji: "🕰️",
    xpReward: 40,
    crimeDescription: "During an open house auction preview, the Victorian pocket watch vanished from the master dresser.",
    suspects: [
      { id: "greg", name: "Greg Parker", role: "Antique Appraiser", avatar: "👓", motive: "Underestimating value to steal", statement: "I appraised the silverware downstairs all morning.", suspicious: ["Watch chain link caught in his jacket lining", "Lied about being upstairs"] },
      { id: "helen", name: "Helen Vance", role: "Buyer", avatar: "👜", motive: "Impulse theft", statement: "I was looking at the garden furniture.", suspicious: ["Carried large purse"] }
    ],
    evidence: [
      { id: "ev1", title: "Gold Chain Link", emoji: "⛓️", type: "Trace", isKey: true, content: "A broken 18k gold link from the watch chain snagged in Greg's tweed jacket pocket." }
    ],
    timeline: [
      { time: "10:00 AM", event: "Preview doors open." },
      { time: "10:45 AM", event: "Greg seen on upstairs hallway camera." },
      { time: "11:00 AM", event: "Watch reported missing." }
    ],
    culpritChoices: [
      { id: "greg", label: "Greg Parker (Appraiser)" },
      { id: "helen", label: "Helen Vance (Buyer)" }
    ],
    motiveChoices: [
      { id: "blackmarket", label: "Profiteering via black market antiquities" },
      { id: "collection", label: "Personal jewelry collection" }
    ],
    question: "Who stole the Victorian pocket watch?",
    options: ["Greg Parker", "Helen Vance"],
    correctAnswer: "greg",
    solution: "Greg snuck upstairs, pocketed the watch, accidentally snagged a gold chain link on his pocket lining, and lied about his location.",
    explanation: "Camera footage placed Greg upstairs, and the matching 18k gold chain link was recovered from his tweed jacket pocket.",
    hint: "Look at the gold link caught in Greg's tweed jacket."
  },
  {
    id: "sc-easy-08",
    gameType: "solve-crime",
    difficulty: "easy",
    title: "The Greenhouse Orchid Thefts",
    subtitle: "A botanical wonder 'Ghost Orchid' uprooted from the conservatory.",
    coverEmoji: "🌺",
    xpReward: 40,
    crimeDescription: "A prize-winning Ghost Orchid worth $10,000 was cleanly dug up from its climate-controlled terrarium overnight.",
    suspects: [
      { id: "ian", name: "Ian Fletcher", role: "Botanist Competitor", avatar: "🌿", motive: "Winning National Flower Show", statement: "I was writing my botany journal at home.", suspicious: ["Sphagnum moss soil traces on his gardening shears", "Discovered with orchid fertilizer in car trunk"] },
      { id: "clara", name: "Clara Green", role: "Gardener", avatar: "👩‍🌾", motive: "Owed back wages", statement: "I watered the roses at 6 PM.", suspicious: ["Had greenhouse keys"] }
    ],
    evidence: [
      { id: "ev1", title: "Sphagnum Moss Traces", emoji: "🌱", type: "Trace", isKey: true, content: "Rare volcanic orchid potting soil found on Ian's trowel and boots." }
    ],
    timeline: [
      { time: "8:00 PM", event: "Conservatory locked for night." },
      { time: "1:30 AM", event: "Motion sensors trigger briefly near terrarium." },
      { time: "6:00 AM", event: "Terrarium found empty." }
    ],
    culpritChoices: [
      { id: "ian", label: "Ian Fletcher (Botanist)" },
      { id: "clara", label: "Clara Green (Gardener)" }
    ],
    motiveChoices: [
      { id: "botany_fame", label: "Winning the National Flower Show" },
      { id: "money", label: "Selling to floral black market" }
    ],
    question: "Who stole the Ghost Orchid?",
    options: ["Ian Fletcher", "Clara Green"],
    correctAnswer: "ian",
    solution: "Ian broke in with specialized horticultural tools, uprooted the fragile orchid, and placed it in his climate-prepped vehicle trunk.",
    explanation: "Ian had the exact volcanic potting soil on his trowel and specialized orchid transport materials in his car.",
    hint: "Rare volcanic moss was detected on Ian's gardening trowel."
  },
  {
    id: "sc-easy-09",
    gameType: "solve-crime",
    difficulty: "easy",
    title: "The Stolen Thoroughbred Saddle",
    subtitle: "An Olympic champion equestrian saddle stolen from the stables.",
    coverEmoji: "🐎",
    xpReward: 40,
    crimeDescription: "The custom handcrafted leather saddle of racehorse 'Thunderbolt' was removed from the tack room before the derby.",
    suspects: [
      { id: "jake", name: "Jake Sterling", role: "Disgruntled Stablehand", avatar: "🤠", motive: "Fired yesterday", statement: "I was packing my bags at the local motel.", suspicious: ["Leather dye stains on his hands", "Tack room lock opened without scratches"] },
      { id: "mary", name: "Mary Bell", role: "Jockey", avatar: "🏇", motive: "Equipment dispute", statement: "I was jogging around the track.", suspicious: ["Argued over saddle fit"] }
    ],
    evidence: [
      { id: "ev1", title: "Custom Leather Wax", emoji: "🧽", type: "Chemical", isKey: true, content: "Saddle wax and leather dye traces found on Jake's gloves and motel room table." }
    ],
    timeline: [
      { time: "5:00 PM", event: "Jake fired by stable owner." },
      { time: "9:00 PM", event: "Tack room entered with duplicate key." },
      { time: "5:00 AM", event: "Saddle missing at morning warmup." }
    ],
    culpritChoices: [
      { id: "jake", label: "Jake Sterling (Stablehand)" },
      { id: "mary", label: "Mary Bell (Jockey)" }
    ],
    motiveChoices: [
      { id: "retaliation", label: "Retaliation for being fired" },
      { id: "sabotage", label: "Sabotaging the derby race" }
    ],
    question: "Who took the championship saddle?",
    options: ["Jake Sterling", "Mary Bell"],
    correctAnswer: "jake",
    solution: "Jake used his duplicate key to enter the tack room in revenge after being fired, hiding the saddle in his motel room.",
    explanation: "Jake had matching saddle wax and leather dye on his hands and gloves at his motel room.",
    hint: "Leather dye and saddle wax were found on Jake's hands."
  },
  {
    id: "sc-easy-10",
    gameType: "solve-crime",
    difficulty: "easy",
    title: "The Restaurant Safe Crack",
    subtitle: "Weekend cash revenue taken from the manager's office safe.",
    coverEmoji: "💰",
    xpReward: 40,
    crimeDescription: "$15,000 in cash receipts was taken from the floor safe at midnight. The safe combination was entered correctly on the first attempt.",
    suspects: [
      { id: "kyle", name: "Kyle Ortiz", role: "Assistant Manager", avatar: "👨‍🍳", motive: "Overdue car payments", statement: "I clocked out and went straight to a diner.", suspicious: ["Only person besides owner with combination", "Deposited $5,000 cash at ATM next morning"] },
      { id: "linda", name: "Linda Ross", role: "Head Waitress", avatar: "👩‍💼", motive: "Dispute over tips", statement: "I was counting tip pools in the dining room.", suspicious: ["Saw manager open safe earlier"] }
    ],
    evidence: [
      { id: "ev1", title: "ATM Deposit Slips", emoji: "🧾", type: "Financial", isKey: true, content: "Bank records showing Kyle depositing crisp sequential $100 bills at 8:00 AM." }
    ],
    timeline: [
      { time: "11:30 PM", event: "Restaurant closes." },
      { time: "11:45 PM", event: "Safe opened using valid combo." },
      { time: "8:00 AM", event: "Cash deposit made at local branch." }
    ],
    culpritChoices: [
      { id: "kyle", label: "Kyle Ortiz (Assistant Manager)" },
      { id: "linda", label: "Linda Ross (Head Waitress)" }
    ],
    motiveChoices: [
      { id: "debts", label: "Personal debt relief" },
      { id: "gambling", label: "Gambling payout" }
    ],
    question: "Who cracked the restaurant safe?",
    options: ["Kyle Ortiz", "Linda Ross"],
    correctAnswer: "kyle",
    solution: "Kyle used his known combination to empty the safe and immediately deposited the stolen sequential bills at the bank.",
    explanation: "Kyle knew the code, had no forced entry, and deposited the matching sequential bills the next morning.",
    hint: "Kyle made a huge sequential cash deposit early the next morning."
  },

  // MEDIUM (10 cases / questions)
  {
    id: "sc-med-01",
    gameType: "solve-crime",
    difficulty: "medium",
    title: "The Penthouse Poisoning",
    subtitle: "A billionaire tech investor collapses during a private rooftop dinner.",
    coverEmoji: "🍷",
    xpReward: 60,
    crimeDescription: "At 10:15 PM, venture capitalist Howard Vance suddenly seized and died after drinking vintage Merlot from his personal cellar. Autopsy reveals lethal cyanide administered inside the corked bottle.",
    suspects: [
      { id: "elena", name: "Elena Vance", role: "Wife & Sole Heir", avatar: "👠", motive: "$400M inheritance", statement: "Howard opened the bottle himself in front of me.", suspicious: ["Purchased cyanide under shell laboratory name", "Changed will clause 2 weeks ago"] },
      { id: "marcus", name: "Marcus Shaw", role: "Business Partner", avatar: "💼", motive: "Hostile takeover prevention", statement: "I arrived after dinner for coffee only.", suspicious: ["Argued over company buyout", "Seen near cellar door earlier"] },
      { id: "sommelier", name: "Jean-Luc", role: "Private Sommelier", avatar: "🍾", motive: "Fired yesterday", statement: "I selected the bottles at 5 PM and left.", suspicious: ["Syringe puncture hole detected in wine foil"] }
    ],
    evidence: [
      { id: "ev1", title: "Micro-Syringe Puncture", emoji: "💉", type: "Forensic", isKey: true, content: "Wine foil capsule showed a 0.3mm needle puncture used to inject cyanide into the vintage bottle before dinner." },
      { id: "ev2", title: "Digital Shell Company Invoice", emoji: "📄", type: "Financial", isKey: true, content: "Wire transfer from Elena's private bank account purchasing potassium cyanide from a darkweb supplier." }
    ],
    timeline: [
      { time: "5:00 PM", event: "Bottles brought up from cellar." },
      { time: "7:00 PM", event: "Elena prepares private rooftop table alone." },
      { time: "9:30 PM", event: "Howard opens and drinks the wine." },
      { time: "10:15 PM", event: "Howard collapses fatally." }
    ],
    culpritChoices: [
      { id: "elena", label: "Elena Vance (The Wife)" },
      { id: "marcus", label: "Marcus Shaw (The Partner)" },
      { id: "sommelier", label: "Jean-Luc (The Sommelier)" }
    ],
    motiveChoices: [
      { id: "inheritance", label: "$400M estate inheritance before divorce filing" },
      { id: "takeover", label: "Blocking corporate hostile takeover" },
      { id: "revenge", label: "Retaliation for being terminated" }
    ],
    question: "Who poisoned Howard Vance?",
    options: ["Elena Vance", "Marcus Shaw", "Jean-Luc"],
    correctAnswer: "elena",
    solution: "Elena Vance used a micro-syringe to inject potassium cyanide through the foil of the sealed wine bottle while setting the table, ensuring Howard would open the 'sealed' bottle himself.",
    explanation: "Financial trails linked Elena directly to the cyanide purchase, and she had exclusive private access to the bottles on the rooftop before Howard opened them.",
    hint: "Follow the darkweb cyanide purchase paper trail and table access."
  },
  {
    id: "sc-med-02",
    gameType: "solve-crime",
    difficulty: "medium",
    title: "The Museum Diamond Drill",
    subtitle: "A subterranean heist through the reinforced concrete floor of the vault.",
    coverEmoji: "💎",
    xpReward: 60,
    crimeDescription: "Over Easter weekend, thieves drilled through 3 feet of reinforced concrete from the abandoned subway tunnel beneath the Metropolitan Jewelers vault.",
    suspects: [
      { id: "victor", name: "Victor Stone", role: "Tunnel Engineer", avatar: "👷", motive: "Black market jewel syndicate", statement: "I was off-duty celebrating in the mountains.", suspicious: ["Possessed architectural subway blueprints", "Rented diamond coring drill under alias"] },
      { id: "renee", name: "Renee Blanc", role: "Vault Architect", avatar: "📐", motive: "Debt", statement: "I designed the vault 10 years ago.", suspicious: ["Shared vault floor thickness specs"] }
    ],
    evidence: [
      { id: "ev1", title: "Industrial Core Bit", emoji: "⚙️", type: "Tool", isKey: true, content: "A 450mm diamond coring bit covered in specific bedrock slurry found in Victor's storage lockup." }
    ],
    timeline: [
      { time: "Friday 8 PM", event: "Museum shuts for holiday weekend." },
      { time: "Saturday 3 AM", event: "Low frequency vibrations recorded on subway seismic sensors." },
      { time: "Sunday 11 PM", event: "Vault floor breached; 12 safe deposit boxes looted." }
    ],
    culpritChoices: [
      { id: "victor", label: "Victor Stone (Tunnel Engineer)" },
      { id: "renee", label: "Renee Blanc (Vault Architect)" }
    ],
    motiveChoices: [
      { id: "jewels", label: "Looting millions in uncut diamonds" },
      { id: "blackmail", label: "Syndicate coercion" }
    ],
    question: "Who executed the underground diamond drill heist?",
    options: ["Victor Stone", "Renee Blanc"],
    correctAnswer: "victor",
    solution: "Victor Stone used his subway tunnel access and rented diamond core drilling equipment to tunnel into the vault from below.",
    explanation: "The heavy industrial core drill and matching rock slurry were recovered directly from Victor's rented storage unit.",
    hint: "The diamond core bit with matching geological slurry was in Victor's lockup."
  },
  {
    id: "sc-med-03",
    gameType: "solve-crime",
    difficulty: "medium",
    title: "The Alibi of the Midnight Flight",
    subtitle: "A murder committed while the prime suspect appeared to be in mid-air.",
    coverEmoji: "✈️",
    xpReward: 60,
    crimeDescription: "Lord Blackwood was strangled in his study at 11:00 PM. His estranged son claimed to be on Flight 402 from London to Paris, showing a stamped boarding pass.",
    suspects: [
      { id: "son", name: "Julian Blackwood", role: "Son", avatar: "🤵", motive: "Title and estate", statement: "I was flying over the English Channel at 11:00 PM.", suspicious: ["Hired a body double to board the plane", "Security cameras caught his rental car near the manor at 10:50 PM"] },
      { id: "gardener", name: "Tom Croft", role: "Gardener", avatar: "🧑‍🌾", motive: "Boundary dispute", statement: "I was asleep in the cottage.", suspicious: ["Found near crime scene"] }
    ],
    evidence: [
      { id: "ev1", title: "Rental Car Toll Tag", emoji: "🚗", type: "Digital", isKey: true, content: "Electronic toll records showing Julian's rental car crossing the bridge near the manor at 10:48 PM." }
    ],
    timeline: [
      { time: "9:30 PM", event: "Flight 402 departs London with Julian's boarding pass." },
      { time: "10:48 PM", event: "Rental car crosses local toll bridge." },
      { time: "11:00 PM", event: "Lord Blackwood murdered." },
      { time: "11:15 PM", event: "Flight 402 touches down in Paris." }
    ],
    culpritChoices: [
      { id: "son", label: "Julian Blackwood (The Son)" },
      { id: "gardener", label: "Tom Croft (The Gardener)" }
    ],
    motiveChoices: [
      { id: "inheritance", label: "Inheriting the historic title and manor" },
      { id: "dispute", label: "Land dispute" }
    ],
    question: "Who killed Lord Blackwood?",
    options: ["Julian Blackwood", "Tom Croft"],
    correctAnswer: "son",
    solution: "Julian paid an accomplice to check in and board the Paris flight with his passport while he drove his rental car to the estate to commit the murder.",
    explanation: "Electronic toll logs placed Julian's rental car within 2 miles of the manor at 10:48 PM, debunking his fabricated flight alibi.",
    hint: "Electronic toll sensors captured his rental car near the manor."
  },
  {
    id: "sc-med-04",
    gameType: "solve-crime",
    difficulty: "medium",
    title: "The Theater Stage Prop Swap",
    subtitle: "A blank prop revolver replaced with live ammunition during Act 3.",
    coverEmoji: "🎭",
    xpReward: 60,
    crimeDescription: "During the climax of Macbeth, the lead actor was wounded when the prop pistol fired a real .38 caliber bullet on stage.",
    suspects: [
      { id: "understudy", name: "Damian Fox", role: "Understudy Actor", avatar: "🎭", motive: "Taking over the lead role on Broadway", statement: "I was backstage in wardrobe.", suspicious: ["Purchased .38 special ammunition yesterday", "Prop master saw him tampering with the lockbox"] },
      { id: "prop_master", name: "Gretchen", role: "Prop Master", avatar: "🎪", motive: "Negligence", statement: "I locked the gun box at 7 PM.", suspicious: ["Lost keys"] }
    ],
    evidence: [
      { id: "ev1", title: ".38 Ammo Receipt", emoji: "🧾", type: "Financial", isKey: true, content: "Credit card receipt for .38 hollow-point bullets signed by Damian Fox 24 hours prior." }
    ],
    timeline: [
      { time: "7:00 PM", event: "Prop guns loaded with theatrical blanks." },
      { time: "8:15 PM", event: "Damian seen near stage gun cabinet." },
      { time: "9:20 PM", event: "Act 3 duel scene; live round fired." }
    ],
    culpritChoices: [
      { id: "understudy", label: "Damian Fox (Understudy)" },
      { id: "prop_master", label: "Gretchen (Prop Master)" }
    ],
    motiveChoices: [
      { id: "broadway_lead", label: "Eliminating lead actor to take over the Broadway run" },
      { id: "accident", label: "Careless prop mistake" }
    ],
    question: "Who loaded the real bullet into the prop gun?",
    options: ["Damian Fox", "Gretchen"],
    correctAnswer: "understudy",
    solution: "Damian Fox swapped out the stage blank with a live .38 round he purchased yesterday, hoping to permanently take over the starring role.",
    explanation: "Damian purchased the ammunition 24 hours before the show, and eyewitnesses placed him tampering with the gun cabinet.",
    hint: "Damian had a credit card receipt for .38 bullets dated the day before."
  },
  {
    id: "sc-med-05",
    gameType: "solve-crime",
    difficulty: "medium",
    title: "The Cruise Ship Overboard",
    subtitle: "A wealthy casino tycoon vanishes from Deck 12 at 3:00 AM.",
    coverEmoji: "🚢",
    xpReward: 60,
    crimeDescription: "Casino mogul Roman Pierce vanished from his VIP balcony. Railing scuff marks and a broken watch band indicate a violent struggle before he was thrown overboard.",
    suspects: [
      { id: "captain", name: "Captain Sterling", role: "Captain", avatar: "🧑‍✈️", motive: "Smuggling coverup", statement: "I was on the bridge on autopilot watch.", suspicious: ["No personal motive"] },
      { id: "partner", name: "Nigel Kane", role: "Casino Co-owner", avatar: "🤵", motive: "$20M casino debt owed to victim", statement: "I was asleep in suite 1204.", suspicious: ["Scratches on his neck and forearms", "Security camera near balcony spray-painted at 2:45 AM"] }
    ],
    evidence: [
      { id: "ev1", title: "DNA Under Victim's Nails", emoji: "🧬", type: "Forensic", isKey: true, content: "Skin cell DNA scraped from Roman's fingernails matched Nigel Kane with 99.9% certainty." }
    ],
    timeline: [
      { time: "2:00 AM", event: "Roman and Nigel argue heatedly at the casino bar." },
      { time: "2:45 AM", event: "Deck 12 camera blinded with black spray paint." },
      { time: "3:00 AM", event: "Overboard splash recorded on hull acoustic sensors." }
    ],
    culpritChoices: [
      { id: "partner", label: "Nigel Kane (Co-owner)" },
      { id: "captain", label: "Captain Sterling" }
    ],
    motiveChoices: [
      { id: "debt", label: "Erasing $20M debt and taking sole casino control" },
      { id: "smuggling", label: "Maritime smuggling dispute" }
    ],
    question: "Who pushed Roman Pierce overboard?",
    options: ["Nigel Kane", "Captain Sterling"],
    correctAnswer: "partner",
    solution: "Nigel Kane blinded the camera, entered Roman's suite, fought him on the balcony, and hurled him overboard to cancel his $20M debt.",
    explanation: "Nigel had fresh defensive scratches, and DNA under Roman's fingernails conclusively matched Nigel.",
    hint: "DNA from under the victim's nails matched Nigel Kane."
  },
  {
    id: "sc-med-06",
    gameType: "solve-crime",
    difficulty: "medium",
    title: "The Clockmaker's Cryptic Will",
    subtitle: "A master horologist found deceased inside his locked clock tower.",
    coverEmoji: "🕰️",
    xpReward: 60,
    crimeDescription: "Old Master Hans was found poisoned inside his hermetically locked clock tower. The clock mechanism was altered to trigger a toxic gas vial at precisely 12:00.",
    suspects: [
      { id: "apprentice", name: "Klaus Webber", role: "Apprentice", avatar: "🧑‍🔧", motive: "Inheriting the clockworks and patents", statement: "I was repairing the village church clock all morning.", suspicious: ["Mechanical blueprint for timer trigger in his apron", "Church clock was found untouched"] },
      { id: "daughter", name: "Greta Hans", role: "Daughter", avatar: "👩", motive: "Family inheritance", statement: "I was at the bakery.", suspicious: ["Alibi confirmed"] }
    ],
    evidence: [
      { id: "ev1", title: "Modified Gear Trigger Blueprint", emoji: "📐", type: "Technical", isKey: true, content: "Drafting schematics matching the gas release clock escapement found with Klaus's handwriting." }
    ],
    timeline: [
      { time: "9:00 AM", event: "Klaus sets tower pendulum." },
      { time: "11:59 AM", event: "Timer trips escapement lever." },
      { time: "12:00 PM", event: "Gas released; master falls." }
    ],
    culpritChoices: [
      { id: "apprentice", label: "Klaus Webber (Apprentice)" },
      { id: "daughter", label: "Greta Hans (Daughter)" }
    ],
    motiveChoices: [
      { id: "patents", label: "Seizing valuable horological patents" },
      { id: "family", label: "Family estate dispute" }
    ],
    question: "Who rigged the clock mechanism?",
    options: ["Klaus Webber", "Greta Hans"],
    correctAnswer: "apprentice",
    solution: "Klaus Webber used his master mechanical skills to rig a delayed gas trigger to the 12:00 chime gear, giving himself a fake alibi.",
    explanation: "Klaus possessed the exact gear schematics and his church clock repair alibi was completely fabricated.",
    hint: "The custom gear schematics were drafted in Klaus's handwriting."
  },
  {
    id: "sc-med-07",
    gameType: "solve-crime",
    difficulty: "medium",
    title: "The Silent Substation Blackout",
    subtitle: "A metropolitan electrical grid sabotaged right before a bank vault heist.",
    coverEmoji: "⚡",
    xpReward: 60,
    crimeDescription: "A central power grid substation was blasted with EMP charges at 1:00 AM, knocking out city alarms for 20 miles.",
    suspects: [
      { id: "drake", name: "Drake Miller", role: "Ex-Military Tech", avatar: "🪖", motive: "Hired by heist syndicate", statement: "I was playing poker downtown.", suspicious: ["EMP coil remnants in his garage", "Encrypted radio tuned to police frequency"] },
      { id: "grid_worker", name: "Steve", role: "Grid Operator", avatar: "👷", motive: "Strike protest", statement: "I was monitoring gauges remotely.", suspicious: ["Left terminal"] }
    ],
    evidence: [
      { id: "ev1", title: "Military EMP Capacitor", emoji: "💣", type: "Weapons", isKey: true, content: "Blown capacitors from a surplus military EMP generator found in Drake's van." }
    ],
    timeline: [
      { time: "12:30 AM", event: "Drake's van spotted near substation perimeter." },
      { time: "1:00 AM", event: "EMP pulse detonates; city grid collapses." },
      { time: "1:05 AM", event: "Bank vault alarms disabled." }
    ],
    culpritChoices: [
      { id: "drake", label: "Drake Miller (Ex-Military Tech)" },
      { id: "grid_worker", label: "Steve (Operator)" }
    ],
    motiveChoices: [
      { id: "syndicate_payout", label: "Multi-million dollar syndicate contract" },
      { id: "labor_strike", label: "Labor union protest" }
    ],
    question: "Who detonated the EMP at the substation?",
    options: ["Drake Miller", "Steve"],
    correctAnswer: "drake",
    solution: "Drake Miller deployed military-grade EMP capacitors to wipe out grid power and disable security alarms for an affiliated heist crew.",
    explanation: "EMP capacitor remnants and van sightings at the perimeter conclusively pointed to Drake.",
    hint: "Military-grade EMP components were discovered in Drake's van."
  },
  {
    id: "sc-med-08",
    gameType: "solve-crime",
    difficulty: "medium",
    title: "The VIP Ski Chalet Avalanche",
    subtitle: "An avalanche triggered above an exclusive chalet with sonic charges.",
    coverEmoji: "🏔️",
    xpReward: 60,
    crimeDescription: "An avalanche wiped out the access road and garage of an alpine chalet. Sonic explosive residue was discovered on the upper ridge.",
    suspects: [
      { id: "guide", name: "Franz Becker", role: "Alpine Guide", avatar: "🎿", motive: "Blackmail payment refusal", statement: "I was at the lower resort hut checking ski rentals.", suspicious: ["Possessed commercial avalanche control blaster permits", "Snowmobile tracks match his vehicle exactly"] },
      { id: "tourist", name: "Hans", role: "Guest", avatar: "⛷️", motive: "Insurance scam", statement: "I was in the chalet lounge.", suspicious: ["Insured luxury car"] }
    ],
    evidence: [
      { id: "ev1", title: "Sonic Blaster Casing", emoji: "🧨", type: "Explosives", isKey: true, content: "Detonation cap stamped with Franz's state blasting permit ID recovered from the ridge." }
    ],
    timeline: [
      { time: "4:00 PM", event: "Snowmobile ascends northern ridge." },
      { time: "4:30 PM", event: "Sonic charge detonates." },
      { time: "4:32 PM", event: "Avalanche hits lower garage." }
    ],
    culpritChoices: [
      { id: "guide", label: "Franz Becker (Alpine Guide)" },
      { id: "tourist", label: "Hans (Guest)" }
    ],
    motiveChoices: [
      { id: "blackmail", label: "Retaliation after failed blackmail attempt" },
      { id: "insurance", label: "Luxury vehicle insurance fraud" }
    ],
    question: "Who triggered the sonic avalanche charges?",
    options: ["Franz Becker", "Hans"],
    correctAnswer: "guide",
    solution: "Franz Becker rode his snowmobile to the upper ridge, deployed his licensed sonic blasting charge, and triggered the slide.",
    explanation: "The recovered blasting cap carried Franz's licensed permit number, and his snowmobile tracks led directly to the ridge.",
    hint: "The explosive casing had Franz's state blasting permit stamp."
  },
  {
    id: "sc-med-09",
    gameType: "solve-crime",
    difficulty: "medium",
    title: "The Formula 1 Telemetry Hack",
    subtitle: "Brake-by-wire calibration wirelessly corrupted before the Grand Prix.",
    coverEmoji: "🏎️",
    xpReward: 60,
    crimeDescription: "During qualifying, driver #1 lost brake balance due to an unauthorized wireless firmware flash pushed over pit telemetry frequencies.",
    suspects: [
      { id: "engineer", name: "Sven Larson", role: "Telemetry Engineer", avatar: "💻", motive: "Bribed by competitor team", statement: "I was monitoring tire temperature channels.", suspicious: ["Secondary rogue Wi-Fi adapter hidden in his laptop bag", "$500,000 crypto transfer received at 2 PM"] },
      { id: "mechanic", name: "Tony", role: "Lead Mechanic", avatar: "🔧", motive: "Overworked", statement: "I was torquing wheel nuts.", suspicious: ["Had physical car access"] }
    ],
    evidence: [
      { id: "ev1", title: "Rogue Wi-Fi Sniffer", emoji: "📡", type: "Digital", isKey: true, content: "Packet logs showed Sven's MAC address transmitting unauthorized ECU commands to car #1." }
    ],
    timeline: [
      { time: "1:45 PM", event: "Car enters pit lane." },
      { time: "1:52 PM", event: "Rogue ECU packet flashed over telemetry." },
      { time: "2:05 PM", event: "Brake malfunction on turn 4." }
    ],
    culpritChoices: [
      { id: "engineer", label: "Sven Larson (Telemetry Engineer)" },
      { id: "mechanic", label: "Tony (Lead Mechanic)" }
    ],
    motiveChoices: [
      { id: "bribe", label: "Accepting $500,000 crypto bribe to sabotage race" },
      { id: "accident", label: "Accidental calibration error" }
    ],
    question: "Who hacked the Formula 1 car's brake balance?",
    options: ["Sven Larson", "Tony"],
    correctAnswer: "engineer",
    solution: "Sven Larson used a concealed wireless transmitter to overwrite the car's brake firmware in exchange for a massive crypto bribe.",
    explanation: "Packet capture logs identified Sven's MAC address transmitting the exploit packet, corroborating the $500k crypto deposit.",
    hint: "Sven's computer MAC address was logged sending the corrupted packet."
  },
  {
    id: "sc-med-10",
    gameType: "solve-crime",
    difficulty: "medium",
    title: "The Stolen Rare Book Codex",
    subtitle: "An illuminated Latin manuscript replaced with a photographic replica.",
    coverEmoji: "📜",
    xpReward: 60,
    crimeDescription: "A priceless 12th-century monastic codex was swapped out during an international symposium at the Vatican library.",
    suspects: [
      { id: "bishop", name: "Father Moretti", role: "Archivist", avatar: "⛪", motive: "Protecting controversial heresy", statement: "I was giving communion in the chapel.", suspicious: ["Access to the secret vault annex", "Smuggled manuscript inside cassock robes"] },
      { id: "visitor", name: "Prof. Clark", role: "Visiting Scholar", avatar: "👨‍🏫", motive: "Research greed", statement: "I was translating Greek texts.", suspicious: ["Requested viewing permit"] }
    ],
    evidence: [
      { id: "ev1", title: "Vellum Microfiber Shards", emoji: "🔬", type: "Trace", isKey: true, content: "800-year-old animal vellum fibers found on Father Moretti's clerical vestments." }
    ],
    timeline: [
      { time: "11:00 AM", event: "Codex inspected by conservators." },
      { time: "1:15 PM", event: "Father Moretti accesses vault annex alone." },
      { time: "3:00 PM", event: "Replica detected by ultraviolet fluorescence." }
    ],
    culpritChoices: [
      { id: "bishop", label: "Father Moretti (Archivist)" },
      { id: "visitor", label: "Prof. Clark (Scholar)" }
    ],
    motiveChoices: [
      { id: "concealment", label: "Concealing heretical theological doctrine" },
      { id: "sale", label: "Private black market auction" }
    ],
    question: "Who removed the 12th-century monastic codex?",
    options: ["Father Moretti", "Prof. Clark"],
    correctAnswer: "bishop",
    solution: "Father Moretti exploited his unmonitored vault access to remove the codex and conceal what he viewed as dangerous theological heresy.",
    explanation: "Ancient vellum fibers were found on Father Moretti's robes, and he held the only unmonitored key to the annex.",
    hint: "Vellum microfibers from the codex were found on Father Moretti's vestments."
  },

  // HARD (10 cases / questions)
  {
    id: "sc-hard-01",
    gameType: "solve-crime",
    difficulty: "hard",
    title: "The Locked-Room Cyanide Enigma",
    subtitle: "A reclusive chess grandmaster poisoned inside an airtight, deadbolted vault.",
    coverEmoji: "♟️",
    xpReward: 100,
    crimeDescription: "Grandmaster Boris Voronov was found dead at his chessboard inside his private panic room. The steel door was locked from the inside with three deadbolts, windows were solid brick, and the ventilation system was filtered. Autopsy shows he ingested hydrogen cyanide dissolved in his sealed bottle of tonic water.",
    suspects: [
      { id: "rival", name: "Dmitri Volkov", role: "Reigning Champion", avatar: "👑", motive: "World Championship Match defense", statement: "I was streaming my blitz tournament games live on Twitch all evening.", suspicious: ["Provided pre-packaged gift basket with tonic water", "Former biochemistry researcher in St. Petersburg"] },
      { id: "protégé", name: "Yulia Petrova", role: "Chess Prodigy", avatar: "♟️", motive: "Owed 50% royalties on chess engine", statement: "I was analyzing games in the hotel lobby.", suspicious: ["Had duplicate key to outer apartment", "Argued over contract royalties"] },
      { id: "doctor", name: "Dr. Aris Thorne", role: "Personal Physician", avatar: "👨‍⚕️", motive: "Covering up medical malpractice", statement: "I prescribed his daily vitamins 3 days ago.", suspicious: ["Cyanide detected in his clinic inventory", "Witnessed will modification"] }
    ],
    evidence: [
      { id: "ev1", title: "Sonic Resealing Tool", emoji: "🔬", type: "Technical", isKey: true, content: "An industrial ultrasonic bottle capper found in Dmitri's luggage that allowed injecting poison and resealing the factory cap flawlessly." },
      { id: "ev2", title: "Encrypted Chess Engine PGN", emoji: "💾", type: "Digital", isKey: false, content: "Chess engine analysis files with contractual watermarks." }
    ],
    timeline: [
      { time: "2:00 PM", event: "Dmitri presents celebratory gift basket to Boris before the match." },
      { time: "7:00 PM", event: "Boris enters panic room and deadbolts all three locks." },
      { time: "8:45 PM", event: "Boris opens the 'factory sealed' tonic water bottle." },
      { time: "9:00 PM", event: "Boris collapses over board; panic room remains sealed until morning." }
    ],
    culpritChoices: [
      { id: "rival", label: "Dmitri Volkov (Reigning Champion)" },
      { id: "protégé", label: "Yulia Petrova (Chess Prodigy)" },
      { id: "doctor", label: "Dr. Aris Thorne (Physician)" }
    ],
    motiveChoices: [
      { id: "championship", label: "Eliminating Boris before the World Championship title defense" },
      { id: "royalties", label: "Reclaiming 50% engine royalties" },
      { id: "malpractice", label: "Covering up medical malpractice" }
    ],
    question: "Who poisoned Grandmaster Boris Voronov?",
    options: ["Dmitri Volkov", "Yulia Petrova", "Dr. Aris Thorne"],
    correctAnswer: "rival",
    solution: "Dmitri Volkov poisoned the tonic water bottle beforehand using his biochemistry expertise, resealed it with an ultrasonic capper, and gifted it to Boris knowing Boris only drank sealed beverages in his locked panic room.",
    explanation: "Dmitri's ultrasonic resealing tool allowed the poison to enter the room without breaching the locked doors, perfectly explaining the locked-room paradox.",
    hint: "Look at the ultrasonic bottle capper that enabled poisoning a 'factory-sealed' bottle in advance."
  },
  {
    id: "sc-hard-02",
    gameType: "solve-crime",
    difficulty: "hard",
    title: "The Cryogenic Vault Sabotage",
    subtitle: "A life-extension laboratory's cryo-tanks drained of liquid nitrogen.",
    coverEmoji: "❄️",
    xpReward: 100,
    crimeDescription: "At 03:00 AM, the primary cryogenic storage tank holding 20 preserved billionaire clients suffered a sudden pressure drop, destroying all specimens.",
    suspects: [
      { id: "dr_frost", name: "Dr. Leonard Frost", role: "Founder & CEO", avatar: "👨‍🔬", motive: "Hiding embezzlement of client funds", statement: "I was sleeping in the on-site director suite.", suspicious: ["Auditors scheduled to verify preserved tissue tomorrow", "Manually overrode safety interlocks from master terminal"] },
      { id: "sara", name: "Sara Vance", role: "Lead Cryo-Engineer", avatar: "👩‍🔬", motive: "Whistleblower revenge", statement: "I left at 10 PM after checking nitrogen levels.", suspicious: ["Downloaded facility schematics"] }
    ],
    evidence: [
      { id: "ev1", title: "Master Override Keylog", emoji: "💻", type: "Digital", isKey: true, content: "System logs proved the nitrogen purge was authorized using Dr. Frost's biometric retinal scan from his private terminal." }
    ],
    timeline: [
      { time: "02:45 AM", event: "Retinal scanner activated at CEO private suite." },
      { time: "03:00 AM", event: "Emergency nitrogen vent valve opened remotely." },
      { time: "03:15 AM", event: "All cryo-tanks reach ambient room temperature." }
    ],
    culpritChoices: [
      { id: "dr_frost", label: "Dr. Leonard Frost (CEO)" },
      { id: "sara", label: "Sara Vance (Engineer)" }
    ],
    motiveChoices: [
      { id: "embezzlement_coverup", label: "Destroying evidence before forensic financial audit" },
      { id: "sabotage", label: "Corporate industrial sabotage" }
    ],
    question: "Who sabotaged the cryogenic facility?",
    options: ["Dr. Leonard Frost", "Sara Vance"],
    correctAnswer: "dr_frost",
    solution: "Dr. Frost triggered the nitrogen purge using his biometric retinal terminal to destroy the tanks before auditors discovered the clients were never properly preserved.",
    explanation: "Biometric retinal authentication confirmed Dr. Frost executed the purge command directly from his private suite.",
    hint: "Retinal scan logs confirmed the purge came from the CEO's personal console."
  },
  {
    id: "sc-hard-03",
    gameType: "solve-crime",
    difficulty: "hard",
    title: "The Supercollider Particle Pulse",
    subtitle: "A $10B particle accelerator beam steered into the superconducting magnets.",
    coverEmoji: "⚛️",
    xpReward: 100,
    crimeDescription: "A high-energy proton beam was deliberately deflected into the quadrupole magnets, causing a multi-billion dollar quench and catastrophic destruction.",
    suspects: [
      { id: "physicist", name: "Dr. Raymond Vance", role: "Lead Beam Physicist", avatar: "🧑‍🔬", motive: "Preventing discovery that his Nobel-winning paper was fabricated", statement: "I was in the cafeteria grabbing espresso.", suspicious: ["Fabricated simulation papers due for replication today", "Wrote the custom steering algorithm patch"] },
      { id: "operator", name: "Elena Rostova", role: "Control Room Operator", avatar: "👩‍💻", motive: "Protest against funding", statement: "I was managing cryo-pressure sensors.", suspicious: ["Logged in during beam dump"] }
    ],
    evidence: [
      { id: "ev1", title: "Corrupted Steering Algorithm", emoji: "💾", type: "Digital", isKey: true, content: "A hardcoded offset in the beam steering script committed under Dr. Vance's PGP key." }
    ],
    timeline: [
      { time: "11:00 PM", event: "Proton injection begins." },
      { time: "11:45 PM", event: "Beam steering script executed." },
      { time: "11:46 PM", event: "Magnet quench and beam collision." }
    ],
    culpritChoices: [
      { id: "physicist", label: "Dr. Raymond Vance (Beam Physicist)" },
      { id: "operator", label: "Elena Rostova (Operator)" }
    ],
    motiveChoices: [
      { id: "academic_fraud", label: "Destroying accelerator to prevent exposure of fabricated research" },
      { id: "activism", label: "Anti-science protest" }
    ],
    question: "Who sabotaged the particle supercollider?",
    options: ["Dr. Raymond Vance", "Elena Rostova"],
    correctAnswer: "physicist",
    solution: "Dr. Vance inserted malicious steering coordinates into the beam controller to trigger a quench and avoid replication of his fraudulent research.",
    explanation: "The malicious script was signed with Dr. Vance's private PGP key and timed to stop the replication run.",
    hint: "The corrupted beam steering script was signed with Dr. Vance's PGP key."
  },
  {
    id: "sc-hard-04",
    gameType: "solve-crime",
    difficulty: "hard",
    title: "The Deep Ocean Cable Sever",
    subtitle: "A transatlantic fiber-optic communications cable severed with robotic precision.",
    coverEmoji: "🌊",
    xpReward: 100,
    crimeDescription: "A vital fiber-optic trunk on the Atlantic seabed was cut at 4,000 meters depth using specialized acoustic robotic arms.",
    suspects: [
      { id: "sub_captain", name: "Capt. Ivan Geller", role: "Research Submersible Commander", avatar: "🚢", motive: "High-frequency trading market manipulation", statement: "We were mapping volcanic trenches 200 miles south.", suspicious: ["Submersible claw showed hydraulic titanium cutting wear", "Short-sold European market indices hours before the blackout"] },
      { id: "engineer", name: "Mark", role: "Sonar Tech", avatar: "⚓", motive: "Contract dispute", statement: "I was operating sonar.", suspicious: ["Logged false coordinates"] }
    ],
    evidence: [
      { id: "ev1", title: "Titanium Hydraulic Shear Residue", emoji: "✂️", type: "Forensic", isKey: true, content: "Armored cable Kevlar and optical glass strands matched the exact serration marks of Ivan's submersible cutters." }
    ],
    timeline: [
      { time: "01:00 AM", event: "Submersible dives to 4,000m." },
      { time: "02:14 AM", event: "Transatlantic data link cuts out instantly." },
      { time: "02:30 AM", event: "Ivan executes short positions on financial exchanges." }
    ],
    culpritChoices: [
      { id: "sub_captain", label: "Capt. Ivan Geller (Submersible Commander)" },
      { id: "engineer", label: "Mark (Sonar Tech)" }
    ],
    motiveChoices: [
      { id: "market_manipulation", label: "Exploiting latency disconnect to profit from financial short positions" },
      { id: "espionage", label: "Government espionage" }
    ],
    question: "Who severed the transatlantic fiber-optic cable?",
    options: ["Capt. Ivan Geller", "Mark"],
    correctAnswer: "sub_captain",
    solution: "Capt. Ivan Geller used his submersible's hydraulic shears to cut the cable, timing the blackout to make millions on financial market options.",
    explanation: "The shear marks matched Ivan's submersible, and his personal trading accounts executed massive market short positions right before the cut.",
    hint: "Ivan's financial short positions coincided exactly with the time of the cable sever."
  },
  {
    id: "sc-hard-05",
    gameType: "solve-crime",
    difficulty: "hard",
    title: "The Billion-Dollar Satellite Hijack",
    subtitle: "A military surveillance satellite de-orbited via encrypted uplink injection.",
    coverEmoji: "🛰️",
    xpReward: 100,
    crimeDescription: "Orbital satellite Titan-4 burned up in the atmosphere after rogue thruster burn commands were transmitted from a mobile uplink station.",
    suspects: [
      { id: "dr_orlov", name: "Dr. Viktor Orlov", role: "Guidance Systems Lead", avatar: "🚀", motive: "Foreign government intelligence bounty", statement: "I was giving a lecture at MIT.", suspicious: ["Mobile satellite uplink dish in his rental RV", "Encrypted crypto wallet with $10M deposit"] },
      { id: "comms_officer", name: "Major Hayes", role: "Ground Controller", avatar: "📡", motive: "Gambling debts", statement: "I was at the military control console.", suspicious: ["Shift supervisor on duty"] }
    ],
    evidence: [
      { id: "ev1", title: "Doppler Uplink Telemetry", emoji: "📡", type: "Digital", isKey: true, content: "Doppler triangulation of the rogue transmitter matched the exact GPS coordinates of Dr. Orlov's rental RV in the Nevada desert." }
    ],
    timeline: [
      { time: "10:00 PM", event: "Dr. Orlov parks RV in Nevada desert." },
      { time: "10:45 PM", event: "Rogue thruster burn transmitted." },
      { time: "11:15 PM", event: "Titan-4 burns up over the Pacific." }
    ],
    culpritChoices: [
      { id: "dr_orlov", label: "Dr. Viktor Orlov (Guidance Lead)" },
      { id: "comms_officer", label: "Major Hayes (Controller)" }
    ],
    motiveChoices: [
      { id: "bounty", label: "Cashing in $10M foreign intelligence bounty" },
      { id: "sabotage", label: "Political protest" }
    ],
    question: "Who hijacked and destroyed Titan-4?",
    options: ["Dr. Viktor Orlov", "Major Hayes"],
    correctAnswer: "dr_orlov",
    solution: "Dr. Orlov used his guidance clearance and a mobile dish in Nevada to transmit unauthorized thruster commands, destroying the satellite for a foreign bounty.",
    explanation: "Doppler triangulation pinpointed the rogue signal directly to Dr. Orlov's RV in the desert.",
    hint: "Doppler signal triangulation matched the location of Dr. Orlov's rental RV."
  },
  {
    id: "sc-hard-06",
    gameType: "solve-crime",
    difficulty: "hard",
    title: "The Automated Trading Flash Crash",
    subtitle: "A algorithmic trading loop drained $2B from institutional funds in 90 seconds.",
    coverEmoji: "📉",
    xpReward: 100,
    crimeDescription: "A hyper-fast recursive order loop triggered a catastrophic flash crash on Wall Street, siphoning liquidity into dark-pool accounts.",
    suspects: [
      { id: "quant", name: "Zachary Sterling", role: "Chief Quantitative Officer", avatar: "🧑‍💻", motive: "Transferring wealth to offshore Cayman funds", statement: "I was on a flight to Tokyo during market open.", suspicious: ["Uploaded timed daemon script to exchange colocation servers", "Cayman fund beneficiary was his sister's trust"] },
      { id: "broker", name: "David Cole", role: "Floor Trader", avatar: "📊", motive: "Commission panic", statement: "I was trading on the NYSE floor.", suspicious: ["Executed manual trades"] }
    ],
    evidence: [
      { id: "ev1", title: "Microsecond Timestamp Log", emoji: "⏱️", type: "Digital", isKey: true, content: "Low-latency server logs showed the exploit daemon executed from Zachary's root user token." }
    ],
    timeline: [
      { time: "09:30:00 AM", event: "Market opens." },
      { time: "09:31:15 AM", event: "Exploit daemon spawns 50,000 synthetic spoof orders per millisecond." },
      { time: "09:32:45 AM", event: "Flash crash concludes; $2B routed to offshore accounts." }
    ],
    culpritChoices: [
      { id: "quant", label: "Zachary Sterling (Quant Officer)" },
      { id: "broker", label: "David Cole (Floor Trader)" }
    ],
    motiveChoices: [
      { id: "billion_siphon", label: "Siphoning $2B into offshore shell companies" },
      { id: "glitch", label: "Accidental recursive algorithm loop" }
    ],
    question: "Who programmed the flash crash exploit?",
    options: ["Zachary Sterling", "David Cole"],
    correctAnswer: "quant",
    solution: "Zachary pre-loaded the exploit daemon into the exchange colocation servers to trigger while he was in-flight, routing billions to his offshore trust.",
    explanation: "Colocation server root logs tied the execution directly to Zachary's cryptographic user token.",
    hint: "Root access logs tied the automated exploit to Zachary's private token."
  },
  {
    id: "sc-hard-07",
    gameType: "solve-crime",
    difficulty: "hard",
    title: "The Louvre Diamond Prism Theft",
    subtitle: "A laser optical prism stolen without breaking infrared laser beams.",
    coverEmoji: "💎",
    xpReward: 100,
    crimeDescription: "A priceless laser dispersion prism was stolen from the high-security optics vault. The laser grid remained active, and zero alarms were triggered.",
    suspects: [
      { id: "optical_eng", name: "Claire Delacroix", role: "Laser Security Engineer", avatar: "👩‍🔬", motive: "Black market jewel syndicate", statement: "I was testing laser alignment sensors in the control booth.", suspicious: ["Manufactured custom beam-splitting mirrors to redirect lasers", "Prism recovered from her specialized thermal insulated bag"] },
      { id: "guard", name: "Jacques", role: "Night Guard", avatar: "👮", motive: "Debt", statement: "I was patrolling the hallway outside.", suspicious: ["No optical expertise"] }
    ],
    evidence: [
      { id: "ev1", title: "Beam Splitting Mirror Array", emoji: "🪞", type: "Technical", isKey: true, content: "Custom optical mirrors calibrated to precisely 632.8nm wavelength found in Claire's locker." }
    ],
    timeline: [
      { time: "02:00 AM", event: "Claire enters vault for scheduled laser calibration." },
      { time: "02:10 AM", event: "Mirror array bypasses sensor beams." },
      { time: "02:15 AM", event: "Prism extracted without triggering alarms." }
    ],
    culpritChoices: [
      { id: "optical_eng", label: "Claire Delacroix (Laser Engineer)" },
      { id: "guard", label: "Jacques (Night Guard)" }
    ],
    motiveChoices: [
      { id: "black_market", label: "Selling rare optical diamond to private collectors" },
      { id: "debt", label: "Gambling debt relief" }
    ],
    question: "Who bypassed the laser grid to steal the prism?",
    options: ["Claire Delacroix", "Jacques"],
    correctAnswer: "optical_eng",
    solution: "Claire used calibrated wavelength mirrors to route the laser beams around the pedestal while she lifted the prism, leaving the security grid unbroken.",
    explanation: "Only Claire had the optical mirrors matching the exact 632.8nm laser wavelength and the knowledge to manipulate the beam path.",
    hint: "Mirrors calibrated to the exact 632.8nm laser wavelength were found in Claire's locker."
  },
  {
    id: "sc-hard-08",
    gameType: "solve-crime",
    difficulty: "hard",
    title: "The High-Security Vault Thermite Breach",
    subtitle: "A 10-ton vault door melted from the inside using military thermite.",
    coverEmoji: "🔥",
    xpReward: 100,
    crimeDescription: "The gold bullion vault of Federal Depository 4 was breached when the internal locking pins were liquefied by 4,000°F thermite reaction.",
    suspects: [
      { id: "demolition_expert", name: "Marcus 'Blaze' Vance", role: "Metallurgical Consultant", avatar: "🧑‍🏭", motive: "Gold bullion robbery", statement: "I was in the engineering trailer reviewing blueprints.", suspicious: ["Barium nitrate and aluminum powder traces on his hands", "Smuggled thermite canisters disguised as fire extinguishers"] },
      { id: "guard_chief", name: "Chief Ryan", role: "Head of Guard", avatar: "👮‍♂️", motive: "Retaliation", statement: "I was in the main monitoring room.", suspicious: ["Keycard log shows entry"] }
    ],
    evidence: [
      { id: "ev1", title: "Hollow Fire Extinguisher Canister", emoji: "🧯", type: "Weapons", isKey: true, content: "A fire extinguisher casing lined with thermite chemical residue bearing Marcus's fingerprints." }
    ],
    timeline: [
      { time: "03:00 AM", event: "Marcus delivers 'serviced' fire extinguishers into vault." },
      { time: "03:30 AM", event: "Internal thermite reaction liquefies locking pins." },
      { time: "03:45 AM", event: "Gold bullion loaded into armored van." }
    ],
    culpritChoices: [
      { id: "demolition_expert", label: "Marcus 'Blaze' Vance (Consultant)" },
      { id: "guard_chief", label: "Chief Ryan (Head of Guard)" }
    ],
    motiveChoices: [
      { id: "gold_theft", label: "Stealing $50M in gold bullion" },
      { id: "sabotage", label: "Vandalism" }
    ],
    question: "Who melted the vault locking pins with thermite?",
    options: ["Marcus 'Blaze' Vance", "Chief Ryan"],
    correctAnswer: "demolition_expert",
    solution: "Marcus smuggled thermite inside hollowed-out fire extinguishers, remotely ignited the charges to melt the locking pins, and hauled away the gold.",
    explanation: "Marcus's fingerprints were on the thermite fire extinguisher canister, and his hands tested positive for barium nitrate.",
    hint: "Thermite residue and fingerprints were found on the disguised fire extinguisher."
  },
  {
    id: "sc-hard-09",
    gameType: "solve-crime",
    difficulty: "hard",
    title: "The Nuclear Plant Cooling Tower Sabotage",
    subtitle: "Coolant pump intake valves welded shut with underwater underwater torches.",
    coverEmoji: "☢️",
    xpReward: 100,
    crimeDescription: "A nuclear power station came within minutes of emergency SCRAM when primary intake valves were fused shut by specialized underwater magnesium cutting torches.",
    suspects: [
      { id: "diver", name: "Dmitri Volkov", role: "Commercial Deep Diver", avatar: "🤿", motive: "Blackmail extortion of power utility", statement: "I was sleeping in the marina hotel.", suspicious: ["Magnesium torch fuel canisters in his dive truck", "GPS beacon on dive scooter tracked directly to water intake 3"] },
      { id: "plant_manager", name: "Harold", role: "Plant Manager", avatar: "🧑‍💼", motive: "Insurance fraud", statement: "I was in the control center.", suspicious: ["Delayed alarm notification"] }
    ],
    evidence: [
      { id: "ev1", title: "Underwater Dive Scooter GPS", emoji: "🧭", type: "Digital", isKey: true, content: "Navigational log from Dmitri's diver propulsion vehicle proving a 45-minute dive directly inside the cooling intake pipe." }
    ],
    timeline: [
      { time: "01:00 AM", event: "Diver enters intake canal." },
      { time: "01:35 AM", event: "Intake valve 3 welded shut with magnesium torch." },
      { time: "02:00 AM", event: "Core coolant flow alarm sounds." }
    ],
    culpritChoices: [
      { id: "diver", label: "Dmitri Volkov (Commercial Diver)" },
      { id: "plant_manager", label: "Harold (Plant Manager)" }
    ],
    motiveChoices: [
      { id: "extortion", label: "$50M cryptocurrency extortion threat against utility" },
      { id: "accident", label: "Maintenance mistake" }
    ],
    question: "Who welded the cooling intake valves shut?",
    options: ["Dmitri Volkov", "Harold"],
    correctAnswer: "diver",
    solution: "Dmitri Volkov navigated the intake pipe on his dive scooter and used magnesium torches to fuse the valves as part of an extortion plot.",
    explanation: "GPS coordinates from Dmitri's underwater scooter placed him directly inside the intake pipe during the welding event.",
    hint: "GPS data from the dive scooter placed Dmitri right at the intake pipe."
  },
  {
    id: "sc-hard-10",
    gameType: "solve-crime",
    difficulty: "hard",
    title: "The International Bank Vault Laser Tunnel",
    subtitle: "A subterranean tunnel bored beneath Zurich's most secure underground bullion vault.",
    coverEmoji: "🏦",
    xpReward: 100,
    crimeDescription: "A precision laser thermal drill bored a 6-foot tunnel through 20 feet of reinforced granite and steel directly into Zurich Central Vault.",
    suspects: [
      { id: "tunnel_master", name: "Hans Gruber", role: "Geotechnical Engineer", avatar: "👷", motive: "Bearer bonds and gold bars", statement: "I was in Bern consulting on tunnel projects.", suspicious: ["Rented laser thermal coring rig under company name", "Granite dust matching the vault bedrock discovered on his boots"] },
      { id: "security_chief", name: "Klaus", role: "Vault Security Chief", avatar: "🛡️", motive: "Bribe", statement: "I was monitoring camera feeds.", suspicious: ["Missed seismic alerts"] }
    ],
    evidence: [
      { id: "ev1", title: "Granite Spectroscopy Analysis", emoji: "🪨", type: "Forensic", isKey: true, content: "Mineral composition of rock dust on Hans's boots matched the unique granite formation directly beneath the vault." }
    ],
    timeline: [
      { time: "Friday 10 PM", event: "Laser thermal drill powered on in adjacent sewer vault." },
      { time: "Saturday 4 PM", event: "Granite barrier breached silently." },
      { time: "Sunday 2 AM", event: "$100M in bearer bonds extracted." }
    ],
    culpritChoices: [
      { id: "tunnel_master", label: "Hans Gruber (Geotechnical Engineer)" },
      { id: "security_chief", label: "Klaus (Vault Security Chief)" }
    ],
    motiveChoices: [
      { id: "bearer_bonds", label: "Looting $100M in untraceable bearer bonds" },
      { id: "vandalism", label: "Structural damage" }
    ],
    question: "Who bored the laser tunnel into the Zurich vault?",
    options: ["Hans Gruber", "Klaus"],
    correctAnswer: "tunnel_master",
    solution: "Hans Gruber utilized a thermal laser drill to penetrate the granite bedrock without creating detectable seismic vibrations, looting the bonds.",
    explanation: "Spectroscopic analysis proved the granite dust on Hans's boots was identical to the rare bedrock beneath the vault.",
    hint: "Granite dust on Hans's boots matched the bedrock directly under the vault."
  }
];

export default solveCrimeQuestions;
