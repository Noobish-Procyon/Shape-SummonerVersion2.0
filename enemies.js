// enemies.js

let enemies = [];
let elites = [];
let boss = null;

let bShots = [];
let eliteShots = [];

// =========================
// SUMMONER ENEMY
// =========================
function spawnSummonerEnemy() {
  enemies.push({
    type: "summoner",
    x: Math.random() * c.width,
    y: Math.random() * c.height,
    r: 35,
    hp: 60 * difficulty,
    s: 1.5,
    cd: 0,
    col: "#aa55ff"
  });
}

// =========================
// MINION ENEMY
// =========================
function spawnMinion(x, y) {
  enemies.push({
    type: "minion",
    x, y,
    r: 15,
    hp: 20 * difficulty,
    s: 3 + difficulty * 0.2,
    col: "#ff88cc"
  });
}

// =========================
// GOD BOSS
// =========================
function spawnBoss() {
  boss = {
    x: Math.random() * c.width,
    y: Math.random() * c.height,
    r: 50,
    hp: 20 * difficulty,
    s: 2 + difficulty * 0.2,
    cd: 0
  };
}

// Auto-spawn boss every 6 seconds
setInterval(() => {
  if (!boss && !paused && !dead) spawnBoss();
}, 6000);

// =========================
// ELITE TYPES (weaker than boss)
// =========================
const eliteTypes = {
  titan: {
    hpMult: 12,
    spdMult: 1.2,
    dmgMult: 1.2,
    size: 40,
    col: "#8888ff",
    drops: ["damageUp", "maxHpUp", "turretDamageUp"]
  },

  swift: {
    hpMult: 8,
    spdMult: 3,
    dmgMult: 1,
    size: 35,
    col: "#55ccff",
    drops: ["moveSpeedUp", "attackSpeedUp", "projSpeedUp"]
  },

  inferno: {
    hpMult: 10,
    spdMult: 1.5,
    dmgMult: 1.5,
    size: 38,
    col: "#ff5533",
    drops: ["multiShot", "burnDamage", "cdrUp"]
  },

  brood: {
    hpMult: 9,
    spdMult: 1.3,
    dmgMult: 1.2,
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
    s: pick.spdMult + difficulty * 0.1,
    dmg: pick.dmgMult * difficulty,
    cd: 0,
    col: pick.col
  });
}

// Auto-spawn elites rarely
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
        const count = 3 + Math.floor(Math.random() * 3);
        for (let k = 0; k < count; k++) {
          spawnMinion(
            e.x + (Math.random() * 40 - 20),
            e.y + (Math.random() * 40 - 20)
          );
        }
        e.cd = 180;
      }
    }

    if (e.type === "minion") {
      const a = Math.atan2(p.y - e.y, p.x - e.x);
      e.x += Math.cos(a) * e.s;
      e.y += Math.sin(a) * e.s;
      border(e);
    }

    const dp = dist(e, p);
    if (dp < e.r + p.r) {
      p.hp -= 0.5 * difficulty;
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
      p.hp -= e.dmg * 0.5;
      if (p.hp <= 0) dead = true;
    }

    e.cd--;
    if (e.cd <= 0) {
      eliteShots.push({
        x: e.x,
        y: e.y,
        r: 10,
        sp: 4 + difficulty,
        dx: Math.cos(a),
        dy: Math.sin(a),
        col: e.col,
        dmg: e.dmg
      });
      e.cd = 90;
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
      sp: 5 + difficulty,
      dx: Math.cos(ba),
      dy: Math.sin(ba),
      col: "orange",
      dmg: 2 * difficulty
    });
    boss.cd = 60;
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
