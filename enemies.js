// enemies.js

let enemies = [];
let elites = [];
let boss = null;

let bShots = [];
let eliteShots = [];

// =========================
// BASIC MINION (50% weaker)
// =========================
function spawnMinion(x, y) {
  enemies.push({
    type: "minion",
    x, y,
    r: 15,
    hp: 10 * difficulty,              // was 20 * difficulty
    s: 1.5 + difficulty * 0.1,        // was 3 + difficulty * 0.2
    dmg: 0.1 * difficulty,            // was 0.2 * difficulty
    col: "#ff88cc"
  });
}

// =========================
// SUMMONER (50% weaker)
// =========================
function spawnSummonerEnemy() {
  enemies.push({
    type: "summoner",
    x: Math.random() * c.width,
    y: Math.random() * c.height,
    r: 35,
    hp: 30 * difficulty,              // was 60 * difficulty
    s: 0.75,                          // was 1.5
    cd: 0,
    col: "#aa55ff"
  });
}

// =========================
// GOD BOSS (50% weaker)
// =========================
function spawnBoss() {
  boss = {
    x: Math.random() * c.width,
    y: Math.random() * c.height,
    r: 50,
    hp: 10 * difficulty,              // was 20 * difficulty
    s: 1 + difficulty * 0.1,          // was 2 + difficulty * 0.2
    cd: 0
  };
}

// Auto-spawn boss every 6 seconds
setInterval(() => {
  if (!boss && !paused && !dead) spawnBoss();
}, 6000);

// =========================
// ELITE TYPES (50% weaker)
// =========================
const eliteTypes = {
  titan: {
    hpMult: 6,                        // was 12
    spdMult: 0.6,                     // was 1.2
    dmgMult: 0.6,                     // was 1.2
    size: 40,
    col: "#8888ff",
    drops: ["damageUp", "maxHpUp", "turretDamageUp"]
  },

  swift: {
    hpMult: 4,                        // was 8
    spdMult: 1.5,                     // was 3
    dmgMult: 0.5,                     // was 1
    size: 35,
    col: "#55ccff",
    drops: ["moveSpeedUp", "attackSpeedUp", "projSpeedUp"]
  },

  inferno: {
    hpMult: 5,                        // was 10
    spdMult: 0.75,                    // was 1.5
    dmgMult: 0.75,                    // was 1.5
    size: 38,
    col: "#ff5533",
    drops: ["multiShot", "burnDamage", "cdrUp"]
  },

  brood: {
    hpMult: 4.5,                      // was 9
    spdMult: 0.65,                    // was 1.3
    dmgMult: 0.6,                     // was 1.2
    size: 42,
    col: "#33ff88",
    drops: ["summonHpUp", "summonAtkUp", "summonCountUp"]
  }
};

// =========================
// SPAWN ELITE
// =========================
function spawnElite() {
  const keys = Object.keys(eliteTypes);
  const pick = eliteTypes[keys[Math.floor(Math.random() * keys.length)]];

  elites.push({
    type: "elite",
    eliteType: pick,
    x: Math.random() * c.width,
    y: Math.random() * c.height,
    r: pick.size,
    hp: pick.hpMult * difficulty,
    s: pick.spdMult + difficulty * 0.05,
    dmg: pick.dmgMult * difficulty,
    cd: 0,
    col: pick.col
  });
}

// Auto-spawn elites every 8 seconds (rare)
setInterval(() => {
  if (!paused && !dead && Math.random() < 0.2) {
    spawnElite();
  }
}, 8000);

// =========================
// UPDATE NORMAL ENEMIES
// =========================
function updateEnemies() {
  for (let i = enemies.length - 1; i >= 0; i--) {
    const e = enemies[i];

    if (e.type === "summoner") {
      const a = Math.atan2(p.y - e.y, p.x - e.x);
      e.x += Math.cos(a) * e.s;
      e.y += Math.sin(a) * e.s;
      border(e);

      e.cd--;
      if (e.cd <= 0) {
        const count = 2 + Math.floor(Math.random() * 2); // fewer minions
        for (let k = 0; k < count; k++) {
          spawnMinion(
            e.x + (Math.random() * 40 - 20),
            e.y + (Math.random() * 40 - 20)
          );
        }
        e.cd = 240; // slower spawns
      }
    }

    if (e.type === "minion") {
      const a = Math.atan2(p.y - e.y, p.x - e.x);
      e.x += Math.cos(a) * e.s;
      e.y += Math.sin(a) * e.s;
      border(e);
    }

    if (dist(e, p) < e.r + p.r) {
      p.hp -= e.dmg; // reduced damage
      if (p.hp <= 0) dead = true;
    }
  }
}

// =========================
// UPDATE ELITES
// =========================
function updateElites() {
  for (let i = elites.length - 1; i >= 0; i--) {
    const e = elites[i];

    const a = Math.atan2(p.y - e.y, p.x - e.x);
    e.x += Math.cos(a) * e.s;
    e.y += Math.sin(a) * e.s;
    border(e);

    if (dist(e, p) < e.r + p.r) {
      p.hp -= e.dmg * 0.5; // reduced elite contact damage
      if (p.hp <= 0) dead = true;
    }

    e.cd--;
    if (e.cd <= 0) {
      eliteShots.push({
        x: e.x,
        y: e.y,
        r: 10,
        sp: 3 + difficulty,           // slower projectiles
        dx: Math.cos(a),
        dy: Math.sin(a),
        col: e.col,
        dmg: e.dmg * 0.5              // reduced projectile damage
      });
      e.cd = 120;
    }
  }
}

// =========================
// UPDATE GOD BOSS
// =========================
function updateBoss() {
  if (!boss || dead) return;

  const a = Math.atan2(p.y - boss.y, p.x - boss.x);
  boss.x += Math.cos(a) * boss.s;
  boss.y += Math.sin(a) * boss.s;
  border(boss);

  boss.cd--;
  if (boss.cd <= 0) {
    const ba = Math.atan2(p.y - boss.y, p.x - boss.x);
    bShots.push({
      x: boss.x,
      y: boss.y,
      r: 8,
      sp: 4 + difficulty,            // slower boss shots
      dx: Math.cos(ba),
      dy: Math.sin(ba),
      col: "orange",
      dmg: 1 * difficulty            // was 2 * difficulty
    });
    boss.cd = 80;
  }
}

// =========================
// ELITE PROJECTILES
// =========================
function updateEliteShots() {
  for (let i = eliteShots.length - 1; i >= 0; i--) {
    const s = eliteShots[i];

    s.x += s.dx * s.sp;
    s.y += s.dy * s.sp;

    if (s.x < 0 || s.x > c.width || s.y < 0 || s.y > c.height) {
      eliteShots.splice(i, 1);
      continue;
    }

    if (dist(s, p) < s.r + p.r) {
      p.hp -= s.dmg;
      eliteShots.splice(i, 1);
      if (p.hp <= 0) dead = true;
      continue;
    }
  }
}

// =========================
// BOSS PROJECTILES
// =========================
function updateBossShots() {
  for (let i = bShots.length - 1; i >= 0; i--) {
    const b = bShots[i];

    b.x += b.dx * b.sp;
    b.y += b.dy * b.sp;

    if (b.x < 0 || b.x > c.width || b.y < 0 || b.y > c.height) {
      bShots.splice(i, 1);
      continue;
    }

    if (dist(b, p) < b.r + p.r) {
      p.hp -= b.dmg;
      bShots.splice(i, 1);
      if (p.hp <= 0) dead = true;
      continue;
    }

    for (let j = sums.length - 1; j >= 0; j--) {
      const s = sums[j];
      if (dist(b, s) < b.r + s.r) {
        s.hp -= b.dmg;
        if (s.hp <= 0) sums.splice(j, 1);
        bShots.splice(i, 1);
        break;
      }
    }
  }
}
