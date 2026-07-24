let sums = [];
let shots = [];

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
  sums.push(s);
}

function getTurretTarget(s) {
  let best = null;
  let bestDist = Infinity;

  if (boss) {
    const d = dist(s, boss);
    best = boss;
    bestDist = d;
  }

  for (let e of enemies) {
    const d = dist(s, e);
    if (d < bestDist) {
      best = e;
      bestDist = d;
    }
  }

  return best;
}

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

    if (s.summoner && Math.random() < 0.01) {
      createSummon(
        s.x + (Math.random()*40 - 20),
        s.y + (Math.random()*40 - 20)
      );
    }
  }
}

function updateTurretShots() {
  for (let i = shots.length - 1; i >= 0; i--) {
    const s = shots[i];

    s.x += s.dx * s.sp;
    s.y += s.dy * s.sp;

    if (s.x < 0 || s.x > c.width || s.y < 0 || s.y > c.height) {
      shots.splice(i, 1);
      continue;
    }

    let hit = false;

    if (boss) {
      const d = dist(s, boss);
      if (d < s.r + boss.r) {
        boss.hp -= s.dmg;
        if (s.lifesteal) p.hp = Math.min(p.maxHp, p.hp + s.lifesteal*s.dmg);
        if (boss.hp <= 0) { boss = null; money += 20; }
        shots.splice(i, 1);
        continue;
      }
    }

    for (let j = enemies.length - 1; j >= 0; j--) {
      const e = enemies[j];
      const d = dist(s, e);
      if (d < s.r + e.r) {
        e.hp -= s.dmg;
        if (s.lifesteal) p.hp = Math.min(p.maxHp, p.hp + s.lifesteal*s.dmg);
        if (e.hp <= 0) {
          money += e.type === "summoner" ? 30 : 5;
          enemies.splice(j, 1);
        }
        shots.splice(i, 1);
        hit = true;
        break;
      }
    }
  }
}
