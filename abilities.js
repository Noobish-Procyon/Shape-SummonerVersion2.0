// abilities.js

// =========================
// EVO ABILITY REGISTRY
// =========================
const evoAbilities = {
  orb: "manaPulse",
  fortress: "shieldWall",
  prism: "laserBeam",
  hellstar: "flameNova",
  hive: "swarmBurst",
  vampire: "bloodDrain",

  nova: "supernova",
  citadel: "ironDome",
  laserCore: "deathRay",
  demonSun: "hellfireStorm",
  swarmLord: "broodmother",
  bloodGod: "crimsonRebirth"
};

let abilityCooldown = 0;

// =========================
// ACTIVATE ABILITY
// =========================
function activateAbility() {
  if (!currentEvo) return;
  if (abilityCooldown > 0) return;

  const ability = evoAbilities[currentEvo];
  if (!ability) return;

  abilityCooldown = 300; // 5 seconds cooldown

  if (ability === "manaPulse") manaPulse();
  if (ability === "shieldWall") shieldWall();
  if (ability === "laserBeam") laserBeam();
  if (ability === "flameNova") flameNova();
  if (ability === "swarmBurst") swarmBurst();
  if (ability === "bloodDrain") bloodDrain();

  if (ability === "supernova") supernova();
  if (ability === "ironDome") ironDome();
  if (ability === "deathRay") deathRay();
  if (ability === "hellfireStorm") hellfireStorm();
  if (ability === "broodmother") broodmother();
  if (ability === "crimsonRebirth") crimsonRebirth();
}

// =========================
// TIER 2 ABILITIES
// =========================

// Orb — Mana Pulse
function manaPulse() {
  p.mana = Math.min(p.maxMana, p.mana + 30);
}

// Fortress — Shield Wall
function shieldWall() {
  p.hp = Math.min(p.maxHp, p.hp + 50);
}

// Prism — Laser Beam
function laserBeam() {
  for (let e of enemies) {
    e.hp -= 40;
  }
}

// Hellstar — Flame Nova
function flameNova() {
  for (let e of enemies) {
    const d = Math.hypot(e.x - p.x, e.y - p.y);
    if (d < 200) e.hp -= 60;
  }
}

// Hive — Swarm Burst
function swarmBurst() {
  for (let i = 0; i < 5; i++) {
    createSummon(
      p.x + (Math.random() * 80 - 40),
      p.y + (Math.random() * 80 - 40)
    );
  }
}

// Vampire — Blood Drain
function bloodDrain() {
  let total = 0;
  for (let e of enemies) {
    e.hp -= 20;
    total += 20;
  }
  p.hp = Math.min(p.maxHp, p.hp + total * 0.2);
}

// =========================
// TIER 3 ABILITIES
// =========================

// Nova — Supernova
function supernova() {
  for (let e of enemies) {
    e.hp -= 150;
  }
}

// Citadel — Iron Dome
function ironDome() {
  for (let s of sums) {
    s.hp += 100;
  }
}

// LaserCore — Death Ray
function deathRay() {
  for (let e of enemies) {
    e.hp -= 200;
  }
}

// DemonSun — Hellfire Storm
function hellfireStorm() {
  for (let e of enemies) {
    e.hp -= 100;
    e.turretDelay += 20;
  }
}

// SwarmLord — Broodmother
function broodmother() {
  for (let i = 0; i < 10; i++) {
    createSummon(
      p.x + (Math.random() * 120 - 60),
      p.y + (Math.random() * 120 - 60)
    );
  }
}

// BloodGod — Crimson Rebirth
function crimsonRebirth() {
  p.hp = p.maxHp;
  p.mana = p.maxMana;

  for (let e of enemies) {
    e.hp -= 300;
  }
}
