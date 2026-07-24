// turrets.js

let sums = [];
let shots = [];

// =========================
// CREATE SUMMON
// =========================
function createSummon(xPos, yPos) {
  let s = {
    x: xPos,
    y: yPos,
    r: 20,
    col: classColors[currentClass],
    hp: 30,
    turretCooldown: 0,
    turretDelay: 30,
    turretDmgMult: 1,
    turretSpd: 6,
    rot: 0,
    lifesteal: 0,
    summoner: false
  };

  applyClassStats(s, currentClass);
  applyEvolutionStats(s, currentEvo);
  sums.push(s);
}

// =========================
// FIND TARGET FOR SUMMON
// =========================
function getTurretTarget(s) {
  let best = null;
  let bestDist = Infinity;

  // Boss first
  if (boss) {
    const d = dist(s, boss);
    best = boss;
    bestDist = d;
  }

  // Elites second
  for (let e of elites) {
    const d = dist(s, e);
    if (d < bestDist) {
      best = e;
      bestDist = d;
    }
  }

  // Normal enemies last
  for (let e of enemies) {
    const d = dist(s, e);
    if (d < bestDist) {
      best = e;
      bestDist = d;
    }
  }

  return best;
}

// =========================
// UPDATE SUMMONS
// =========================
function updateTurrets() {
  for (let s of sums) {
    s.rot += 0.03;
    border(s);

    const target = getTurretTarget(s);
    if (!target || dead) continue;

    if (s.turretCooldown > 0) {
      s.turretCooldown--;
      continue;
    }

    const a = Math.atan2(target.y - s.y, target.x - s.x);

    shots.push({
      x: s.x,
      y: s.y,
      r: 8,
      sp: s.turretSpd,
      dx: Math.cos(a),
      dy: Math.sin(a),
      col: s.col,
      dmg: p.dmg * s.turretDmgMult,
      turret: true,
      lifesteal: s.lifesteal
    });

    s.turretCooldown = s.turretDelay;

    // Summoner summons more summons
    if (s.summoner && Math.random() < 0.01) {
      createSummon(
        s.x + (Math.random()*40 - 20),
        s.y + (Math.random()*40 - 20)
      );
    }
  }
}

// =========================
// UPDATE SUMMON SHOTS
// =========================
function updateTurretShots() {
  for (let i = shots.length - 1; i >= 0; i--) {
    const s = shots[i];

    s.x += s.dx * s.sp;
    s.y += s.dy * s.sp;

    if (s.x < 0 || s.x > c.width || s.y < 0 || s.y > c.height) {
      shots.splice(i, 1);
      continue;
    }

    // =========================
    // HIT BOSS
    // =========================
    if (boss) {
      const d = dist(s, boss);
      if (d < s.r + boss.r) {
        boss.hp -= s.dmg;

        if (s.lifesteal)
          p.hp = Math.min(p.maxHp, p.hp + s.lifesteal * s.dmg);

        if (boss.hp <= 0) {
          boss = null;
          money += 20;
          gainExp(500);
          difficulty += 0.20; // difficulty increase on boss kill
        }

        shots.splice(i, 1);
        continue;
      }
    }

    // =========================
    // HIT ELITES
    // =========================
    for (let j = elites.length - 1; j >= 0; j--) {
      const e = elites[j];
      const d = dist(s, e);

      if (d < s.r + e.r) {
        e.hp -= s.dmg;

        if (s.lifesteal)
          p.hp = Math.min(p.maxHp, p.hp + s.lifesteal * s.dmg);

        if (e.hp <= 0) {
          money += 15;
          gainExp(100);
          difficulty += 0.20; // difficulty increase on elite kill
          elites.splice(j, 1);
        }

        shots.splice(i, 1);
        break;
      }
    }

    // =========================
    // HIT NORMAL ENEMIES
    // =========================
    for (let j = enemies.length - 1; j >= 0; j--) {
      const e = enemies[j];
      const d = dist(s, e);

      if (d < s.r + e.r) {
        e.hp -= s.dmg;

        if (s.lifesteal)
          p.hp = Math.min(p.maxHp, p.hp + s.lifesteal * s.dmg);

        if (e.hp <= 0) {

          // MINION — NO difficulty increase
          if (e.type === "minion") {
            money += 5;
            gainExp(10);
          }

          // SUMMONER — difficulty increases
          else if (e.type === "summoner") {
            money += 30;
            gainExp(40);
            difficulty += 0.20;
          }

          enemies.splice(j, 1);
        }

        shots.splice(i, 1);
        break;
      }
    }
  }
}
