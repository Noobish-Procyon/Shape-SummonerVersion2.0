// classes.js

// =========================
// BASE CLASS DATA
// =========================
let currentClass = "circle";
let currentEvo = null;

const classPrices = {
  circle: 0,
  square: 100,
  triangle: 150,
  pentagram: 200,
  octagon: 250,
  hexagon: 300
};

const classColors = {
  circle: "#ffffff",
  square: "#4aa3ff",
  triangle: "#b84dff",
  pentagram: "#ff4d4d",
  octagon: "#4dff88",
  hexagon: "#ffb84d"
};

// =========================
// EVOLUTION DATA
// =========================
const classEvo = {
  circle: ["circle", "orb", "nova"],
  square: ["square", "fortress", "citadel"],
  triangle: ["triangle", "prism", "laserCore"],
  pentagram: ["pentagram", "hellstar", "demonSun"],
  octagon: ["octagon", "hive", "swarmLord"],
  hexagon: ["hexagon", "vampire", "bloodGod"]
};

const evoPrices = {
  orb: 200,
  nova: 500,

  fortress: 300,
  citadel: 700,

  prism: 350,
  laserCore: 800,

  hellstar: 400,
  demonSun: 900,

  hive: 450,
  swarmLord: 1000,

  vampire: 350,
  bloodGod: 900
};

const evoColors = {
  orb: "#88ccff",
  nova: "#cce6ff",

  fortress: "#3366ff",
  citadel: "#0033cc",

  prism: "#cc33ff",
  laserCore: "#ff00ff",

  hellstar: "#ff3333",
  demonSun: "#990000",

  hive: "#33ff99",
  swarmLord: "#00cc66",

  vampire: "#ff3366",
  bloodGod: "#cc0033"
};

// =========================
// APPLY BASE CLASS STATS
// =========================
function applyClassStats(s, cls) {
  // Base stats
  s.hp = 30;
  s.turretDelay = 30;
  s.turretDmgMult = 1;
  s.turretSpd = 6;
  s.lifesteal = 0;
  s.summoner = false;

  if (cls === "square") {
    s.hp += 40;
    s.turretDelay = 40;
    s.turretDmgMult = 0.8;
  }

  if (cls === "triangle") {
    s.turretDelay = 50;
    s.turretDmgMult = 2.0;
  }

  if (cls === "pentagram") {
    s.turretDelay = 15;
    s.turretDmgMult = 0.7;
    s.turretSpd = 9;
  }

  if (cls === "octagon") {
    s.turretDelay = 35;
    s.turretDmgMult = 1.2;
    s.summoner = true;
  }

  if (cls === "hexagon") {
    s.turretDelay = 30;
    s.turretDmgMult = 1.3;
    s.lifesteal = 0.1;
  }

  s.col = classColors[cls];
}

// =========================
// APPLY EVOLUTION STATS
// =========================
function applyEvolutionStats(s, evo) {
  if (!evo) return;

  // Tier 2 evolutions
  if (evo === "orb") {
    s.hp += 20;
    s.turretDelay += 10;
  }
  if (evo === "fortress") {
    s.hp += 60;
    s.turretDmgMult *= 1.2;
  }
  if (evo === "prism") {
    s.turretDmgMult *= 1.5;
    s.turretSpd += 2;
  }
  if (evo === "hellstar") {
    s.turretDelay -= 5;
    s.turretSpd += 3;
  }
  if (evo === "hive") {
    s.summoner = true;
  }
  if (evo === "vampire") {
    s.lifesteal += 0.1;
  }

  // Tier 3 evolutions
  if (evo === "nova") {
    s.hp += 100;
    s.turretDmgMult *= 1.5;
  }
  if (evo === "citadel") {
    s.hp += 150;
    s.turretDelay += 20;
  }
  if (evo === "laserCore") {
    s.turretDmgMult *= 2.5;
    s.turretSpd += 4;
  }
  if (evo === "demonSun") {
    s.turretDelay -= 10;
    s.turretSpd += 5;
    s.lifesteal += 0.2;
  }
  if (evo === "swarmLord") {
    s.summoner = true;
    s.turretDelay -= 15;
  }
  if (evo === "bloodGod") {
    s.lifesteal += 0.3;
    s.hp += 200;
  }

  s.col = evoColors[evo];
}

// =========================
// BUY CLASS
// =========================
function buyClass(type) {
  const cost = classPrices[type];

  if (money >= cost) {
    money -= cost;
    currentClass = type;
    currentEvo = null; // reset evolution

    for (let s of sums) {
      applyClassStats(s, type);
    }
  }
}

// =========================
// EVOLVE CLASS
// =========================
function evolveClass() {
  const evoList = classEvo[currentClass];
  const currentIndex = evoList.indexOf(currentEvo || currentClass);

  if (currentIndex >= evoList.length - 1) return; // max evolution

  const nextEvo = evoList[currentIndex + 1];
  const cost = evoPrices[nextEvo];

  if (money < cost) return;

  money -= cost;
  currentEvo = nextEvo;

  for (let s of sums) {
    applyClassStats(s, currentClass);
    applyEvolutionStats(s, currentEvo);
  }
}
