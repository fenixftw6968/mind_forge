const fs = require('fs');
const path = require('path');

// Load the existing 30 questions
const existingData = fs.readFileSync(path.join(__dirname, '../frontend/src/data/memoryChallengeQuestions.js'), 'utf8');

// We'll extract existing easy (1-10), med (1-10), hard (1-10)
function extractCategory(content, catKey) {
  // Regex match items where difficulty is catKey
  const scenes = [];
  const regex = /\{\s*id:\s*"mc-([a-z]+)-(\d+)"[\s\S]*?questions:\s*\[[\s\S]*?\}\s*\]\s*\}/g;
  let match;
  while ((match = regex.exec(content)) !== null) {
    try {
      // eval matching object safely
      const obj = eval('(' + match[0] + ')');
      if (obj.difficulty.toLowerCase() === catKey.toLowerCase()) {
        scenes.push(obj);
      }
    } catch(e) {}
  }
  return scenes;
}

const existingEasy = extractCategory(existingData, 'easy');
const existingMed = extractCategory(existingData, 'medium');
const existingHard = extractCategory(existingData, 'hard');

console.log(`Loaded existing: Easy=${existingEasy.length}, Med=${existingMed.length}, Hard=${existingHard.length}`);

// 30 Additional Easy Scenes (11-40)
const additionalEasyThemes = [
  {
    title: "Art Studio Easel",
    desc: "Memorize the creative painting tools scattered around the easel.",
    items: [
      { emoji: "🎨", label: "Color Palette" },
      { emoji: "🖌️", label: "Oil Paintbrush" },
      { emoji: "🖍️", label: "Wax Crayon" },
      { emoji: "🏺", label: "Clay Vase" },
      { emoji: "📐", label: "T-Square Ruler" },
      { emoji: "🧽", label: "Cleaning Sponge" }
    ],
    q: "What pottery item was sitting next to the paint supplies?",
    opts: ["Clay Vase", "Ceramic Bowl", "Teacup", "Flower Pot"],
    ans: "Clay Vase",
    exp: "A Clay Vase (🏺) was placed beside the painting palette.",
    hint: "Think about handmade pottery."
  },
  {
    title: "Aquarium Tank Display",
    desc: "Observe the aquatic creatures swimming in the main tank.",
    items: [
      { emoji: "🐠", label: "Tropical Fish" },
      { emoji: "🐡", label: "Blowfish" },
      { emoji: "🦈", label: "Reef Shark" },
      { emoji: "🐙", label: "Red Octopus" },
      { emoji: "🦀", label: "Crab" },
      { emoji: "🐚", label: "Conch Shell" }
    ],
    q: "Which eight-legged sea creature was visible in the tank?",
    opts: ["Red Octopus", "Jellyfish", "Squid", "Lobster"],
    ans: "Red Octopus",
    exp: "The Red Octopus (🐙) was clinging near the rocks.",
    hint: "Eight tentacles and ink."
  },
  {
    title: "Coffee Shop Counter",
    desc: "Memorize the breakfast items ordered at the cafe counter.",
    items: [
      { emoji: "☕", label: "Hot Espresso" },
      { emoji: "🧃", label: "Apple Juice Box" },
      { emoji: "🥞", label: "Stack of Pancakes" },
      { emoji: "🧇", label: "Belgian Waffle" },
      { emoji: "🥛", label: "Glass of Milk" },
      { emoji: "🍪", label: "Chocolate Cookie" }
    ],
    q: "Which warm breakfast pastry had a checked grid pattern?",
    opts: ["Belgian Waffle", "Pancake", "Toast", "Muffin"],
    ans: "Belgian Waffle",
    exp: "The Belgian Waffle (🧇) has a signature grid design.",
    hint: "Square pockets for maple syrup."
  },
  {
    title: "Beach Day Blanket",
    desc: "Take note of the items placed on the sunny beach towel.",
    items: [
      { emoji: "🏖️", label: "Beach Umbrella" },
      { emoji: "🕶️", label: "Dark Sunglasses" },
      { emoji: "🧴", label: "Sunscreen Bottle" },
      { emoji: "🩴", label: "Blue Flip-Flops" },
      { emoji: "🏐", label: "Volleyball" },
      { emoji: "🍉", label: "Watermelon Slice" }
    ],
    q: "What footwear was resting beside the beach towel?",
    opts: ["Blue Flip-Flops", "Sandals", "Sneakers", "Water Shoes"],
    ans: "Blue Flip-Flops",
    exp: "Blue Flip-Flops (🩴) were resting on the edge of the towel.",
    hint: "Casual open-toe beach footwear."
  },
  {
    title: "Doctor's First Aid Kit",
    desc: "Study the medical care items packed inside the first aid box.",
    items: [
      { emoji: "🩹", label: "Adhesive Bandage" },
      { emoji: "🩺", label: "Stethoscope" },
      { emoji: "💊", label: "Medicine Capsule" },
      { emoji: "🌡️", label: "Mercury Thermometer" },
      { emoji: "🧴", label: "Antiseptic Wash" },
      { emoji: "🧤", label: "Surgical Gloves" }
    ],
    q: "Which instrument is used to listen to a patient's heartbeat?",
    opts: ["Stethoscope", "Thermometer", "Otoscope", "Blood Pressure Cuff"],
    ans: "Stethoscope",
    exp: "The Stethoscope (🩺) is used to listen to internal heart and lung sounds.",
    hint: "Draped around a physician's neck."
  },
  {
    title: "Music Room Stage",
    desc: "Observe the acoustic instruments resting on the stage.",
    items: [
      { emoji: "🎸", label: "Acoustic Guitar" },
      { emoji: "🎻", label: "Violin" },
      { emoji: "🎹", label: "Piano Keyboard" },
      { emoji: "🥁", label: "Snare Drum" },
      { emoji: "🎺", label: "Brass Trumpet" },
      { emoji: "🪗", label: "Accordion" }
    ],
    q: "Which brass horn was shining under the stage lights?",
    opts: ["Brass Trumpet", "Saxophone", "Trombone", "French Horn"],
    ans: "Brass Trumpet",
    exp: "The Brass Trumpet (🎺) was polished and shining on the stand.",
    hint: "Golden horn with three valves."
  },
  {
    title: "Kitchen Pantry Shelf",
    desc: "Memorize the cooking ingredients stacked on the second shelf.",
    items: [
      { emoji: "🫒", label: "Green Olives" },
      { emoji: "🧀", label: "Cheddar Cheese" },
      { emoji: "🍞", label: "Wheat Bread" },
      { emoji: "🥫", label: "Tomato Can" },
      { emoji: "🍯", label: "Honey Pot" },
      { emoji: "🧂", label: "Salt Shaker" }
    ],
    q: "Which condiment pot contained golden sweet syrup?",
    opts: ["Honey Pot", "Maple Jar", "Mustard Bottle", "Jam Pot"],
    ans: "Honey Pot",
    exp: "The Honey Pot (🍯) contained sweet golden nectar.",
    hint: "Made by bees."
  },
  {
    title: "Vegetable Garden Patch",
    desc: "Observe the fresh produce growing in the garden bed.",
    items: [
      { emoji: "🌽", label: "Sweet Corn" },
      { emoji: "🍅", label: "Ripe Tomato" },
      { emoji: "🍆", label: "Purple Eggplant" },
      { emoji: "🥔", label: "Brown Potato" },
      { emoji: "🌶️", label: "Hot Pepper" },
      { emoji: "🥬", label: "Leafy Lettuce" }
    ],
    q: "Which spicy red vegetable was hanging from the vine?",
    opts: ["Hot Pepper", "Tomato", "Eggplant", "Red Cabbage"],
    ans: "Hot Pepper",
    exp: "The spicy Hot Pepper (🌶️) grew vibrant red on the vine.",
    hint: "Known for its fiery kick."
  },
  {
    title: "Superhero Utility Belt",
    desc: "Memorize the gadgets clipped to the hero's utility belt.",
    items: [
      { emoji: "⚡", label: "Shock Baton" },
      { emoji: "🔦", label: "Tactical Light" },
      { emoji: "🪢", label: "Grappling Rope" },
      { emoji: "📻", label: "Two-Way Radio" },
      { emoji: "🕶️", label: "Night Goggles" },
      { emoji: "🧲", label: "Magnetic Clamp" }
    ],
    q: "What communications gear was attached to the belt?",
    opts: ["Two-Way Radio", "Satellite Phone", "Beacon", "Smartwatch"],
    ans: "Two-Way Radio",
    exp: "The Two-Way Radio (📻) kept communication open with headquarters.",
    hint: "Handheld walkie-talkie style transceiver."
  },
  {
    title: "Picnic in the Park",
    desc: "Memorize the lunch spread set out on the checkered blanket.",
    items: [
      { emoji: "🥪", label: "Club Sandwich" },
      { emoji: "🍎", label: "Crisp Apple" },
      { emoji: "🍇", label: "Green Grapes" },
      { emoji: "🥤", label: "Soda Cup" },
      { emoji: "🥧", label: "Cherry Pie" },
      { emoji: "🧺", label: "Wicker Basket" }
    ],
    q: "What classic pastry dessert was sliced on the picnic blanket?",
    opts: ["Cherry Pie", "Chocolate Cake", "Brownie", "Donut"],
    ans: "Cherry Pie",
    exp: "A freshly baked Cherry Pie (🥧) was ready for dessert.",
    hint: "Flaky crust with fruit filling."
  },
  {
    title: "Sports Locker Room",
    desc: "Take note of the athletic gear stored in the metal locker.",
    items: [
      { emoji: "⚽", label: "Soccer Ball" },
      { emoji: "🏀", label: "Orange Basketball" },
      { emoji: "🏈", label: "Football" },
      { emoji: "⚾", label: "Baseball" },
      { emoji: "🎾", label: "Tennis Ball" },
      { emoji: "🏓", label: "Ping Pong Paddle" }
    ],
    q: "Which ball had black and white hexagonal patches?",
    opts: ["Soccer Ball", "Basketball", "Volleyball", "Tennis Ball"],
    ans: "Soccer Ball",
    exp: "The Soccer Ball (⚽) has iconic black and white hexagons.",
    hint: "Kicked into a goal."
  },
  {
    title: "Movie Theater Concession",
    desc: "Study the snacks on the movie concession counter.",
    items: [
      { emoji: "🍿", label: "Buttered Popcorn" },
      { emoji: "🥤", label: "Fountain Drink" },
      { emoji: "🍫", label: "Chocolate Bar" },
      { emoji: "🍬", label: "Hard Candy" },
      { emoji: "🌭", label: "Hot Dog" },
      { emoji: "🎟️", label: "Gold Admission Ticket" }
    ],
    q: "What paper pass provided entrance to the movie screening?",
    opts: ["Gold Admission Ticket", "VIP Card", "Wristband", "Receipt"],
    ans: "Gold Admission Ticket",
    exp: "The Gold Admission Ticket (🎟️) admitted viewers into theater 4.",
    hint: "Punched stub for moviegoers."
  },
  {
    title: "Winter Wardrobe Shelf",
    desc: "Memorize the cold-weather garments hanging in the closet.",
    items: [
      { emoji: "🧥", label: "Down Jacket" },
      { emoji: "🧣", label: "Wool Scarf" },
      { emoji: "🧤", label: "Knit Mittens" },
      { emoji: "🧦", label: "Thermal Socks" },
      { emoji: "👢", label: "Snow Boots" },
      { emoji: "🎿", label: "Skis" }
    ],
    q: "Which item protected the neck from frosty winds?",
    opts: ["Wool Scarf", "Turtleneck", "Down Jacket", "Ear Muffs"],
    ans: "Wool Scarf",
    exp: "The Wool Scarf (🧣) was wrapped around the neck.",
    hint: "Long knit cloth wrapped around the collar."
  },
  {
    title: "Flower Shop Display",
    desc: "Observe the floral arrangements standing in the boutique.",
    items: [
      { emoji: "🌹", label: "Red Rose" },
      { emoji: "🌻", label: "Bright Sunflower" },
      { emoji: "🌷", label: "Pink Tulip" },
      { emoji: "🌼", label: "Yellow Daisy" },
      { emoji: "💐", label: "Flower Bouquet" },
      { emoji: "🪴", label: "Potted Fern" }
    ],
    q: "Which flower featured tall yellow petals following the sun?",
    opts: ["Bright Sunflower", "Daffodil", "Marigold", "Yellow Rose"],
    ans: "Bright Sunflower",
    exp: "The Bright Sunflower (🌻) turned toward the morning window.",
    hint: "Large golden head with seeds in the center."
  },
  {
    title: "Home Garage Workbench",
    desc: "Memorize the maintenance hand tools resting on the bench.",
    items: [
      { emoji: "🔨", label: "Claw Hammer" },
      { emoji: "🔧", label: "Adjustable Wrench" },
      { emoji: "🪛", label: "Flathead Screwdriver" },
      { emoji: "🪚", label: "Handsaw" },
      { emoji: "🔩", label: "Nut and Bolt" },
      { emoji: "🧰", label: "Red Toolbox" }
    ],
    q: "What tool was used to drive nails into timber?",
    opts: ["Claw Hammer", "Mallet", "Pliers", "Wrench"],
    ans: "Claw Hammer",
    exp: "The Claw Hammer (🔨) was used for driving and pulling nails.",
    hint: "Heavy metal head with a wooden handle."
  },
  {
    title: "Sunday Breakfast Spread",
    desc: "Observe the morning food items on the dining room table.",
    items: [
      { emoji: "🍳", label: "Fried Egg" },
      { emoji: "🥓", label: "Crispy Bacon" },
      { emoji: "🧈", label: "Stick of Butter" },
      { emoji: "🍞", label: "Toasted Bread" },
      { emoji: "☕", label: "Black Coffee" },
      { emoji: "🍊", label: "Orange Slice" }
    ],
    q: "What savory sizzling meat was served with the eggs?",
    opts: ["Crispy Bacon", "Sausage Link", "Ham Slice", "Steak"],
    ans: "Crispy Bacon",
    exp: "Crispy Bacon (🥓) strips were cooked golden brown.",
    hint: "Cured pork strips loved at breakfast."
  },
  {
    title: "Farmyard Barn Stalls",
    desc: "Memorize the friendly animals resting in the wooden barn.",
    items: [
      { emoji: "🐄", label: "Spotted Cow" },
      { emoji: "🐖", label: "Pink Piglet" },
      { emoji: "🐑", label: "Fluffy Sheep" },
      { emoji: "🐓", label: "Rooster" },
      { emoji: "🐴", label: "Brown Horse" },
      { emoji: "🦆", label: "Mallard Duck" }
    ],
    q: "Which bird with vibrant feathers crowns the morning wakeup call?",
    opts: ["Rooster", "Duck", "Turkey", "Goose"],
    ans: "Rooster",
    exp: "The Rooster (🐓) perched on the fence post at dawn.",
    hint: "Crowing bird with a red comb."
  },
  {
    title: "Post Office Sorting Table",
    desc: "Study the mailing supplies ready for international delivery.",
    items: [
      { emoji: "✉️", label: "Postal Envelope" },
      { emoji: "📦", label: "Cardboard Parcel" },
      { emoji: "🏷️", label: "Shipping Tag" },
      { emoji: "📮", label: "Red Mailbox" },
      { emoji: "📯", label: "Post Horn" },
      { emoji: "✒️", label: "Fountain Ink Pen" }
    ],
    q: "What container held the packaged goods for delivery?",
    opts: ["Cardboard Parcel", "Wooden Crate", "Padded Mailer", "Luggage Trunk"],
    ans: "Cardboard Parcel",
    exp: "The Cardboard Parcel (📦) was sealed with brown packing tape.",
    hint: "Taped cardboard carton."
  },
  {
    title: "Ice Cream Parlor Tub",
    desc: "Memorize the cold sweet treats lined up behind the counter glass.",
    items: [
      { emoji: "🍦", label: "Vanilla Soft Serve" },
      { emoji: "🍧", label: "Shaved Ice" },
      { emoji: "🍨", label: "Ice Cream Sundae" },
      { emoji: "🍒", label: "Topping Cherry" },
      { emoji: "🍫", label: "Fudge Syrup" },
      { emoji: "🥄", label: "Silver Spoon" }
    ],
    q: "Which bright red fruit crowned the top of the sundae?",
    opts: ["Topping Cherry", "Strawberry", "Raspberry", "Pomegranate"],
    ans: "Topping Cherry",
    exp: "A sweet maraschino Topping Cherry (🍒) topped the sundae.",
    hint: "Classic fruit on top of sundaes."
  },
  {
    title: "Sewing and Tailor Kit",
    desc: "Take note of the dressmaking accessories on the cutting mat.",
    items: [
      { emoji: "🧵", label: "Spool of Thread" },
      { emoji: "🪡", label: "Sewing Needle" },
      { emoji: "🧷", label: "Safety Pin" },
      { emoji: "🔘", label: "Coat Button" },
      { emoji: "✂️", label: "Fabric Shears" },
      { emoji: "📏", label: "Cloth Tape Measure" }
    ],
    q: "Which tool has a sharp eyelet for pulling thread?",
    opts: ["Sewing Needle", "Safety Pin", "Thimble", "Stitch Ripper"],
    ans: "Sewing Needle",
    exp: "The Sewing Needle (🪡) was threaded with silk.",
    hint: "Slender pointed steel tool."
  },
  {
    title: "Magician's Secret Trunk",
    desc: "Memorize the illusionist props packed inside the velvet trunk.",
    items: [
      { emoji: "🎩", label: "Silk Top Hat" },
      { emoji: "🪄", label: "Magic Wand" },
      { emoji: "🐇", label: "White Rabbit" },
      { emoji: "🃏", label: "Playing Card Deck" },
      { emoji: "🕊️", label: "White Dove" },
      { emoji: "🪙", label: "Coin Illusion" }
    ],
    q: "Which animal famously leaps out of the magician's hat?",
    opts: ["White Rabbit", "Hamster", "Ferret", "Pigeon"],
    ans: "White Rabbit",
    exp: "The White Rabbit (🐇) was waiting behind the false bottom.",
    hint: "Long ears and fluffy tail."
  },
  {
    title: "Construction Foreman Rig",
    desc: "Study the heavy duty safety gear on the site office table.",
    items: [
      { emoji: "🪖", label: "Yellow Hardhat" },
      { emoji: "🚧", label: "Barrier Fence" },
      { emoji: "🚜", label: "Excavator Tractor" },
      { emoji: "🧱", label: "Red Brick" },
      { emoji: "🪜", label: "Step Ladder" },
      { emoji: "📐", label: "Architect Blueprint" }
    ],
    q: "What protective headwear must workers wear on site?",
    opts: ["Yellow Hardhat", "Welding Mask", "Beanie", "Goggles"],
    ans: "Yellow Hardhat",
    exp: "The Yellow Hardhat (🪖) protects against falling debris.",
    hint: "Tough yellow plastic helmet."
  },
  {
    title: "Public Library Reading Nook",
    desc: "Observe the study materials on the quiet reading table.",
    items: [
      { emoji: "📚", label: "Stack of Books" },
      { emoji: "📖", label: "Open Novel" },
      { emoji: "🔖", label: "Silk Bookmark" },
      { emoji: "👓", label: "Reading Glasses" },
      { emoji: "💡", label: "Desk Lamp" },
      { emoji: "📝", label: "Notepad" }
    ],
    q: "Which eyewear helped the scholar inspect small text?",
    opts: ["Reading Glasses", "Magnifier", "Monocle", "Sunglasses"],
    ans: "Reading Glasses",
    exp: "The Reading Glasses (👓) sat folded on the open book.",
    hint: "Prescription lenses for reading."
  },
  {
    title: "Outdoor Forest Trail Marker",
    desc: "Memorize the woodland wonders spotted near the hiking path.",
    items: [
      { emoji: "🌲", label: "Pine Tree" },
      { emoji: "🍄", label: "Red Mushroom" },
      { emoji: "🐿️", label: "Chipmunk" },
      { emoji: "🌰", label: "Acorn" },
      { emoji: "🪨", label: "Granite Boulder" },
      { emoji: "🪵", label: "Fallen Log" }
    ],
    q: "What nut did the forest critter stash under the roots?",
    opts: ["Acorn", "Walnut", "Chestnut", "Hazelnut"],
    ans: "Acorn",
    exp: "The small brown Acorn (🌰) was buried in the soft moss.",
    hint: "Oak tree nut with a textured cap."
  },
  {
    title: "Nursery Play Mat",
    desc: "Take note of the toddler toys arranged on the soft mat.",
    items: [
      { emoji: "🧸", label: "Brown Teddy" },
      { emoji: "🍼", label: "Baby Bottle" },
      { emoji: "🪇", label: "Maraca Rattle" },
      { emoji: "🚂", label: "Wooden Train" },
      { emoji: "🎈", label: "Red Balloon" },
      { emoji: "🪀", label: "Spinning Top" }
    ],
    q: "Which floating rubber toy was filled with helium?",
    opts: ["Red Balloon", "Kite", "Pinwheel", "Glider"],
    ans: "Red Balloon",
    exp: "The Red Balloon (🎈) hovered gently tied to the chair leg.",
    hint: "Tied with a ribbon and floats."
  },
  {
    title: "Jewelry Repair Desk",
    desc: "Study the precision accessories resting on the velvet pad.",
    items: [
      { emoji: "💍", label: "Gold Band Ring" },
      { emoji: "💎", label: "Facet Cut Diamond" },
      { emoji: "👑", label: "Miniature Tiara" },
      { emoji: "📿", label: "Pearl Necklace" },
      { emoji: "🔬", label: "Jeweler Loupe" },
      { emoji: "🧲", label: "Testing Magnet" }
    ],
    q: "Which circular adornment was crafted from polished gold?",
    opts: ["Gold Band Ring", "Bangle", "Brooch", "Locket"],
    ans: "Gold Band Ring",
    exp: "The Gold Band Ring (💍) was polished to a mirror finish.",
    hint: "Worn on the finger."
  },
  {
    title: "Astronomy Stargazer Table",
    desc: "Memorize the skywatching instruments on the balcony.",
    items: [
      { emoji: "🔭", label: "Star Telescope" },
      { emoji: "🗺️", label: "Constellation Chart" },
      { emoji: "🧭", label: "Brass Compass" },
      { emoji: "🌙", label: "Crescent Moon Model" },
      { emoji: "🔦", label: "Red Beam Torch" },
      { emoji: "☕", label: "Warm Thermos" }
    ],
    q: "What optical tube was aimed directly toward the stars?",
    opts: ["Star Telescope", "Periscope", "Kaleidoscope", "Binoculars"],
    ans: "Star Telescope",
    exp: "The Star Telescope (🔭) magnified distant planetary rings.",
    hint: "Long barrel tube on a tripod."
  },
  {
    title: "Cozy Fireside Hearth",
    desc: "Observe the homey items resting by the crackling fireplace.",
    items: [
      { emoji: "🔥", label: "Fireplace Flame" },
      { emoji: "🪵", label: "Oak Log" },
      { emoji: "🫖", label: "Iron Teapot" },
      { emoji: "🛋️", label: "Armchair" },
      { emoji: "🐱", label: "Sleeping Cat" },
      { emoji: "📖", label: "Leather Journal" }
    ],
    q: "Which kettle was simmering hot water above the embers?",
    opts: ["Iron Teapot", "Copper Kettle", "Clay Urn", "Glass Pitcher"],
    ans: "Iron Teapot",
    exp: "The heavy Iron Teapot (🫖) whistled quietly near the grate.",
    hint: "Cast-iron vessel for brewing tea."
  },
  {
    title: "Greenhouse Seedling Tray",
    desc: "Memorize the plant starter supplies in the nursery shed.",
    items: [
      { emoji: "🌱", label: "Sprouting Seedling" },
      { emoji: "🪴", label: "Clay Planter" },
      { emoji: "🚿", label: "Watering Can" },
      { emoji: "🧤", label: "Gardening Gloves" },
      { emoji: "🌿", label: "Herb Sprig" },
      { emoji: "🏷️", label: "Botanical Plant Tag" }
    ],
    q: "What young green growth had just emerged from the soil?",
    opts: ["Sprouting Seedling", "Vine", "Fern", "Cactus"],
    ans: "Sprouting Seedling",
    exp: "The Sprouting Seedling (🌱) opened its first pair of baby leaves.",
    hint: "Tender shoot with two small green leaves."
  },
  {
    title: "Pottery Workshop Wheel",
    desc: "Observe the clay shaping implements near the pottery wheel.",
    items: [
      { emoji: "🏺", label: "Tall Ceramic Urn" },
      { emoji: "🥣", label: "Shallow Bowl" },
      { emoji: "🧽", label: "Damp Sponge" },
      { emoji: "🔪", label: "Trimming Blade" },
      { emoji: "🪣", label: "Water Bucket" },
      { emoji: "🧵", label: "Cutting Wire" }
    ],
    q: "Which curved vessel was ready for glazing?",
    opts: ["Tall Ceramic Urn", "Teapot", "Goblet", "Flower Pot"],
    ans: "Tall Ceramic Urn",
    exp: "The Tall Ceramic Urn (🏺) stood dry on the top drying rack.",
    hint: "Ancient-style amphora shape."
  }
];

// Helper to convert theme to scene object
function formatScenes(themes, category, revealTime, startIdx) {
  return themes.map((t, i) => {
    const num = String(startIdx + i).padStart(2, '0');
    const id = `mc-${category.substring(0, 4)}-${num}`;
    return {
      id: id,
      gameType: "memory-challenge",
      difficulty: category.toLowerCase(),
      title: t.title,
      description: t.desc,
      revealTime: revealTime,
      items: t.items,
      question: t.q,
      options: t.opts,
      correctAnswer: t.ans,
      explanation: t.exp,
      hint: t.hint,
      questions: [
        {
          id: "q1",
          question: t.q,
          choices: t.opts,
          answer: t.ans
        }
      ]
    };
  });
}

const finalEasy = [...existingEasy, ...formatScenes(additionalEasyThemes, "easy", 8, 11)];
console.log(`Total Easy Scenes: ${finalEasy.length}`);

// ─────────────────────────────────────────────────────────────────────────────
// 30 Additional Medium Scenes (11-40, revealTime: 6)
// ─────────────────────────────────────────────────────────────────────────────
const additionalMedThemes = [
  {
    title: "Cyberpunk Deck Terminal",
    desc: "Memorize the neon-lit hardware modules connected to the cyberdeck in 6 seconds.",
    items: [
      { emoji: "💾", label: "Optical Data Chip" },
      { emoji: "🔌", label: "Fiber Interface Cable" },
      { emoji: "📟", label: "Encrypted Pager" },
      { emoji: "🔋", label: "Plasma Battery Pack" },
      { emoji: "🎧", label: "Audio Comm Headset" },
      { emoji: "🕶️", label: "HUD Cyber Visor" }
    ],
    q: "Which optical medium held the stolen network blueprints?",
    opts: ["Optical Data Chip", "Thumb Drive", "Magnetic Tape", "Hologram Disc"],
    ans: "Optical Data Chip",
    exp: "The Optical Data Chip (💾) glowed blue on the expansion rail.",
    hint: "Retro floppy-style data storage symbol."
  },
  {
    title: "Secret Agent Briefcase",
    desc: "Study the classified operative tools concealed inside the briefcase in 6 seconds.",
    items: [
      { emoji: "📷", label: "Micro Spy Camera" },
      { emoji: "🎙️", label: "Concealed Bug Transmitter" },
      { emoji: "🗺️", label: "Satellite Target Grid" },
      { emoji: "🗝️", label: "Skeleton Lockpick" },
      { emoji: "💉", label: "Antidote Syringe" },
      { emoji: "🛂", label: "Forged Diplomatic Passport" }
    ],
    q: "What audio surveillance tool was hidden beneath the lining?",
    opts: ["Concealed Bug Transmitter", "Wiretap", "Parabolic Mic", "Sonar Beacon"],
    ans: "Concealed Bug Transmitter",
    exp: "The Concealed Bug Transmitter (🎙️) relayed room chatter to the van.",
    hint: "Miniature microphone emblem."
  },
  {
    title: "Pirate Flagship Locker",
    desc: "Inspect the captain's loot and navigation gear in 6 seconds.",
    items: [
      { emoji: "🪙", label: "Gold Doubloon" },
      { emoji: "💎", label: "Blood Red Ruby" },
      { emoji: "🧭", label: "Pirate Pocket Compass" },
      { emoji: "📜", label: "Treasure Island Map" },
      { emoji: "🗡️", label: "Boarding Cutlass" },
      { emoji: "🦜", label: "Stuffed Green Macaw" }
    ],
    q: "Which brilliant red gemstone flashed inside the strongbox?",
    opts: ["Blood Red Ruby", "Garnet", "Carnelian", "Topaz"],
    ans: "Blood Red Ruby",
    exp: "A flawless Blood Red Ruby (💎) rested in the silk lining.",
    hint: "Vibrant crimson precious stone."
  },
  {
    title: "Ancient Pharaoh Tomb Antechamber",
    desc: "Memorize the sacred relics preserved inside the stone tomb in 6 seconds.",
    items: [
      { emoji: "⚱️", label: "Canopic Funerary Jar" },
      { emoji: "🪲", label: "Lapis Scarab Amulet" },
      { emoji: "👑", label: "Golden Nemes Headdress" },
      { emoji: "🪞", label: "Polished Bronze Mirror" },
      { emoji: "🪶", label: "Ma'at Justice Feather" },
      { emoji: "🏺", label: "Scented Myrrh Amphora" }
    ],
    q: "Which jeweled insect amulet symbolized immortality and protection?",
    opts: ["Lapis Scarab Amulet", "Golden Locust", "Scorpion Charm", "Winged Beetle"],
    ans: "Lapis Scarab Amulet",
    exp: "The Lapis Scarab Amulet (🪲) protected the heart seal.",
    hint: "Sacred Egyptian dung beetle."
  },
  {
    title: "Submarine Sonar Station",
    desc: "Observe the deep sea navigation instruments in 6 seconds.",
    items: [
      { emoji: "🧭", label: "Gyro Compass" },
      { emoji: "📡", label: "Active Sonar Transceiver" },
      { emoji: "🎛️", label: "Hydrophone Dial" },
      { emoji: "🧲", label: "Degaussing Coil" },
      { emoji: "🔦", label: "Halogen Spotlight" },
      { emoji: "🤿", label: "Emergency Scuba Mask" }
    ],
    q: "Which acoustic transceiver pinged underwater hull reflections?",
    opts: ["Active Sonar Transceiver", "Radar Dome", "Lidar Scanner", "Radio Antenna"],
    ans: "Active Sonar Transceiver",
    exp: "The Active Sonar Transceiver (📡) broadcast 10 kHz pings.",
    hint: "Satellite dish / sonar sensor icon."
  },
  {
    title: "Knight Castle Armory",
    desc: "Study the forged combat armor and weapons in 6 seconds.",
    items: [
      { emoji: "⚔️", label: "Crossed Longswords" },
      { emoji: "🛡️", label: "Falcon Heraldic Shield" },
      { emoji: "🪖", label: "Steel Visored Helm" },
      { emoji: "🏹", label: "Yew Longbow" },
      { emoji: "🪓", label: "Heavy Battleaxe" },
      { emoji: "🎺", label: "Herald Battle Horn" }
    ],
    q: "Which avian predator was emblazoned upon the knight's shield?",
    opts: ["Falcon", "Eagle", "Raven", "Hawk"],
    ans: "Falcon",
    exp: "The Falcon Heraldic Shield (🛡️) bore the silver falcon of the northern marches.",
    hint: "Fast diving bird of prey."
  },
  {
    title: "Mountaintop Astronomical Observatory",
    desc: "Memorize the telemetry gear inside the revolving dome in 6 seconds.",
    items: [
      { emoji: "🔭", label: "Infrared Reflector Tube" },
      { emoji: "💻", label: "Spectrograph Console" },
      { emoji: "🌐", label: "Celestial Armillary Sphere" },
      { emoji: "📷", label: "CCD Star Camera" },
      { emoji: "⏱️", label: "Atomic Master Chronometer" },
      { emoji: "📊", label: "Radial Velocity Chart" }
    ],
    q: "What brass spherical model illustrated the cosmic coordinates?",
    opts: ["Celestial Armillary Sphere", "Planetarium Globe", "Orrery", "Astrolabe"],
    ans: "Celestial Armillary Sphere",
    exp: "The Celestial Armillary Sphere (🌐) modeled equatorial coordinates.",
    hint: "Rings forming a skeletal celestial sphere."
  },
  {
    title: "Alchemist Potion Laboratory",
    desc: "Study the glass vessels brewing mystical tinctures in 6 seconds.",
    items: [
      { emoji: "🧪", label: "Luminescent Elixir" },
      { emoji: "⚗️", label: "Copper Alembic" },
      { emoji: "🍄", label: "Bioluminescent Spore" },
      { emoji: "🫙", label: "Dragon Scale Specimen" },
      { emoji: "🕯️", label: "Everburning Candle" },
      { emoji: "📜", label: "Transmutation Manuscript" }
    ],
    q: "Which glowing glass phial held the shimmering liquid formula?",
    opts: ["Luminescent Elixir", "Health Tonic", "Acid Vial", "Essence of Fire"],
    ans: "Luminescent Elixir",
    exp: "The Luminescent Elixir (🧪) glowed with an eerie green radiance.",
    hint: "Glass test tube holding glowing liquid."
  },
  {
    title: "Metropolitan Crime Scene Investigation",
    desc: "Memorize the marked forensic evidence markers in 6 seconds.",
    items: [
      { emoji: "🔍", label: "Fingerprint Lens" },
      { emoji: "🏷️", label: "Ballistic Evidence Tag" },
      { emoji: "🧤", label: "Latex Barrier Gloves" },
      { emoji: "👞", label: "Muddy Shoe Impression" },
      { emoji: "📱", label: "Recovered Burner Phone" },
      { emoji: "🔦", label: "UV Bloodlight" }
    ],
    q: "Which communications device was recovered as critical evidence?",
    opts: ["Recovered Burner Phone", "Walkie Talkie", "Smart Watch", "Pager"],
    ans: "Recovered Burner Phone",
    exp: "The Recovered Burner Phone (📱) contained encrypted call logs.",
    hint: "Small cellular phone."
  },
  {
    title: "Hospital Crash Cart Mobile Rig",
    desc: "Observe the emergency resuscitation medical modules in 6 seconds.",
    items: [
      { emoji: "⚡", label: "Defibrillator Electrodes" },
      { emoji: "🫁", label: "Ventilator Bellows" },
      { emoji: "💉", label: "Epinephrine Syringe" },
      { emoji: "🩺", label: "Electronic Stethoscope" },
      { emoji: "🩹", label: "Compression Trauma Pad" },
      { emoji: "📋", label: "Vitals Chart Clipboard" }
    ],
    q: "Which electrical shock pads were charged for cardiac arrest?",
    opts: ["Defibrillator Electrodes", "Pacemaker Leads", "ECG Sensors", "Tens Unit"],
    ans: "Defibrillator Electrodes",
    exp: "The Defibrillator Electrodes (⚡) were pre-charged to 200 Joules.",
    hint: "Paddles delivering electric shock."
  },
  {
    title: "Air Traffic Control Flight Tower",
    desc: "Memorize the airspace routing displays in 6 seconds.",
    items: [
      { emoji: "🖥️", label: "Primary Radar Screen" },
      { emoji: "✈️", label: "Supersonic Jet Blip" },
      { emoji: "🎙️", label: "Radio Dispatch Boom" },
      { emoji: "🗺️", label: "Runway Vector Chart" },
      { emoji: "🚨", label: "Weather Windshear Alert" },
      { emoji: "⏱️", label: "UTC Flight Chronograph" }
    ],
    q: "Which aircraft blip was tracked moving along vector 090?",
    opts: ["Supersonic Jet Blip", "Cargo Airliner", "Helicopter", "Private Jet"],
    ans: "Supersonic Jet Blip",
    exp: "The Supersonic Jet Blip (✈️) approached cruising at Mach 1.4.",
    hint: "Twin-engine passenger aircraft emblem."
  },
  {
    title: "Autonomous Robotics Assembly Lab",
    desc: "Study the automated machinery components in 6 seconds.",
    items: [
      { emoji: "🦾", label: "Titanium Robotic Arm" },
      { emoji: "🤖", label: "Bipedal Sentry Droid" },
      { emoji: "⚙️", label: "Harmonic Gearbox" },
      { emoji: "🔋", label: "Lithium Power Core" },
      { emoji: "💻", label: "Firmware Flasher" },
      { emoji: "🦿", label: "Articulated Bionic Leg" }
    ],
    q: "What robotic manipulator reached out with motorized precision?",
    opts: ["Titanium Robotic Arm", "Hydraulic Gripper", "Magnetic Hoist", "Laser Welder"],
    ans: "Titanium Robotic Arm",
    exp: "The Titanium Robotic Arm (🦾) was calibrated to 0.01mm tolerance.",
    hint: "Mechanical arm prosthesis / industrial arm."
  },
  {
    title: "Grand Prix Formula Pit Lane",
    desc: "Take note of the rapid tire-change tools in 6 seconds.",
    items: [
      { emoji: "🏎️", label: "Championship Racecar" },
      { emoji: "🛞", label: "Soft Compound Slick Tire" },
      { emoji: "🔧", label: "Pneumatic Wheel Gun" },
      { emoji: "⛽", label: "High-Flow Fuel Rig" },
      { emoji: "🏁", label: "Checkered Signal Flag" },
      { emoji: "🧯", label: "CO2 Fire Suppressor" }
    ],
    q: "Which pneumatic tool was used to secure the central wheel nut?",
    opts: ["Pneumatic Wheel Gun", "Torque Wrench", "Impact Drill", "Jack Stand"],
    ans: "Pneumatic Wheel Gun",
    exp: "The high-rpm Pneumatic Wheel Gun (🔧) loosened the lug in 0.8 seconds.",
    hint: "Air wrench icon."
  },
  {
    title: "Volcanology Monitoring Outpost",
    desc: "Observe the seismic indicators near the active crater in 6 seconds.",
    items: [
      { emoji: "🌋", label: "Smoking Caldera" },
      { emoji: "📈", label: "Seismograph Drum Chart" },
      { emoji: "🌡️", label: "Infrared Pyrometer" },
      { emoji: "🪨", label: "Pumice Basalt Sample" },
      { emoji: "🥽", label: "Sulfur Gas Goggles" },
      { emoji: "🚁", label: "Evacuation Copter" }
    ],
    q: "What scientific chart tracked the magnitude of tremors under the crust?",
    opts: ["Seismograph Drum Chart", "Tiltmeter Graph", "Gas Spectrometer", "Thermal Map"],
    ans: "Seismograph Drum Chart",
    exp: "The Seismograph Drum Chart (📈) registered harmonic volcanic tremor.",
    hint: "Graph tracking seismic vibrations."
  },
  {
    title: "Deep Sea Trench Exploration Rig",
    desc: "Memorize the abyssal sub components in 6 seconds.",
    items: [
      { emoji: "🫧", label: "Oxygen Scrubber Bubbles" },
      { emoji: "🔦", label: "Deep-Sea Xenon Beam" },
      { emoji: "🦑", label: "Colossal Squid" },
      { emoji: "🪨", label: "Manganese Nodule" },
      { emoji: "📹", label: "Pressure Hull 4K Camera" },
      { emoji: "🧲", label: "Sediment Sampler Claw" }
    ],
    q: "Which deep-sea cephalopod lurked just past the floodlights?",
    opts: ["Colossal Squid", "Vampire Octopus", "Anglerfish", "Viperfish"],
    ans: "Colossal Squid",
    exp: "The Colossal Squid (🦑) glided silently at 3,000 meters depth.",
    hint: "Ten-armed tentacled predator."
  },
  {
    title: "Antarctic Expedition Snowcat",
    desc: "Memorize the polar survival provisions in 6 seconds.",
    items: [
      { emoji: "❄️", label: "Glacial Ice Core" },
      { emoji: "🧊", label: "Permafrost Drill" },
      { emoji: "🛷", label: "Kevlar Cargo Sled" },
      { emoji: "📻", label: "High-Frequency Radio" },
      { emoji: "🧤", label: "Fur Lined Mitts" },
      { emoji: "🪓", label: "Steel Ice Axe" }
    ],
    q: "What geological specimen was retrieved from 800 meters beneath the ice sheet?",
    opts: ["Glacial Ice Core", "Fossil Stone", "Frozen Amber", "Meteorite Shard"],
    ans: "Glacial Ice Core",
    exp: "The Glacial Ice Core (❄️) preserved atmospheric gas bubbles from 100,000 years ago.",
    hint: "Cylindrical sample of ancient ice."
  },
  {
    title: "Old World Clockmaker Bench",
    desc: "Study the horological precision gears in 6 seconds.",
    items: [
      { emoji: "🕰️", label: "Pendulum Wall Clock" },
      { emoji: "⚙️", label: "Jeweled Escapement Wheel" },
      { emoji: "🪛", label: "Watchmaker Screwdriver" },
      { emoji: "🔍", label: "Eyepiece Loupe" },
      { emoji: "⏳", label: "Brass Hourglass" },
      { emoji: "🛎️", label: "Hourly Chime Bell" }
    ],
    q: "Which critical toothed mechanism regulated the ticking movement?",
    opts: ["Jeweled Escapement Wheel", "Balance Spring", "Mainspring Barrel", "Crown Gear"],
    ans: "Jeweled Escapement Wheel",
    exp: "The Jeweled Escapement Wheel (⚙️) regulated energy release to the balance.",
    hint: "Interlocking brass gear icon."
  },
  {
    title: "Cryptographic Cipher Center",
    desc: "Inspect the mechanical code rotors in 6 seconds.",
    items: [
      { emoji: "🔐", label: "Rotary Rotor Lock" },
      { emoji: "⌨️", label: "Teletype Keyboard" },
      { emoji: "📜", label: "One-Time Pad Key" },
      { emoji: "💡", label: "Lampboard Alphabet" },
      { emoji: "🔌", label: "Plugboard Stecker Cable" },
      { emoji: "📻", label: "Intercept Receiver" }
    ],
    q: "Which component displayed illuminated letters when keys were struck?",
    opts: ["Lampboard Alphabet", "Cathode Tube", "Nixie Display", "Ticker Tape"],
    ans: "Lampboard Alphabet",
    exp: "The Lampboard Alphabet (💡) illuminated the substituted cipher letters.",
    hint: "Lightbulb indicator bank."
  },
  {
    title: "Desert Archaeological Dig",
    desc: "Memorize the uncovered antiquities in 6 seconds.",
    items: [
      { emoji: "🏺", label: "Clay Wine Amphora" },
      { emoji: "🪙", label: "Bronze Roman Coin" },
      { emoji: "🗡️", label: "Corroded Bronze Dagger" },
      { emoji: "🦴", label: "Fossilized Femur" },
      { emoji: "🖌️", label: "Excavation Soft Brush" },
      { emoji: "📐", label: "Grid Reference Frame" }
    ],
    q: "Which skeletal relic was carefully dusted free of sandstone?",
    opts: ["Fossilized Femur", "Skull Fragment", "Saber Tooth", "Rib Cage"],
    ans: "Fossilized Femur",
    exp: "A Fossilized Femur (🦴) from the prehistoric era was logged in quadrant 3.",
    hint: "Bone specimen icon."
  },
  {
    title: "High Security Diamond Safe",
    desc: "Study the laser grid and showcase contents in 6 seconds.",
    items: [
      { emoji: "💎", label: "The Star of India Diamond" },
      { emoji: "🚨", label: "Infrared Motion Sensor" },
      { emoji: "🔒", label: "Titanium Vault Dial" },
      { emoji: "📹", label: "360 Dome Camera" },
      { emoji: "🧯", label: "Halon Fire Nozzle" },
      { emoji: "💳", label: "Biometric Swipe Card" }
    ],
    q: "What legendary gemstone was displayed on the central velvet pedestal?",
    opts: ["The Star of India Diamond", "Hope Sapphire", "Orlov Diamond", "Koh-i-Noor"],
    ans: "The Star of India Diamond",
    exp: "The Star of India Diamond (💎) was locked behind bullet-resistant quartz.",
    hint: "Massive sparkling cut jewel."
  },
  {
    title: "Tactical Drone Ground Control",
    desc: "Memorize the telemetry links and drone status in 6 seconds.",
    items: [
      { emoji: "🛰️", label: "Uplink Transponder" },
      { emoji: "🕹️", label: "Dual Gimbal Joystick" },
      { emoji: "🛩️", label: "Recon Drone Drone 1" },
      { emoji: "🗺️", label: "Topographic Grid Map" },
      { emoji: "🔋", label: "Swappable Battery Cell" },
      { emoji: "📡", label: "Phased Array Antenna" }
    ],
    q: "What handheld controller guided the recon drone's flight path?",
    opts: ["Dual Gimbal Joystick", "Trackball", "Gamepad", "Throttle Lever"],
    ans: "Dual Gimbal Joystick",
    exp: "The Dual Gimbal Joystick (🕹️) controlled pitch and yaw.",
    hint: "Arcade-style control stick."
  },
  {
    title: "Space Habitat Hydroponic Bay",
    desc: "Observe the zero-gravity orbital crops in 6 seconds.",
    items: [
      { emoji: "🥬", label: "Hydroponic Romaine" },
      { emoji: "🍅", label: "Bioengineered Tomato" },
      { emoji: "💧", label: "Nutrient Mister" },
      { emoji: "💡", label: "UV Grow Lamp" },
      { emoji: "🌡️", label: "Atmosphere Regulator" },
      { emoji: "🧪", label: "Ph Mineral Balance Vial" }
    ],
    q: "Which red bioengineered fruit was thriving in the nutrient mist?",
    opts: ["Bioengineered Tomato", "Strawberries", "Bell Pepper", "Apple"],
    ans: "Bioengineered Tomato",
    exp: "The Bioengineered Tomato (🍅) produced clusters in microgravity.",
    hint: "Classic round red salad staple."
  },
  {
    title: "Supercomputer Quantum Chill Bay",
    desc: "Memorize the cryogenic quantum components in 6 seconds.",
    items: [
      { emoji: "❄️", label: "Dilution Chandelier" },
      { emoji: "🧮", label: "512 Qubit Processor" },
      { emoji: "🔌", label: "Gold Coaxial Weave" },
      { emoji: "🌡️", label: "Millikelvin Thermometer" },
      { emoji: "💻", label: "Error Correction Cluster" },
      { emoji: "🛡️", label: "Mu-Metal Shielding" }
    ],
    q: "What processor chip executed the Shor factorization algorithms?",
    opts: ["512 Qubit Processor", "Optic Core", "Tensor Unit", "Silicon Wafer"],
    ans: "512 Qubit Processor",
    exp: "The 512 Qubit Processor (🧮) calculated entangled states at 15 mK.",
    hint: "Abacus symbol for quantum computing."
  },
  {
    title: "Bullet Train Driver Cabin",
    desc: "Take note of the high-speed transit controls in 6 seconds.",
    items: [
      { emoji: "🚄", label: "Shinkansen Train" },
      { emoji: "🕹️", label: "Master Throttle Handle" },
      { emoji: "📟", label: "ATC Speed Limiter" },
      { emoji: "📡", label: "Trackway Balise Sensor" },
      { emoji: "🚨", label: "Emergency Magnetic Brake" },
      { emoji: "📻", label: "Conductor Comm Link" }
    ],
    q: "What high-speed bullet train was barreling forward at 320 km/h?",
    opts: ["Shinkansen Train", "Maglev Capsule", "Express Metro", "Steam Engine"],
    ans: "Shinkansen Train",
    exp: "The sleek aerodynamic Shinkansen Train (🚄) traversed the coastal viaduct.",
    hint: "Modern pointed nose train icon."
  },
  {
    title: "African Savanna Safari Outpost",
    desc: "Observe the wildlife viewing equipment on the tower deck in 6 seconds.",
    items: [
      { emoji: "🦁", label: "Resting Lion Pride" },
      { emoji: "🐘", label: "Bull Elephant" },
      { emoji: "🦒", label: "Tall Giraffe" },
      { emoji: "🦓", label: "Zebra Herd" },
      { emoji: "🔭", label: "Spotting Scope" },
      { emoji: "📸", label: "Telephoto Camera" }
    ],
    q: "Which apex feline predator was surveyed through the binoculars?",
    opts: ["Resting Lion Pride", "Cheetah", "Leopard", "Hyena"],
    ans: "Resting Lion Pride",
    exp: "The Resting Lion Pride (🦁) basked under the shade of the acacia tree.",
    hint: "King of the jungle with a golden mane."
  },
  {
    title: "Himalayan Alpine Basecamp",
    desc: "Memorize the high-altitude climbing equipment in 6 seconds.",
    items: [
      { emoji: "🏔️", label: "Everest Summit Peak" },
      { emoji: "⛺", label: "Dome Expedition Tent" },
      { emoji: "🫁", label: "Oxygen Cylinder Pack" },
      { emoji: "🥾", label: "Steel Crampon Boots" },
      { emoji: "🧗", label: "Climbing Carabiner" },
      { emoji: "🔥", label: "Pressurized Kerosene Stove" }
    ],
    q: "What gas canister enabled breathing in the death zone above 8,000 meters?",
    opts: ["Oxygen Cylinder Pack", "Nitrogen Tank", "Compressed Air", "Helium Cannister"],
    ans: "Oxygen Cylinder Pack",
    exp: "The Oxygen Cylinder Pack (🫁) delivered supplementary O2 on the ridge.",
    hint: "Lungs / respiratory equipment symbol."
  },
  {
    title: "Supercarrier Flight Operations Deck",
    desc: "Observe the jet launch catapults in 6 seconds.",
    items: [
      { emoji: "⚓", label: "Carrier Anchor Winch" },
      { emoji: "🛩️", label: "Stealth Fighter Jet" },
      { emoji: "🪖", label: "Shooter Yellow Vest" },
      { emoji: "🪢", label: "Arresting Cable" },
      { emoji: "🚨", label: "Wave-Off Beacon" },
      { emoji: "⛽", label: "Jet-A Refueling Hose" }
    ],
    q: "What heavy steel cable snagged the tailhook to halt landing aircraft?",
    opts: ["Arresting Cable", "Towing Hawser", "Safety Net", "Mooring Rope"],
    ans: "Arresting Cable",
    exp: "The heavy Arresting Cable (🪢) absorbed 50 tons of aircraft kinetic energy.",
    hint: "High-tensile wire rope knot."
  },
  {
    title: "Glowworm Subterranean Grotto",
    desc: "Study the subterranean wonders inside the cave in 6 seconds.",
    items: [
      { emoji: "🪨", label: "Calcite Stalactite" },
      { emoji: "💡", label: "Arachnocampa Bioluminescence" },
      { emoji: "🚣", label: "Underground River Canoe" },
      { emoji: "🦇", label: "Fruit Bat Cluster" },
      { emoji: "💧", label: "Mineral Water Pool" },
      { emoji: "🔦", label: "Caving Headlamp" }
    ],
    q: "Which nocturnal flying mammal hung suspended from the cave ceiling?",
    opts: ["Fruit Bat Cluster", "Swallow", "Owl", "Flying Squirrel"],
    ans: "Fruit Bat Cluster",
    exp: "A Fruit Bat Cluster (🦇) roosted above the subterranean river.",
    hint: "Winged nocturnal mammal."
  },
  {
    title: "Royal Imperial Regalia Treasury",
    desc: "Memorize the monarch's coronation artifacts in 6 seconds.",
    items: [
      { emoji: "👑", label: "Imperial State Crown" },
      { emoji: "🪄", label: "Sovereign Scepter with Cross" },
      { emoji: "🌐", label: "Golden Globus Cruciger" },
      { emoji: "🗡️", label: "Jeweled Sword of Offering" },
      { emoji: "💍", label: "Coronation Ring" },
      { emoji: "📜", label: "Ancient Parchment Oath" }
    ],
    q: "Which gold rod topped with a cross symbolized imperial authority?",
    opts: ["Sovereign Scepter with Cross", "Mace", "Staff", "Crosier"],
    ans: "Sovereign Scepter with Cross",
    exp: "The Sovereign Scepter with Cross (🪄) was borne in the right hand.",
    hint: "Wand / rod of royalty."
  },
  {
    title: "Level 4 Biohazard Cleanroom",
    desc: "Study the viral containment barriers in 6 seconds.",
    items: [
      { emoji: "☣️", label: "Biohazard Warning Trefoil" },
      { emoji: "🥽", label: "Pressurized Positive Suit" },
      { emoji: "🧫", label: "Petri Culture Dish" },
      { emoji: "🔬", label: "Confocal Electron Scope" },
      { emoji: "🚪", label: "Airtight Airlock Seal" },
      { emoji: "🚿", label: "Chemical Decon Shower" }
    ],
    q: "Which culture vessel contained growing microorganism colonies?",
    opts: ["Petri Culture Dish", "Test Tube", "Flask", "Beaker"],
    ans: "Petri Culture Dish",
    exp: "The Petri Culture Dish (🧫) nurtured isolated bacterial strains.",
    hint: "Circular glass culture plate."
  }
];

const finalMed = [...existingMed, ...formatScenes(additionalMedThemes, "medium", 6, 11)];
console.log(`Total Medium Scenes: ${finalMed.length}`);

// ─────────────────────────────────────────────────────────────────────────────
// 30 Additional Hard Scenes (11-40, revealTime: 5)
// ─────────────────────────────────────────────────────────────────────────────
const additionalHardThemes = [
  {
    title: "Orbital Defense Battle Platform",
    desc: "Scan the orbital railgun fire control telemetry in 5 seconds.",
    items: [
      { emoji: "🛰️", label: "Orbital Targeting Array" },
      { emoji: "⚡", label: "Electromagnetic Railgun" },
      { emoji: "🔋", label: "Capacitor Bank 9" },
      { emoji: "🚀", label: "Tungsten Kinetic Slug" },
      { emoji: "🛡️", label: "Point-Defense Laser" },
      { emoji: "📡", label: "Hyperwave Comms Array" }
    ],
    q: "What dense metal projectile was loaded into the electromagnetic railgun?",
    opts: ["Tungsten Kinetic Slug", "Depleted Uranium Dart", "Titanium Shell", "Lead Slug"],
    ans: "Tungsten Kinetic Slug",
    exp: "The Tungsten Kinetic Slug (🚀) accelerated at 30 km/s.",
    hint: "Heavy refractory metal bullet."
  },
  {
    title: "Tokamak Magnetic Fusion Core",
    desc: "Analyze the 100-million degree plasma containment telemetry in 5 seconds.",
    items: [
      { emoji: "⚛️", label: "Deuterium-Tritium Fuel" },
      { emoji: "🧲", label: "Toroidal Field Magnet" },
      { emoji: "🔥", label: "Confined Plasma Arc" },
      { emoji: "🛡️", label: "Beryllium Divertor Tile" },
      { emoji: "💻", label: "MHD Stabilization Loop" },
      { emoji: "❄️", label: "Liquid Helium Cryostat" }
    ],
    q: "Which light element isotopes fueled the core nuclear reaction?",
    opts: ["Deuterium-Tritium Fuel", "Helium-3", "Boron-11", "Lithium Hydride"],
    ans: "Deuterium-Tritium Fuel",
    exp: "Deuterium and Tritium (⚛️) fused to release 14.1 MeV neutrons.",
    hint: "Heavy isotopes of hydrogen."
  },
  {
    title: "Molecular Nanotech Synthesizer",
    desc: "Study the atomic-scale carbon lattice assembly in 5 seconds.",
    items: [
      { emoji: "🔬", label: "Scanning Probe Tip" },
      { emoji: "💎", label: "Diamondoid Nanoribbon" },
      { emoji: "🧬", label: "DNA Origami Scaffold" },
      { emoji: "⚙️", label: "Molecular Molecular Gear" },
      { emoji: "🧪", label: "Fullerene C60 Solution" },
      { emoji: "💻", label: "Atomic Position Controller" }
    ],
    q: "Which spherical carbon cage molecule was suspended in solution?",
    opts: ["Fullerene C60 Solution", "Graphene Sheet", "Carbon Nanotube", "Amorphous Carbon"],
    ans: "Fullerene C60 Solution",
    exp: "The Fullerene C60 Buckyball (🧪) solution was injected into the vapor chamber.",
    hint: "Soccer-ball shaped carbon cluster."
  },
  {
    title: "Stealth Interceptor 6th-Gen Cockpit",
    desc: "Memorize the multi-spectrum radar displays in 5 seconds.",
    items: [
      { emoji: "🛩️", label: "Ghostwing Interceptor" },
      { emoji: "🕶️", label: "Retinal Projection Helmet" },
      { emoji: "🎮", label: "Side-Stick Fly-By-Light" },
      { emoji: "📡", label: "Active AESA Radar" },
      { emoji: "🚨", label: "Laser Warning Receiver" },
      { emoji: "🚀", label: "Internal Bay Ramjet" }
    ],
    q: "What advanced helmet beamed flight data straight into the pilot's eyes?",
    opts: ["Retinal Projection Helmet", "HUD Glass", "Night Vision Visor", "Binocular Monocle"],
    ans: "Retinal Projection Helmet",
    exp: "The Retinal Projection Helmet (🕶️) projected 360-degree sensor fusion imagery.",
    hint: "Cybernetic optics visor."
  },
  {
    title: "Hadron Supercollider Detector Hub",
    desc: "Inspect the particle collision telemetry in 5 seconds.",
    items: [
      { emoji: "🌀", label: "Proton Collision Vertex" },
      { emoji: "🧲", label: "Superconducting Solenoid" },
      { emoji: "📊", label: "Muon Chamber Spectrometer" },
      { emoji: "💡", label: "Liquid Argon Calorimeter" },
      { emoji: "💻", label: "Petabyte Buffer Farm" },
      { emoji: "⚛️", label: "Higgs Boson Signature" }
    ],
    q: "Which subatomic signature decaying into two photons was flagged?",
    opts: ["Higgs Boson Signature", "Top Quark", "Tau Lepton", "Z Boson"],
    ans: "Higgs Boson Signature",
    exp: "The Higgs Boson Signature (⚛️) was reconstructed at 125.1 GeV.",
    hint: "The famous 'God Particle'."
  },
  {
    title: "Earth Crust Ultra-Deep Drill Site",
    desc: "Study the mantle penetration sensors in 5 seconds.",
    items: [
      { emoji: "🪨", label: "Mantle Peridotite Core" },
      { emoji: "🔩", label: "Diamond Impregnated Bit" },
      { emoji: "🌡️", label: "Deep Borehole Thermocouple" },
      { emoji: "🛢️", label: "Synthetic Drilling Mud" },
      { emoji: "📈", label: "Lithological Sonic Log" },
      { emoji: "⚙️", label: "Hydraulic Top Drive" }
    ],
    q: "What ultra-hard industrial abrasive tipped the deep drilling tool?",
    opts: ["Diamond Impregnated Bit", "Tungsten Carbide", "Titanium Nitride", "Silicon Carbide"],
    ans: "Diamond Impregnated Bit",
    exp: "The Diamond Impregnated Bit (🔩) penetrated dense basalt at 12 km depth.",
    hint: "Hardest known natural mineral."
  },
  {
    title: "Global Cyber Command SOC Center",
    desc: "Scan the nation-state cyber warfare monitors in 5 seconds.",
    items: [
      { emoji: "🛡️", label: "Air-Gapped Firewall" },
      { emoji: "💻", label: "Zero-Day Exploit Payload" },
      { emoji: "🚨", label: "DDoS Mitigation Shunt" },
      { emoji: "🗺️", label: "Global Threat Heatmap" },
      { emoji: "🔐", label: "Quantum Key Distribution" },
      { emoji: "💾", label: "Hardened Backup Vault" }
    ],
    q: "What cryptography protocol leveraged photon states to guarantee privacy?",
    opts: ["Quantum Key Distribution", "RSA 4096", "AES 256", "Elliptic Curve"],
    ans: "Quantum Key Distribution",
    exp: "Quantum Key Distribution (🔐) encrypted critical satellite relays.",
    hint: "Unbreakable quantum physics encryption."
  },
  {
    title: "Ancient Mayan High Pyramid Chamber",
    desc: "Analyze the jade offerings and codex glyphs in 5 seconds.",
    items: [
      { emoji: "👑", label: "Jade Mosaic Death Mask" },
      { emoji: "📜", label: "Dresden Venus Codex" },
      { emoji: "🗡️", label: "Obsidian Sacrificial Blade" },
      { emoji: "🏺", label: "Incense Copal Urn" },
      { emoji: "🐆", label: "Polished Jaguar Effigy" },
      { emoji: "🪙", label: "Quetzal Feather Plaque" }
    ],
    q: "What volcanic glass mineral was knapped to razor sharpness?",
    opts: ["Obsidian Sacrificial Blade", "Flint", "Chert", "Basalt"],
    ans: "Obsidian Sacrificial Blade",
    exp: "The Obsidian Sacrificial Blade (🗡️) had an edge thinner than steel.",
    hint: "Glossy black volcanic glass."
  },
  {
    title: "Crispr Gene Editing Bio-Sequencer",
    desc: "Examine the synthetic nucleotide chains in 5 seconds.",
    items: [
      { emoji: "🧬", label: "Dual-Strand Synthetic DNA" },
      { emoji: "✂️", label: "Cas9 Endonuclease Enzyme" },
      { emoji: "🧫", label: "Target Gene Plasmid" },
      { emoji: "🔬", label: "Fluorescence Scanner" },
      { emoji: "🧪", label: "Buffer Reagent Ph 7.4" },
      { emoji: "💻", label: "Bioinformatics Pipeline" }
    ],
    q: "Which molecular scissors enzyme clipped the targeted nucleotide sequence?",
    opts: ["Cas9 Endonuclease Enzyme", "RNA Polymerase", "DNA Ligase", "Amylase"],
    ans: "Cas9 Endonuclease Enzyme",
    exp: "The Cas9 Endonuclease Enzyme (✂️) made a precise double-stranded break.",
    hint: "Key enzyme of the CRISPR-Cas9 system."
  },
  {
    title: "Deep Space Voyager Probe Bus",
    desc: "Scan the interstellar probe instruments in 5 seconds.",
    items: [
      { emoji: "📡", label: "3.7m High-Gain Dish" },
      { emoji: "📀", label: "Gold Plated Phonograph Record" },
      { emoji: "🔋", label: "Plutonium RTG Generator" },
      { emoji: "🧲", label: "Magnetometer Boom" },
      { emoji: "📸", label: "Narrow Angle Cosmic Camera" },
      { emoji: "🌌", label: "Heliopause Boundary Sensor" }
    ],
    q: "What golden cultural record was bolted to the spacecraft's side?",
    opts: ["Gold Plated Phonograph Record", "Golden Plaque", "Memory Capsule", "Holo Disc"],
    ans: "Gold Plated Phonograph Record",
    exp: "The Gold Plated Phonograph Record (📀) carried greetings from Earth into deep space.",
    hint: "Golden phonograph disc with instructions."
  },
  {
    title: "Neutrino IceCube Detector Station",
    desc: "Study the optical sensor telemetry in 5 seconds.",
    items: [
      { emoji: "🧊", label: "2.5km Antarctic Borehole" },
      { emoji: "💡", label: "Digital Optical Module" },
      { emoji: "⚡", label: "Cherenkov Blue Radiation Flash" },
      { emoji: "📡", label: "South Pole Fiber Relay" },
      { emoji: "📊", label: "Muon Track Reconstruction" },
      { emoji: "⚛️", label: "Astrophysical Tau Neutrino" }
    ],
    q: "What characteristic blue light flashed when particles exceeded the speed of light in ice?",
    opts: ["Cherenkov Blue Radiation Flash", "Bioluminescence", "Aurora Light", "Scintillation Pulse"],
    ans: "Cherenkov Blue Radiation Flash",
    exp: "Cherenkov Blue Radiation Flash (⚡) revealed high-energy particle tracks.",
    hint: "Eerie blue glow in nuclear reactors and particle detectors."
  },
  {
    title: "Event Horizon Ergosphere Probe",
    desc: "Memorize the extreme relativistic parameters in 5 seconds.",
    items: [
      { emoji: "🕳️", label: "Kerr Rotating Black Hole" },
      { emoji: "🌌", label: "Accretion Disk Doppler Shift" },
      { emoji: "⏱️", label: "Gravitational Time Dilation Gauge" },
      { emoji: "🛡️", label: "Tachyon Dissipation Shield" },
      { emoji: "🚀", label: "Penrose Energy Tap" },
      { emoji: "📡", label: "Graviton Transceiver" }
    ],
    q: "What gravitational vortex curved spacetime into an inescapable singularity?",
    opts: ["Kerr Rotating Black Hole", "Neutron Star", "White Dwarf", "Quasar Jet"],
    ans: "Kerr Rotating Black Hole",
    exp: "The Kerr Rotating Black Hole (🕳️) dragged inertial frames within its ergosphere.",
    hint: "Dark void with immense gravitational pull."
  },
  {
    title: "Martian Subsurface Ice Drill",
    desc: "Observe the planetary surface exploration modules in 5 seconds.",
    items: [
      { emoji: "🤖", label: "Six-Wheeled Rover Chassis" },
      { emoji: "🔩", label: "Pneumatic Permafrost Core Drill" },
      { emoji: "🧪", label: "Raman Mineral Spectrometer" },
      { emoji: "☀️", label: "High-Efficiency Solar Wings" },
      { emoji: "📡", label: "X-Band Direct-to-Earth Antenna" },
      { emoji: "🪨", label: "Hematite Blueberry Sphere" }
    ],
    q: "Which miniature spherical mineral concretions were discovered in the sediment?",
    opts: ["Hematite Blueberry Sphere", "Basalt Pebble", "Silica Bead", "Quartz Crystal"],
    ans: "Hematite Blueberry Sphere",
    exp: "The Hematite Blueberry Sphere (🪨) indicated ancient liquid groundwater.",
    hint: "Famous spherical Martian mineral beads."
  },
  {
    title: "Sub-Zero Cryostasis Pod",
    desc: "Memorize the astronaut life support indicators in 5 seconds.",
    items: [
      { emoji: "🧊", label: "Vitrification Cryo Chamber" },
      { emoji: "🫀", label: "Induced Hypothermia Monitor" },
      { emoji: "💉", label: "Anti-Freeze Cryoprotectant" },
      { emoji: "💻", label: "Biostasis Neural Monitor" },
      { emoji: "⚡", label: "Capacitive Rewarming Coil" },
      { emoji: "🛡️", label: "Lead Radiation Baffling" }
    ],
    q: "What bio-chemical solution prevented ice crystals from shredding cellular membranes?",
    opts: ["Anti-Freeze Cryoprotectant", "Saline Solution", "Glycerin Gel", "Plasma Expander"],
    ans: "Anti-Freeze Cryoprotectant",
    exp: "The Anti-Freeze Cryoprotectant (💉) enabled glass-like vitrification without crystal damage.",
    hint: "Medical fluid preventing ice damage."
  },
  {
    title: "Vatican Secret Underground Archive",
    desc: "Study the centuries-old codices in 5 seconds.",
    items: [
      { emoji: "📜", label: "Papal Bull of Excommunication" },
      { emoji: "🗝️", label: "St. Peter Bronze Key" },
      { emoji: "🕯️", label: "Beeswax Seal Stamp" },
      { emoji: "📖", label: "Galileo Trial Transcript" },
      { emoji: "👑", label: "Crusader Patriarch Cross" },
      { emoji: "🪞", label: "Illuminated Magnifying Lens" }
    ],
    q: "Which historical heresy proceeding manuscript was cataloged in the drawer?",
    opts: ["Galileo Trial Transcript", "Da Vinci Diary", "Templar Charter", "Magna Carta"],
    ans: "Galileo Trial Transcript",
    exp: "The handwritten Galileo Trial Transcript (📖) was filed under Section 4.",
    hint: "Trial of the famed Italian astronomer."
  },
  {
    title: "Wall Street High-Frequency Node",
    desc: "Memorize the microsecond trade telemetry in 5 seconds.",
    items: [
      { emoji: "💻", label: "FPGA Direct-Execution Board" },
      { emoji: "🔌", label: "Dark Fiber Laser Transceiver" },
      { emoji: "⏱️", label: "Rubidium Atomic Timestamp" },
      { emoji: "📊", label: "Level 3 Order Book Stream" },
      { emoji: "📈", label: "Arbitrage Spread Calculator" },
      { emoji: "🚨", label: "Circuit Breaker Killswitch" }
    ],
    q: "What atomic timing standard synchronized transaction timestamps to 10 nanoseconds?",
    opts: ["Rubidium Atomic Timestamp", "Quartz Clock", "GPS Signal", "NTP Server"],
    ans: "Rubidium Atomic Timestamp",
    exp: "The Rubidium Atomic Timestamp (⏱️) provided legal regulatory compliance.",
    hint: "Element 37 atomic clock."
  },
  {
    title: "Mars Atmospheric Terraform Complex",
    desc: "Scan the climate modification reactor status in 5 seconds.",
    items: [
      { emoji: "🏭", label: "Fluorocarbon Gas Generator" },
      { emoji: "🧊", label: "Dry Ice Polar Cap Sublimator" },
      { emoji: "🪞", label: "Orbital Mirror Solar Reflector" },
      { emoji: "🌱", label: "Genetically Modified Lichen" },
      { emoji: "🌡️", label: "Planetary Barometer" },
      { emoji: "💨", label: "Atmospheric Density Gauge" }
    ],
    q: "What reflective mega-structure redirected extra sunlight toward the Martian south pole?",
    opts: ["Orbital Mirror Solar Reflector", "Solar Sail", "Dyson Ring", "Laser Emitter"],
    ans: "Orbital Mirror Solar Reflector",
    exp: "The 100km Orbital Mirror Solar Reflector (🪞) vaporized frozen CO2.",
    hint: "Gigantic mirror orbiting in space."
  },
  {
    title: "Challenger Deep Ultra-Submarine Cockpit",
    desc: "Examine the 11,000-meter depth gauges in 5 seconds.",
    items: [
      { emoji: "🌊", label: "1,100 Atmosphere Pressure Dial" },
      { emoji: "🔮", label: "Acrylic Spherical Viewport" },
      { emoji: "🧲", label: "Syntactic Foam Buoyancy Pod" },
      { emoji: "🎙️", label: "Underwater Acoustic Comm" },
      { emoji: "💡", label: "High-Flux LED Lightbar" },
      { emoji: "🧭", label: "Inertial Dead-Reckoning Nav" }
    ],
    q: "What transparent spherical capsule gave the pilot panoramic sightlines?",
    opts: ["Acrylic Spherical Viewport", "Sapphire Lens", "Quartz Window", "Titanium Slit"],
    ans: "Acrylic Spherical Viewport",
    exp: "The 7-inch thick Acrylic Spherical Viewport (🔮) resisted crushing ocean pressure.",
    hint: "Curved crystal-clear polymer bubble."
  },
  {
    title: "Lunar South Pole Base Artemis",
    desc: "Memorize the permanently shadowed crater telemetry in 5 seconds.",
    items: [
      { emoji: "🌕", label: "Shackleton Crater Rim" },
      { emoji: "🧊", label: "Water Ice Regolith Extractor" },
      { emoji: "⚡", label: "Kilopower Fission Reactor" },
      { emoji: "🚜", label: "Autonomous Lunar Bulldozer" },
      { emoji: "🏠", label: "Inflatable Habitation Module" },
      { emoji: "📡", label: "Lagrange Relay Dish" }
    ],
    q: "What small fission power plant supplied continuous 10 kW electrical power?",
    opts: ["Kilopower Fission Reactor", "Radioisotope Pack", "Fuel Cell", "Solar Tower"],
    ans: "Kilopower Fission Reactor",
    exp: "The Kilopower Fission Reactor (⚡) operated through the 14-day lunar night.",
    hint: "Nuclear fission energy system."
  },
  {
    title: "Laser Sails Interstellar Fleet Bay",
    desc: "Observe the relativistic lightsail bay in 5 seconds.",
    items: [
      { emoji: "⛵", label: "Graphene Micro-Sail" },
      { emoji: "💡", label: "100-Gigawatt Beamer Phased Array" },
      { emoji: "🛰️", label: "StarChip Gram Probe" },
      { emoji: "📸", label: "Multispectral Flyby Sensor" },
      { emoji: "📡", label: "Optical Laser Downlink" },
      { emoji: "🪐", label: "Proxima Centauri b Target" }
    ],
    q: "Which microscopic 1-gram wafer carried the camera and power circuits?",
    opts: ["StarChip Gram Probe", "Nano CubeSat", "Silicon Pill", "Photonic Chip"],
    ans: "StarChip Gram Probe",
    exp: "The StarChip Gram Probe (🛰️) accelerated to 20% the speed of light.",
    hint: "Gram-scale micro-spacecraft."
  },
  {
    title: "Supercomputer Neural Network Foundry",
    desc: "Scan the trillion-parameter AI weights architecture in 5 seconds.",
    items: [
      { emoji: "🧠", label: "Transformer Neural Graph" },
      { emoji: "💻", label: "Wafer-Scale AI Engine" },
      { emoji: "🌊", label: "Immersion Liquid Coolant" },
      { emoji: "📊", label: "Loss Convergence Plot" },
      { emoji: "🔌", label: "400Gbps InfiniBand Switch" },
      { emoji: "💾", label: "Checkpoint Shard Array" }
    ],
    q: "What chart confirmed mathematical convergence during the training run?",
    opts: ["Loss Convergence Plot", "ROC Curve", "Scatter Matrix", "Heatmap"],
    ans: "Loss Convergence Plot",
    exp: "The Loss Convergence Plot (📊) trended downwards with zero gradient explosion.",
    hint: "Statistical training loss diagram."
  },
  {
    title: "Pulsar Spacecraft Navigational Beacon",
    desc: "Study the millisecond cosmic timing pulses in 5 seconds.",
    items: [
      { emoji: "⭐", label: "Millisecond Radio Pulsar" },
      { emoji: "⏱️", label: "X-Ray Timing Telescope" },
      { emoji: "🧭", label: "Triangulated Spatial Fix" },
      { emoji: "💻", label: "Relativistic Ephemeris Code" },
      { emoji: "📡", label: "Wideband Horn Receiver" },
      { emoji: "🛰️", label: "Autonomous Deep Nav Unit" }
    ],
    q: "Which spinning neutron star acted as an infallible galactic GPS lighthouse?",
    opts: ["Millisecond Radio Pulsar", "Magnetar", "Quasar", "White Dwarf"],
    ans: "Millisecond Radio Pulsar",
    exp: "The Millisecond Radio Pulsar (⭐) rotated with clock-like precision every 1.5 ms.",
    hint: "Ultra-fast spinning collapsed star."
  },
  {
    title: "LIGO Laser Interferometer Arm",
    desc: "Memorize the gravitational wave detection optics in 5 seconds.",
    items: [
      { emoji: "💡", label: "Stabilized Infrared Laser" },
      { emoji: "🪞", label: "40kg Fused Silica Test Mirror" },
      { emoji: "📏", label: "4-Kilometer Vacuum Beam Tube" },
      { emoji: "🌊", label: "Spacetime Strain Ripple" },
      { emoji: "🧲", label: "Quadruple Pendulum Isolator" },
      { emoji: "💻", label: "Matched Filter Waveform" }
    ],
    q: "What ultra-pure glass mirror hung suspended to bounce the laser arms?",
    opts: ["40kg Fused Silica Test Mirror", "Beryllium Reflector", "Gold Mirror", "Quartz Prism"],
    ans: "40kg Fused Silica Test Mirror",
    exp: "The 40kg Fused Silica Test Mirror (🪞) moved less than 1/10,000th the width of a proton.",
    hint: "Heavy suspended optic mirror."
  },
  {
    title: "Cryogenic Dark Matter Trap Core",
    desc: "Analyze the WIMP recoil detector telemetry in 5 seconds.",
    items: [
      { emoji: "🧪", label: "Liquid Xenon Target Chamber" },
      { emoji: "⚡", label: "Dual-Phase Ionization Grid" },
      { emoji: "💡", label: "Photomultiplier Tube Ring" },
      { emoji: "🛡️", label: "Water Cherenkov Shield" },
      { emoji: "📈", label: "S1/S2 Scintillation Ratio" },
      { emoji: "⚛️", label: "Candidate WIMP Event" }
    ],
    q: "What noble liquid element provided the dense atomic target for invisible matter?",
    opts: ["Liquid Xenon Target Chamber", "Liquid Argon", "Liquid Helium", "Liquid Neon"],
    ans: "Liquid Xenon Target Chamber",
    exp: "Ultra-pure Liquid Xenon (🧪) filled the central 5-ton cryostat.",
    hint: "Heavy noble gas element."
  },
  {
    title: "Hyperloop Low-Pressure Transit Tube",
    desc: "Scan the 1,000 km/h maglev pod systems in 5 seconds.",
    items: [
      { emoji: "🚆", label: "Aerodynamic Passenger Pod" },
      { emoji: "🌀", label: "Axial Compressor Fan" },
      { emoji: "🧲", label: "Linear Induction Motor" },
      { emoji: "💨", label: "0.001 Atm Evacuated Tube" },
      { emoji: "🔋", label: "Regenerative Skid Brake" },
      { emoji: "📡", label: "Continuous Trackway Wi-Fi" }
    ],
    q: "What front compressor mechanism diverted residual air beneath the chassis?",
    opts: ["Axial Compressor Fan", "Turbocharger", "Ram Air Scoop", "Exhaust Turbine"],
    ans: "Axial Compressor Fan",
    exp: "The Axial Compressor Fan (🌀) relieved Kantrowitz aerodynamic limit pressure.",
    hint: "High-speed multi-blade fan."
  },
  {
    title: "Sub-Orbital Drop Capsule Bay",
    desc: "Memorize the planetary atmospheric reentry gear in 5 seconds.",
    items: [
      { emoji: "🚀", label: "Ablative Heatshield Cone" },
      { emoji: "🪂", label: "Supersonic Drogue Parachute" },
      { emoji: "⚡", label: "Retro-Rocket Thruster" },
      { emoji: "🛋️", label: "Molded Shock Absorb Couch" },
      { emoji: "📻", label: "Plasma Blackout Comm Transceiver" },
      { emoji: "🧯", label: "Impact Crush Structure" }
    ],
    q: "What thermal barrier burned away to protect occupants from 2,000°C reentry heat?",
    opts: ["Ablative Heatshield Cone", "Ceramic Tile", "Titanium Skin", "Gold Foil"],
    ans: "Ablative Heatshield Cone",
    exp: "The Ablative Heatshield Cone (🚀) peeled away in a glowing plasma sheath.",
    hint: "Sacrificial thermal shield."
  },
  {
    title: "Quantum Entanglement Router Gateway",
    desc: "Observe the quantum teleportation repeater nodes in 5 seconds.",
    items: [
      { emoji: "⚛️", label: "Spontaneous Parametric Down-Converter" },
      { emoji: "💡", label: "Entangled Photon Pair" },
      { emoji: "🪞", label: "Polarizing Beam Splitter" },
      { emoji: "💻", label: "Bell-State Measurement Unit" },
      { emoji: "🔌", label: "Single-Photon Avalanche Diode" },
      { emoji: "🛡️", label: "E91 Quantum Key Validator" }
    ],
    q: "What crystal setup generated pairs of entangled photons?",
    opts: ["Spontaneous Parametric Down-Converter", "Ruby Laser", "Prism", "LED Array"],
    ans: "Spontaneous Parametric Down-Converter",
    exp: "The Down-Converter crystal (⚛️) split pump photons into entangled daughter pairs.",
    hint: "Non-linear optical crystal converter."
  },
  {
    title: "James Webb Deep Field Instrument Bay",
    desc: "Study the infrared telescope sensors in 5 seconds.",
    items: [
      { emoji: "🪞", label: "18 Gold Beryllium Hexagons" },
      { emoji: "🛡️", label: "5-Layer Kapton Sunshield" },
      { emoji: "📸", label: "NIRCam Infrared Detector" },
      { emoji: "❄️", label: "MIRI Cryocooler Loop" },
      { emoji: "📡", label: "Ka-Band High-Gain Feed" },
      { emoji: "🌌", label: "First Light Galaxy Cluster" }
    ],
    q: "What lightweight metal coated in gold comprised the 18 segmented primary mirrors?",
    opts: ["18 Gold Beryllium Hexagons", "Aluminum Alloy", "Titanium Core", "Fused Quartz"],
    ans: "18 Gold Beryllium Hexagons",
    exp: "The 18 Gold Beryllium Hexagons (🪞) unfold into a 6.5-meter mirror aperture.",
    hint: "Hexagonal gold mirrors on JWST."
  },
  {
    title: "Exoplanet Biosignature Gas Spectrometer",
    desc: "Analyze the atmospheric transmission absorption spectrum in 5 seconds.",
    items: [
      { emoji: "🪐", label: "Habitable Zone Super-Earth" },
      { emoji: "💡", label: "Starlight Transmission Filter" },
      { emoji: "📈", label: "Water Vapor Absorption Notch" },
      { emoji: "🧪", label: "Methane-Oxygen Disequilibrium" },
      { emoji: "📊", label: "Carbon Dioxide Dip" },
      { emoji: "💻", label: "Photochemical Equilibrium Model" }
    ],
    q: "Which atmospheric gas coexistence pointed toward possible alien biological activity?",
    opts: ["Methane-Oxygen Disequilibrium", "Carbon Monoxide", "Argon Only", "Helium Vapor"],
    ans: "Methane-Oxygen Disequilibrium",
    exp: "The coexistence of Methane and Oxygen (🧪) strongly indicated a living biosphere.",
    hint: "Chemically unstable gas pairing created by life."
  },
  {
    title: "Dark Energy Survey Panoramic Camera",
    desc: "Memorize the 570-megapixel focal plane array in 5 seconds.",
    items: [
      { emoji: "📷", label: "DECam 570-Megapixel CCD Mosaic" },
      { emoji: "🔭", label: "Blanco 4-Meter Telescope" },
      { emoji: "🌌", label: "Gravitational Lensing Arc" },
      { emoji: "📊", label: "Baryon Acoustic Oscillation Peak" },
      { emoji: "💻", label: "Redshift Clustering Grid" },
      { emoji: "🛡️", label: "Cryogenic Dewar Vessel" }
    ],
    q: "What curved optical distortion revealed invisible dark matter halos?",
    opts: ["Gravitational Lensing Arc", "Aberration Ring", "Diffraction Spike", "Ghost Reflection"],
    ans: "Gravitational Lensing Arc",
    exp: "The Gravitational Lensing Arc (🌌) bent distant galaxy light around foreground clusters.",
    hint: "Curved light distorted by gravity."
  }
];

const finalHard = [...existingHard, ...formatScenes(additionalHardThemes, "hard", 5, 11)];
console.log(`Total Hard Scenes: ${finalHard.length}`);

const allMemory = [...finalEasy, ...finalMed, ...finalHard];
console.log(`Total Memory Challenge Scenes: ${allMemory.length}`);

// Validation
allMemory.forEach((s) => {
  if (!s.options.includes(s.correctAnswer)) {
    throw new Error(`Correct answer ${s.correctAnswer} missing from options in ${s.id}`);
  }
  if (new Set(s.options).size !== 4) {
    throw new Error(`Options not unique in ${s.id}: ${JSON.stringify(s.options)}`);
  }
  if (!s.items || s.items.length < 6) {
    throw new Error(`Scene ${s.id} does not have at least 6 items.`);
  }
});

const outPath = path.join(__dirname, '../frontend/src/data/memoryChallengeQuestions.js');
const header = `/**\n * MindForge - memoryChallengeQuestions\n * Exactly ${allMemory.length} verified high-quality visual memory challenge scenes.\n * 40 Easy | 40 Medium | 40 Hard\n */\n\n`;
const content = header + `export const memoryChallengeQuestions = ` + JSON.stringify(allMemory, null, 2) + `;\n\nexport default memoryChallengeQuestions;\n`;
fs.writeFileSync(outPath, content, 'utf8');
console.log(`Successfully wrote ${allMemory.length} scenes to ${outPath}`);
