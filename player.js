const p = {
  x: c.width / 2,
  y: c.height / 2,
  r: 20,
  s: 5,
  hp: 100,
  maxHp: 100,
  mana: 50,
  maxMana: 50,
  regen: 0.1,
  mRegen: 0.2,
  dmg: 1,
  shootCooldown: 0,
  shootDelay: 10
};

let money = Number(localStorage.getItem("cgMoney")) || 0;
let difficulty = Number(localStorage.getItem("cgDiff")) || 1;

let paused = false;
let dead = false;

let keys = {};
let lastX = p.x;
let lastY = p.y;

onmousemove = e => {
  lastX = e.clientX;
  lastY = e.clientY;
};

onkeydown = e => {
  keys[e.key] = true;
  if (e.key === "Escape") paused = !paused;
  if (!paused && e.key === " ") shoot();
  if (e.key === "e" && !paused && !dead) activateAbility();
};

onkeyup = e => {
  keys[e.key] = false;
};

c.addEventListener("mousedown", e => {
  const mx = e.clientX;
  const my = e.clientY;

  if (paused) {
    handleShopClick(mx, my);
    return;
  }

  if (dead) {
    respawn();
    return;
  }

  if (p.mana < 5) return;
  p.mana -= 5;
  createSummon(mx, my);
});

function shoot() {
  if (dead || paused) return;
  if (p.shootCooldown > 0) return;
  if (p.mana < 3) return;

  p.shootCooldown = p.shootDelay;
  p.mana -= 3;

  const a = Math.atan2(lastY - p.y, lastX - p.x);

  shots.push({
    x: p.x,
    y: p.y,
    r: 10,
    sp: 8,
    dx: Math.cos(a),
    dy: Math.sin(a),
    col: "white",
    dmg: p.dmg,
    turret: false
  });
}

function updatePlayer() {
  if (dead) return;

  if (keys["w"] || keys["W"]) p.y -= p.s;
  if (keys["s"] || keys["S"]) p.y += p.s;
  if (keys["a"] || keys["A"]) p.x -= p.s;
  if (keys["d"] || keys["D"]) p.x += p.s;

  border(p);

  p.hp = Math.min(p.maxHp, p.hp + p.regen);
  p.mana = Math.min(p.maxMana, p.mana + p.mRegen);

  if (p.shootCooldown > 0) p.shootCooldown--;
}
