let currentClass = "circle";

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

function applyClassStats(s, cls) {
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

function buyClass(type) {
  const cost = classPrices[type];
  if (money >= cost) {
    money -= cost;
    currentClass = type;
    for (let s of sums) applyClassStats(s, type);
  }
}
